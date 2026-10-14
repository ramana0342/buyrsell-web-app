import pool from "../config/database.js";

const response = (res, data, code = 200) => res.status(code).json({ status: { code, success: true }, response: data });
const fail = (res, code, message) => res.status(code).json({ status: { code, success: false, message }, response: null });
const validAmount = value => (typeof value === "number" || (typeof value === "string" && value.trim() !== "")) && Number.isFinite(Number(value)) && Number(value) > 0 && Number(value) <= 999999999999 && Math.abs(Number(value) * 100 - Math.round(Number(value) * 100)) < 1e-7;
const partyId = (req, role) => role === "customer" ? req.customer?.customerId : req.seller?.sellerId;

async function listOffers(req, res, role) {
  const id = partyId(req, role);
  const result = await pool.query(`
    SELECT o.*,
      COALESCE(lines.product_name, p.product_name, 'Unavailable product') AS product_name,
      p.slug, COALESCE(lines.product_image, p.product_url) AS product_url,
      COALESCE(lines.product_image, (SELECT image_url FROM buy_sell_mart.product_images WHERE product_id=p.product_id ORDER BY display_order LIMIT 1), p.product_url) AS product_image,
      COALESCE(lines.offer_items, '[]'::jsonb) AS offer_items,
      CASE WHEN $2='customer' THEN s.business_name ELSE c.full_name END AS other_party_name,
      CASE WHEN o.status='accepted' THEN c.email END AS shared_customer_email,
      CASE WHEN o.status='accepted' THEN s.email END AS shared_seller_email,
      CASE WHEN o.status='accepted' THEN s.phone END AS shared_seller_phone
    FROM buy_sell_mart.product_offers o
    LEFT JOIN buy_sell_mart.products p ON p.product_id=o.product_id::text
    LEFT JOIN LATERAL (
      SELECT string_agg(i.product_name_snapshot, ', ' ORDER BY i.created_at) AS product_name,
        (array_agg(i.product_image_snapshot ORDER BY i.created_at))[1] AS product_image,
        jsonb_agg(jsonb_build_object(
          'offer_item_id', i.offer_item_id,
          'product_id', i.product_id,
          'product_name', i.product_name_snapshot,
          'product_image', i.product_image_snapshot,
          'quantity', i.quantity,
          'listed_unit_price', i.listed_unit_price,
          'listed_total', i.listed_total
        ) ORDER BY i.created_at) AS offer_items
      FROM buy_sell_mart.product_offer_items i WHERE i.offer_id=o.offer_id
    ) lines ON TRUE
    LEFT JOIN buy_sell_mart.sellers s ON s.seller_id::text=o.seller_id
    LEFT JOIN buy_sell_mart.customers c ON c.customer_id::text=o.customer_id
    WHERE ($2='customer' AND o.customer_id=$1) OR ($2='seller' AND o.seller_id=$1)
    ORDER BY o.updated_at DESC`, [id, role]);
  const ids = result.rows.map(o => o.offer_id);
  let history = [];
  if (ids.length) history = (await pool.query(`SELECT offer_id, sender_role, amount, message, action, created_at FROM buy_sell_mart.product_offer_history WHERE offer_id=ANY($1::uuid[]) ORDER BY created_at`, [ids])).rows;
  return response(res, result.rows.map(o => {
    const entries = history.filter(h => h.offer_id === o.offer_id);
    return { ...o, history: entries, can_respond: ['pending','countered'].includes(o.status) && entries.at(-1)?.sender_role !== role };
  }));
}

export const customerOffers = (req, res) => listOffers(req, res, "customer").catch(e => { console.error("Offer list failed", e.message); fail(res, 500, "Unable to load offers"); });
export const sellerOffers = (req, res) => listOffers(req, res, "seller").catch(e => { console.error("Offer list failed", e.message); fail(res, 500, "Unable to load offers"); });

