import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import "./OfferUi.scss";

export const offerMoney = value => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export function OfferSummary({ offer, otherPartyLabel, otherPartyName }) {
  return <>
    <header className="offer-card__header">
      <img src={offer.product_image || offer.product_url} alt="" />
      <div className="offer-card__identity">
        <h2>{offer.offer_items?.length > 1 ? `Combined offer (${offer.offer_items.length} products)` : offer.product_name || "Unavailable product"}</h2>
        <p>{otherPartyLabel}: {otherPartyName || "—"} <span aria-hidden="true">·</span> Total units: {offer.quantity}</p>
      </div>
      <span className={`offer-status offer-status--${offer.status}`}>{offer.status.replaceAll("_", " ")}</span>
    </header>
    {offer.offer_items?.length > 0 && <ul className="offer-card__items">{offer.offer_items.map(item => <li key={item.offer_item_id || item.product_id}>
      <span>{item.product_name} × {item.quantity} at {offerMoney(item.listed_unit_price)} each</span>
      <strong>{offerMoney(item.listed_total)}</strong>
    </li>)}</ul>}
    <div className="offer-card__prices" aria-label="Offer price summary">
      <div><span>Listed total</span><strong>{offerMoney(offer.listed_total)}</strong></div>
      <div><span>Original offer</span><strong>{offerMoney(offer.original_offer_total)}</strong></div>
      <div><span>Current offer</span><strong>{offerMoney(offer.current_offer_total)}</strong></div>
      {offer.status === "accepted" && <div className="offer-card__agreed"><span>Final agreed price</span><strong>{offerMoney(offer.final_agreed_total)}</strong></div>}
    </div>
  </>;
}

const actionNames = { offer: "Original offer", counteroffer: "Counteroffer", accept: "Accepted", reject: "Rejected", cancel: "Cancelled", contact_confirmed: "Contact sharing confirmed" };
export function OfferHistory({ entries = [] }) {
  return <details className="negotiation-history">
    <summary><span>Negotiation history <small>({entries.length})</small></span><FaChevronDown aria-hidden="true" /></summary>
    <div className="negotiation-history__body">
      {entries.length ? <ol className="negotiation-history__timeline">{entries.map((entry, index) => <li key={entry.entry_id || `${entry.created_at}-${index}`}>
        <div className="negotiation-history__entry-head"><strong>{entry.sender_role === "customer" ? "Customer" : "Seller"}</strong><span>{actionNames[entry.action] || entry.action}</span></div>
        <strong className="negotiation-history__amount">{offerMoney(entry.amount)}</strong>
        {entry.message && <p className="negotiation-history__message">{entry.message}</p>}
        <time dateTime={entry.created_at}>{new Date(entry.created_at).toLocaleString()}</time>
      </li>)}</ol> : <p className="negotiation-history__empty">No negotiation activity yet.</p>}
    </div>
  </details>;
}

export function CounterofferForm({ max, busy, onSubmit, onCancel }) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [validation, setValidation] = useState("");
  const submit = async event => {
    event.preventDefault();
    const price = Number(amount);
    if (!amount.trim() || !Number.isFinite(price) || price <= 0) { setValidation("Enter a counteroffer greater than ₹0."); return; }
    if (Math.abs(price * 100 - Math.round(price * 100)) > 1e-7) { setValidation("Enter an amount with no more than two decimal places."); return; }
    if (price > Number(max)) { setValidation(`Counteroffer must be no more than ${offerMoney(max)}.`); return; }
    setValidation("");
    if (await onSubmit(price, message.trim())) onCancel();
  };
  return <form className="counteroffer-form" onSubmit={submit} noValidate>
    <h3>Make a Counteroffer</h3>
    <div className="counteroffer-form__fields">
      <label>Counteroffer total price (₹)
        <input type="number" name="amount" min="0.01" max={max} step="0.01" value={amount} onChange={event => { setAmount(event.target.value); setValidation(""); }} aria-invalid={Boolean(validation)} aria-describedby={validation ? "counteroffer-price-error" : "counteroffer-price-help"} />
        <small id="counteroffer-price-help">Maximum {offerMoney(max)}</small>
        {validation && <small id="counteroffer-price-error" className="counteroffer-form__error" role="alert">{validation}</small>}
      </label>
      <label>Message (optional)
        <textarea name="message" rows="2" maxLength="1000" value={message} onChange={event => setMessage(event.target.value)} placeholder="Add a note for the other party" />
      </label>
    </div>
    <div className="counteroffer-form__actions">
      <button type="submit" disabled={busy}>{busy ? "Sending…" : "Send Counteroffer"}</button>
      <button type="button" className="offer-button--secondary" disabled={busy} onClick={onCancel}>Cancel</button>
    </div>
  </form>;
}
