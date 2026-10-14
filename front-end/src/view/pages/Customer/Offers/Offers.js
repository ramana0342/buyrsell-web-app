import React, { useCallback, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getMyOffers, actOnOffer, confirmOfferContact } from "../../../../network/customerApiService/customerOfferService";
import Header from "../../../components/Header/Header";
import { CounterofferForm, OfferHistory, OfferSummary } from "../../../components/Offers/OfferUi";
import "./Offers.scss";

export default function Offers() {
  const isAuthenticated = useSelector(state => state.customer.isAuthenticated);
  const accessToken = useSelector(state => state.customer.accessToken);
  const [offers, setOffers] = useState([]);
  const [offersOwner, setOffersOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyOfferId, setBusyOfferId] = useState("");
  const [counterofferId, setCounterofferId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const requestGeneration = useRef(0);

  const load = useCallback(async (showLoading = false) => {
    if (!isAuthenticated) { setOffers([]); setOffersOwner(null); setLoading(false); return false; }
    const generation = ++requestGeneration.current;
    if (showLoading) setLoading(true);
    setError("");
    try {
      const result = await getMyOffers();
      if (generation !== requestGeneration.current || !localStorage.getItem("customerAccessToken")) return false;
      setOffers(result.data.response || []);
      setOffersOwner(accessToken);
      return true;
    } catch (requestError) {
      if (generation === requestGeneration.current && localStorage.getItem("customerAccessToken")) setError(requestError.response?.data?.status?.message || "Unable to load offers.");
      return false;
    } finally {
      if (showLoading && generation === requestGeneration.current) setLoading(false);
    }
  }, [isAuthenticated, accessToken]);

  useEffect(() => {
    if (!isAuthenticated) { requestGeneration.current += 1; setOffers([]); setOffersOwner(null); setError(""); setSuccess(""); setLoading(false); return; }
    setOffers([]);
    load(true);
    return () => { requestGeneration.current += 1; };
  }, [isAuthenticated, accessToken, load]);

  const act = async (offer, action, amount, message = "") => {
    setBusyOfferId(offer.offer_id);
    setError("");
    setSuccess("");
    try {
      await actOnOffer(offer.offer_id, { action, amount, message });
      await load();
      setSuccess(action === "counteroffer" ? "Counteroffer sent to the seller." : action === "accept" ? "Acceptance recorded. Complete contact sharing to finalize." : action === "reject" ? "Counteroffer rejected." : "Offer cancelled.");
      return true;
    } catch (requestError) {
      setError(requestError.response?.data?.status?.message || "Unable to update offer.");
      return false;
    } finally {
      setBusyOfferId("");
    }
  };

  const confirm = async (offer, consent) => {
    setBusyOfferId(offer.offer_id);
    setError("");
    setSuccess("");
    try {
      await confirmOfferContact(offer.offer_id, consent);
      await load();
      setSuccess(consent ? "Contact sharing confirmed." : "Contact sharing declined; this negotiation was cancelled.");
    } catch (requestError) {
      setError(requestError.response?.data?.status?.message || "Unable to update contact-sharing confirmation.");
    } finally {
      setBusyOfferId("");
    }
  };

  if (!isAuthenticated) return <Navigate to="/" replace />;
  const visibleOffers = offersOwner === accessToken ? offers : [];

  return <>
    <Header />
    <main className="offers-page">
      <h1>My Offers</h1>
      {error && <p className="offer-card__error" role="alert">{error}</p>}
      {success && <p className="offer-card__success" role="status">{success}</p>}
      {loading ? <p className="offer-loading" role="status">Loading your offers…</p> : visibleOffers.length === 0 ? <div className="offers-empty"><p>{error ? "Your offers could not be loaded." : "You haven't made any offers yet."}</p>{error && <button type="button" onClick={() => load(true)}>Retry</button>}</div> : visibleOffers.map(offer => {
        const busy = busyOfferId === offer.offer_id;
        const canAnswer = offer.status === "countered" && offer.can_respond;
        const counterOpen = counterofferId === offer.offer_id;
        return <article className="offer-card" key={offer.offer_id}>
          <OfferSummary offer={offer} otherPartyLabel="Seller" otherPartyName={offer.other_party_name} />
          <OfferHistory entries={offer.history} />
          {offer.status === "pending_contact" && <>
            <p className="offer-card__notice">Price accepted. Both parties must confirm contact sharing before details are revealed.</p>
            {!offer.customer_contact_consent && <div className="offer-card__actions">
              <button type="button" disabled={busy} onClick={() => confirm(offer, true)}>Confirm and share my contact</button>
              <button type="button" className="offer-button--secondary" disabled={busy} onClick={() => confirm(offer, false)}>Decline contact sharing</button>
            </div>}
          </>}
          {offer.status === "accepted" && <p className="offer-card__notice">Seller contact: {offer.shared_seller_email} {offer.shared_seller_phone}</p>}
          {offer.status === "pending" && <div className="offer-card__actions"><button type="button" className="offer-button--secondary" disabled={busy} onClick={() => act(offer, "cancel")}>Cancel offer</button></div>}
          {canAnswer && !counterOpen && <div className="offer-card__actions">
            <button type="button" disabled={busy} onClick={() => act(offer, "accept")}>Accept Seller Counteroffer</button>
            <button type="button" className="offer-button--secondary" disabled={busy} onClick={() => act(offer, "reject")}>Reject Counteroffer</button>
            <button type="button" className="offer-button--secondary" onClick={() => { setError(""); setSuccess(""); setCounterofferId(offer.offer_id); }}>Make a Counteroffer</button>
          </div>}
          {canAnswer && counterOpen && <CounterofferForm max={offer.listed_total} busy={busy} onSubmit={(amount, message) => act(offer, "counteroffer", amount, message)} onCancel={() => setCounterofferId("")} />}
        </article>;
      })}
    </main>
  </>;
}
