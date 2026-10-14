import React, { useMemo, useState } from "react";
import { createCombinedOffer, createOffer } from "../../../../network/customerApiService/customerOfferService";
import "./Offers.scss";

const money = value => `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export default function OfferModal({ product, products, initialQuantity = 1, onClose, onSubmitted }) {
  const initialProducts = products || (product ? [{ ...product, quantity: initialQuantity }] : []);
  const [lines, setLines] = useState(() => initialProducts.map(item => ({ ...item, offerQuantity: Number(item.quantity) || 1 })));
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const listedTotal = useMemo(() => lines.reduce((total, line) => total + Math.round(Number(line.selling_price) * 100) * Number(line.offerQuantity || 0), 0) / 100, [lines]);
  const isCombined = lines.length > 1;

  const setQuantity = (productId, value) => setLines(current => current.map(line => String(line.product_id) === String(productId) ? { ...line, offerQuantity: value } : line));

  const submit = async event => {
    event.preventDefault();
    setError("");
    const normalized = lines.map(line => ({ productId: line.product_id, quantity: Number(line.offerQuantity) }));
    if (!normalized.length || normalized.some((line, index) => !Number.isSafeInteger(line.quantity) || line.quantity < 1 || line.quantity > Number(lines[index].stock_quantity))) return setError("Enter a valid available quantity for each selected product.");
    const offerCents = Math.round(Number(amount) * 100);
    if (!Number.isSafeInteger(offerCents) || offerCents <= 0 || offerCents > Math.round(listedTotal * 100)) return setError("Enter a total offer above zero and no more than the listed total.");
    setBusy(true);
    try {
      if (isCombined) await createCombinedOffer({ items: normalized, offeredTotal: offerCents / 100, message });
      else await createOffer({ productId: normalized[0].productId, quantity: normalized[0].quantity, offeredTotal: offerCents / 100, message });
      onSubmitted?.();
      setSubmitted(true);
    } catch (requestError) {
      setError(requestError.response?.data?.status?.message || "Unable to submit offer.");
    } finally { setBusy(false); }
  };

  return <div className="offer-overlay" role="presentation" onMouseDown={event => event.target === event.currentTarget && !busy && onClose()}>
    <section className="offer-modal" role="dialog" aria-modal="true" aria-labelledby="offer-title">
      <button className="offer-modal__close" type="button" onClick={onClose} disabled={busy} aria-label="Close">×</button>
      <h2 id="offer-title">{submitted ? "Offer submitted" : isCombined ? "Make a combined offer" : "Make an offer"}</h2>
      <div className="offer-modal__products">
        {lines.map(line => <div className="offer-modal__product" key={line.product_id}>
          <img src={line.image || line.product_url || line.images?.[0]?.image_url} alt="" />
          <div><strong>{line.product_name}</strong><span>Listed unit price: {money(line.selling_price)}</span></div>
        </div>)}
      </div>
      {submitted ? <div role="status"><p>Your offer was sent to the seller. You can follow its status in My Offers.</p><button type="button" onClick={onClose}>Done</button></div> : <form onSubmit={submit}>
        {lines.map(line => <label className="offer-modal__quantity" key={line.product_id}>{line.product_name} quantity
          <input type="number" min="1" max={line.stock_quantity} step="1" value={line.offerQuantity} onChange={event => setQuantity(line.product_id, event.target.value)} required />
          <small>Up to {line.stock_quantity} available</small>
        </label>)}
        <div className="offer-modal__total">{isCombined ? "Combined listed total" : "Listed total"}<strong>{money(listedTotal)}</strong></div>
        <label>{isCombined ? "Your total offer for all selected products (₹)" : "Your total offer price (₹)"}
          <input type="number" min="0.01" max={listedTotal} step="0.01" value={amount} onChange={event => setAmount(event.target.value)} required />
        </label>
        {isCombined && <p className="offer-modal__group-note">This amount applies to all products listed above together.</p>}
        <label>Message (optional)<textarea maxLength="1000" value={message} onChange={event => setMessage(event.target.value)} rows="3" /></label>
        {error && <p className="offer-error" role="alert">{error}</p>}
        <div className="offer-modal__buttons"><button type="button" className="offer-secondary" disabled={busy} onClick={onClose}>Cancel</button><button type="submit" disabled={busy}>{busy ? "Submitting…" : "Submit offer"}</button></div>
      </form>}
    </section>
  </div>;
}