export async function createOffer(req, res) {
  const { productId, quantity, offeredTotal, message = "" } = req.body || {};
  if (!productId || !Number.isInteger(quantity) || quantity < 1 || !validAmount(offeredTotal) || typeof message !== "string" || message.length > 1000) return fail(res, 400, "Enter a valid product, quantity, offer amount, and message.");
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const p = await client.query("SELECT product_id, seller_id, selling_price, stock_quantity FROM buy_sell_mart.products WHERE product_id::text=$1 AND product_status='active' FOR UPDATE", [String(productId)]);
    if (!p.rowCount) { await client.query("ROLLBACK"); return fail(res, 404, "This product is unavailable."); }
    const product = p.rows[0];
    const unit = Number(product.selling_price), unitCents = Math.round(unit * 100), listedCents = unitCents * quantity, total = listedCents / 100;
    if (!Number.isSafeInteger(quantity) || quantity > Number(product.stock_quantity) || !Number.isSafeInteger(unitCents) || !Number.isSafeInteger(listedCents) || total > 999999999999 || Math.round(Number(offeredTotal) * 100) > listedCents) { await client.query("ROLLBACK"); return fail(res, 400, "Quantity or offer exceeds the available product limit."); }
    const created = await client.query(`INSERT INTO buy_sell_mart.product_offers(customer_id,seller_id,product_id,quantity,listed_unit_price,listed_total,original_offer_total,current_offer_total)
      VALUES($1,$2,$3,$4,$5,$6,$7,$7) RETURNING *`, [partyId(req, "customer"), String(product.seller_id), String(product.product_id), quantity, unit, total, Number(offeredTotal)]);
    const offer = created.rows[0];
    await client.query("INSERT INTO buy_sell_mart.product_offer_history(offer_id,sender_role,sender_id,amount,message,action) VALUES($1,'customer',$2,$3,$4,'offer')", [offer.offer_id, partyId(req, "customer"), Number(offeredTotal), message.trim() || null]);
    await client.query("COMMIT");
    return response(res, offer, 201);
  } catch (e) { await client.query("ROLLBACK"); console.error("Create offer failed", e.message); return fail(res, 500, "Unable to submit offer."); }
  finally { client.release(); }
}

export async function createCombinedOffer(req, res) {
  const { items, offeredTotal, message = "" } = req.body || {};
  if (!Array.isArray(items) || items.length < 2 || items.length > 100 || typeof message !== "string" || message.length > 1000 || !validAmount(offeredTotal)) {
    return fail(res, 400, "Select between two and 100 products and enter a valid total offer and message.");
  }
  const normalized = [];
  const seen = new Set();
  for (const item of items) {
    const productId = String(item?.productId || "");
    const quantity = Number(item?.quantity);
    if (!productId || seen.has(productId) || !Number.isSafeInteger(quantity) || quantity < 1) return fail(res, 400, "Each product must be unique and have a valid quantity.");
    seen.add(productId);
    normalized.push({ productId, quantity });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const productResult = await client.query(`
      SELECT p.product_id, p.seller_id, p.product_name, p.product_url, p.selling_price, p.stock_quantity,
        (SELECT pi.image_url FROM buy_sell_mart.product_images pi WHERE pi.product_id=p.product_id ORDER BY pi.display_order LIMIT 1) AS product_image
      FROM buy_sell_mart.products p
      WHERE p.product_id=ANY($1::varchar[]) AND p.product_status='active'
      ORDER BY p.product_id FOR UPDATE`, [normalized.map(item => item.productId)]);
    if (productResult.rowCount !== normalized.length) { await client.query("ROLLBACK"); return fail(res, 404, "One or more selected products are unavailable."); }

    const products = new Map(productResult.rows.map(product => [String(product.product_id), product]));
    const first = productResult.rows[0];
    if (productResult.rows.some(product => String(product.seller_id) !== String(first.seller_id))) {
      await client.query("ROLLBACK"); return fail(res, 400, "A combined offer can include products from one seller only.");
    }

    let listedCents = 0;
    let totalQuantity = 0;
    const lineItems = [];
    for (const requested of normalized) {
      const product = products.get(requested.productId);
      const unitCents = Math.round(Number(product.selling_price) * 100);
      if (requested.quantity > Number(product.stock_quantity) || !Number.isSafeInteger(unitCents) || unitCents <= 0) {
        await client.query("ROLLBACK"); return fail(res, 400, "A selected quantity exceeds available stock or has an invalid listed price.");
      }
      const lineCents = unitCents * requested.quantity;
      if (!Number.isSafeInteger(lineCents) || !Number.isSafeInteger(listedCents + lineCents)) {
        await client.query("ROLLBACK"); return fail(res, 400, "The combined listed total is too large.");
      }
      listedCents += lineCents;
      totalQuantity += requested.quantity;
      if (totalQuantity > 2147483647) { await client.query("ROLLBACK"); return fail(res, 400, "The combined quantity is too large."); }
      lineItems.push({ ...requested, product, unitCents, lineCents });
    }
    if (listedCents <= 0 || listedCents / 100 > 999999999999 || Math.round(Number(offeredTotal) * 100) > listedCents) {
      await client.query("ROLLBACK"); return fail(res, 400, "The total offer must be above zero and no more than the combined listed total.");
    }

    const listedTotal = listedCents / 100;
    const created = await client.query(`
      INSERT INTO buy_sell_mart.product_offers(customer_id,seller_id,product_id,quantity,listed_unit_price,listed_total,original_offer_total,current_offer_total)
      VALUES($1,$2,NULL,$3,NULL,$4,$5,$5) RETURNING *`,
    [partyId(req, "customer"), String(first.seller_id), totalQuantity, listedTotal, Number(offeredTotal)]);
    const offer = created.rows[0];
    for (const line of lineItems) {
      await client.query(`INSERT INTO buy_sell_mart.product_offer_items
        (offer_id,product_id,product_name_snapshot,product_image_snapshot,quantity,listed_unit_price,listed_total)
        VALUES($1,$2,$3,$4,$5,$6,$7)`, [offer.offer_id, line.product.product_id, line.product.product_name,
        line.product.product_image || line.product.product_url, line.quantity, line.unitCents / 100, line.lineCents / 100]);
    }
    await client.query("INSERT INTO buy_sell_mart.product_offer_history(offer_id,sender_role,sender_id,amount,message,action) VALUES($1,'customer',$2,$3,$4,'offer')",
      [offer.offer_id, partyId(req, "customer"), Number(offeredTotal), message.trim() || null]);
    await client.query("COMMIT");
    return response(res, { ...offer, offer_items: lineItems.map(line => ({ product_id: line.product.product_id, product_name: line.product.product_name, quantity: line.quantity, listed_unit_price: line.unitCents / 100, listed_total: line.lineCents / 100 })) }, 201);
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("Create combined offer failed", e.message);
    return fail(res, 500, "Unable to submit combined offer.");
  } finally { client.release(); }
}

export async function offerAction(req, res) {
  const role = req.customer ? "customer" : "seller", id = partyId(req, role);
  const { action, amount, message = "" } = req.body || {};
  if (!['counteroffer','accept','reject','cancel'].includes(action) || typeof message !== "string" || message.length > 1000 || (action === "counteroffer" && !validAmount(amount))) return fail(res, 400, "Invalid negotiation action.");
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const found = await client.query("SELECT * FROM buy_sell_mart.product_offers WHERE offer_id=$1 AND (customer_id=$2 OR seller_id=$2) FOR UPDATE", [req.params.offerId, id]);
    if (!found.rowCount) { await client.query("ROLLBACK"); return fail(res, 404, "Offer not found."); }
    const o = found.rows[0];
    const own = role === "customer" ? o.customer_id === id : o.seller_id === id;
    if (!own) { await client.query("ROLLBACK"); return fail(res, 404, "Offer not found."); }
    if (new Date(o.expires_at) < new Date() && ['pending','countered'].includes(o.status)) {
      await client.query("UPDATE buy_sell_mart.product_offers SET status='expired',updated_at=NOW() WHERE offer_id=$1", [o.offer_id]);
      await client.query("COMMIT"); return fail(res, 409, "This offer has expired.");
    }
    if (!['pending','countered'].includes(o.status)) { await client.query("ROLLBACK"); return fail(res, 409, "This offer can no longer be changed."); }
    if (action === "counteroffer" || action === "accept") {
      const last = await client.query("SELECT sender_role FROM buy_sell_mart.product_offer_history WHERE offer_id=$1 ORDER BY created_at DESC LIMIT 1", [o.offer_id]);
      if (last.rows[0]?.sender_role === role) { await client.query("ROLLBACK"); return fail(res, 409, "Only the other party's current offer can be answered."); }
    }
    if (action === "counteroffer") {
      if (Number(amount) > Number(o.listed_total)) { await client.query("ROLLBACK"); return fail(res, 400, "Counteroffer cannot exceed the listed total."); }
      await client.query("UPDATE buy_sell_mart.product_offers SET status='countered',current_offer_total=$2,updated_at=NOW() WHERE offer_id=$1", [o.offer_id, Number(amount)]);
      await client.query("INSERT INTO buy_sell_mart.product_offer_history(offer_id,sender_role,sender_id,amount,message,action) VALUES($1,$2,$3,$4,$5,'counteroffer')", [o.offer_id, role, id, Number(amount), message.trim() || null]);
    } else if (action === "accept") {
      const agreed = Number(o.current_offer_total);
      await client.query("UPDATE buy_sell_mart.product_offers SET status='pending_contact',accepted_by=$2,final_agreed_total=$3,updated_at=NOW() WHERE offer_id=$1", [o.offer_id, role, agreed]);
      await client.query("INSERT INTO buy_sell_mart.product_offer_history(offer_id,sender_role,sender_id,amount,message,action) VALUES($1,$2,$3,$4,$5,'accept')", [o.offer_id, role, id, agreed, message.trim() || null]);
    } else {
      const status = action === "reject" ? "rejected" : "cancelled";
      await client.query("UPDATE buy_sell_mart.product_offers SET status=$2,updated_at=NOW() WHERE offer_id=$1", [o.offer_id, status]);
      await client.query("INSERT INTO buy_sell_mart.product_offer_history(offer_id,sender_role,sender_id,amount,message,action) VALUES($1,$2,$3,$4,$5,$6)", [o.offer_id, role, id, o.current_offer_total, message.trim() || null, action]);
    }
    const updated = await client.query("SELECT * FROM buy_sell_mart.product_offers WHERE offer_id=$1", [o.offer_id]);
    await client.query("COMMIT"); return response(res, updated.rows[0]);
  } catch (e) { await client.query("ROLLBACK"); console.error("Offer action failed", e.message); return fail(res, 500, "Unable to update offer."); }
  finally { client.release(); }
}

export async function confirmContact(req, res) {
  const role = req.customer ? "customer" : "seller", id = partyId(req, role);
  if (typeof req.body?.consent !== "boolean") return fail(res, 400, "Choose whether to share contact details.");
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const q = await client.query("SELECT * FROM buy_sell_mart.product_offers WHERE offer_id=$1 AND (customer_id=$2 OR seller_id=$2) FOR UPDATE", [req.params.offerId, id]);
    if (!q.rowCount) { await client.query("ROLLBACK"); return fail(res, 404, "Offer not found."); }
    const o = q.rows[0];
    if (o.status !== "pending_contact") { await client.query("ROLLBACK"); return fail(res, 409, "This offer is not awaiting contact confirmation."); }
    if (new Date(o.expires_at) < new Date()) { await client.query("UPDATE buy_sell_mart.product_offers SET status='expired',updated_at=NOW() WHERE offer_id=$1", [o.offer_id]); await client.query("COMMIT"); return fail(res, 409, "This offer has expired."); }
    if (!req.body.consent) {
      await client.query("UPDATE buy_sell_mart.product_offers SET status='cancelled',updated_at=NOW() WHERE offer_id=$1", [o.offer_id]);
      await client.query("INSERT INTO buy_sell_mart.product_offer_history(offer_id,sender_role,sender_id,amount,message,action) VALUES($1,$2,$3,$4,'Contact sharing declined','cancel')", [o.offer_id, role, id, o.final_agreed_total]);
      await client.query("COMMIT"); return response(res, { status: "cancelled" });
    }
    const column = role === "customer" ? "customer_contact_consent" : "seller_contact_consent";
    const timeColumn = role === "customer" ? "customer_confirmed_at" : "seller_confirmed_at";
    await client.query(`UPDATE buy_sell_mart.product_offers SET ${column}=TRUE,${timeColumn}=NOW(),updated_at=NOW() WHERE offer_id=$1`, [o.offer_id]);
    await client.query("INSERT INTO buy_sell_mart.product_offer_history(offer_id,sender_role,sender_id,amount,action) VALUES($1,$2,$3,$4,'contact_confirmed')", [o.offer_id, role, id, o.final_agreed_total]);
    const state = await client.query("SELECT customer_contact_consent,seller_contact_consent FROM buy_sell_mart.product_offers WHERE offer_id=$1", [o.offer_id]);
    if (state.rows[0].customer_contact_consent && state.rows[0].seller_contact_consent) await client.query("UPDATE buy_sell_mart.product_offers SET status='accepted',agreed_at=NOW(),updated_at=NOW() WHERE offer_id=$1", [o.offer_id]);
    const updated = await client.query("SELECT * FROM buy_sell_mart.product_offers WHERE offer_id=$1", [o.offer_id]);
    await client.query("COMMIT");
    const offer = updated.rows[0];
    if (offer.status !== "accepted") return response(res, { offer, waitingForOtherParty: true });
    const contacts = await pool.query(`SELECT c.full_name AS customer_name,c.email AS customer_email,s.owner_name AS seller_name,s.business_name,s.email AS seller_email,s.phone AS seller_phone FROM buy_sell_mart.customers c,buy_sell_mart.sellers s WHERE c.customer_id::text=$1 AND s.seller_id::text=$2`, [offer.customer_id, offer.seller_id]);
    return response(res, { offer, contacts: contacts.rows[0] || null });
  } catch (e) { await client.query("ROLLBACK"); console.error("Contact confirmation failed", e.message); return fail(res, 500, "Unable to confirm contact sharing."); }
  finally { client.release(); }
}
