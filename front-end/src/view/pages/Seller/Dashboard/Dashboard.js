import "./Dashboard.scss";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaCheckCircle, FaExclamationTriangle, FaRedo, FaArrowRight } from "react-icons/fa";
import SellerLayout from "../../../layouts/SellerLayout/SellerLayout";
import { useSelector } from "react-redux";
import { getSellerDashboardStats } from "../../../../network/sellerApiService/sellerProductService";
import { getReceivedOffers, actOnReceivedOffer, confirmReceivedOfferContact } from "../../../../network/sellerApiService/sellerOfferService";
import { CounterofferForm, OfferHistory, OfferSummary } from "../../../components/Offers/OfferUi";
import { SkeletonRows } from "../../../components/Skeletons/Skeletons";

const Dashboard = () => {
  const seller = useSelector(state => state.seller?.seller);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [offerError, setOfferError] = useState("");
  const [offerSuccess, setOfferSuccess] = useState("");
  const [busyOfferId, setBusyOfferId] = useState("");
  const [counterofferId, setCounterofferId] = useState("");

  const loadOffers = useCallback(async (showLoading = false) => {
    if (showLoading) setOffersLoading(true);
    setOfferError("");
    try {
      const result = await getReceivedOffers();
      setOffers(result.data.response || []);
      return true;
    } catch (requestError) {
      setOfferError(requestError.response?.data?.status?.message || "Unable to load received offers.");
      return false;
    } finally {
      if (showLoading) setOffersLoading(false);
    }
  }, []);

  useEffect(() => {
    let alive = true;
    getSellerDashboardStats().then(result => { if (alive) { setStats(result.response); setError(""); } })
      .catch(requestError => { if (alive) setError(requestError.response?.data?.status?.message || "Unable to load dashboard data."); })
      .finally(() => alive && setLoading(false));
    loadOffers(true);
    return () => { alive = false; };
  }, [loadOffers]);

  const act = async (offer, action, amount, message = "") => {
    setBusyOfferId(offer.offer_id);
    setOfferError("");
    setOfferSuccess("");
    try {
      await actOnReceivedOffer(offer.offer_id, { action, amount, message });
      await loadOffers();
      setOfferSuccess(action === "counteroffer" ? "Counteroffer sent to the customer." : action === "accept" ? "Acceptance recorded. Complete contact sharing to finalize." : "Customer offer rejected.");
      return true;
    } catch (requestError) {
      setOfferError(requestError.response?.data?.status?.message || "Unable to update offer.");
      return false;
    } finally {
      setBusyOfferId("");
    }
  };

  const shareContact = async (offer, consent) => {
    setBusyOfferId(offer.offer_id);
    setOfferError("");
    setOfferSuccess("");
    try {
      await confirmReceivedOfferContact(offer.offer_id, consent);
      await loadOffers();
      setOfferSuccess(consent ? "Contact sharing confirmed." : "Contact sharing declined; this negotiation was cancelled.");
    } catch (requestError) {
      setOfferError(requestError.response?.data?.status?.message || "Unable to update contact-sharing confirmation.");
    } finally {
      setBusyOfferId("");
    }
  };

  const cards = [
    { title: "Total products", value: stats?.total_products, icon: <FaBoxOpen />, color: "blue" },
    { title: "Active products", value: stats?.active_products, icon: <FaCheckCircle />, color: "green" },
    { title: "Out of stock", value: stats?.out_of_stock_products, icon: <FaExclamationTriangle />, color: "amber" }
  ];

  return <SellerLayout><section className="seller-dashboard">
    <header className="seller-dashboard__intro"><div><p className="seller-dashboard__eyebrow">OVERVIEW</p><h2>Welcome back{seller?.seller_name || seller?.name ? `, ${seller.seller_name || seller.name}` : ""}</h2><p>Here’s how your product catalog is doing.</p></div><Link to="/seller/products" className="seller-dashboard__link">Manage products <FaArrowRight /></Link></header>
    {error ? <div className="seller-dashboard__error" role="alert"><p>{error}</p><button type="button" onClick={() => { setLoading(true); setError(""); getSellerDashboardStats().then(result => setStats(result.response)).catch(requestError => setError(requestError.response?.data?.status?.message || "Unable to load dashboard data.")).finally(() => setLoading(false)); }}><FaRedo /> Retry</button></div>
      : <div className="seller-dashboard__cards">{cards.map(card => <article className="seller-dashboard__card" key={card.title}><div className={`seller-dashboard__icon seller-dashboard__icon--${card.color}`}>{card.icon}</div><div><p>{card.title}</p><strong>{loading ? <span className="seller-dashboard__skeleton" aria-label="Loading" /> : card.value ?? 0}</strong></div></article>)}</div>}
    {!loading && stats?.total_products === 0 && <div className="seller-dashboard__empty"><h3>Your catalog is ready to grow</h3><p>Add your first product to start selling in the marketplace.</p><Link to="/seller/products/add">Add your first product</Link></div>}

    <section className="received-offers" aria-labelledby="received-offers-title">
      <h2 id="received-offers-title">Received Offers</h2>
      {offerError && <p className="offer-card__error" role="alert">{offerError}</p>}
      {offerSuccess && <p className="offer-card__success" role="status">{offerSuccess}</p>}
      {offersLoading ? <SkeletonRows count={2} /> : offers.length === 0 ? <div className="offers-empty"><p>{offerError ? "Offers could not be loaded." : "No offers received yet."}</p>{offerError && <button type="button" onClick={() => loadOffers(true)}>Retry</button>}</div> : offers.map(offer => {
        const busy = busyOfferId === offer.offer_id;
        const canAnswer = ["pending", "countered"].includes(offer.status) && offer.can_respond;
        const counterOpen = counterofferId === offer.offer_id;
        return <article className="offer-card" key={offer.offer_id}>
          <OfferSummary offer={offer} otherPartyLabel="Customer" otherPartyName={offer.other_party_name} />
          <OfferHistory entries={offer.history} />
          {offer.status === "pending_contact" && <>
            <p className="offer-card__notice">Price accepted. Both parties must confirm contact sharing before details are revealed.</p>
            {!offer.seller_contact_consent && <div className="offer-card__actions">
              <button type="button" disabled={busy} onClick={() => shareContact(offer, true)}>Confirm and share my contact</button>
              <button type="button" className="offer-button--secondary" disabled={busy} onClick={() => shareContact(offer, false)}>Decline contact sharing</button>
            </div>}
          </>}
          {offer.status === "accepted" && <p className="offer-card__notice">Customer contact: {offer.shared_customer_email}</p>}
          {canAnswer && !counterOpen && <div className="offer-card__actions">
            <button type="button" disabled={busy} onClick={() => act(offer, "accept")}>{offer.status === "pending" ? "Accept Customer Offer" : "Accept Customer Counteroffer"}</button>
            <button type="button" className="offer-button--secondary" disabled={busy} onClick={() => act(offer, "reject")}>Reject Customer Offer</button>
            <button type="button" className="offer-button--secondary" onClick={() => { setOfferError(""); setOfferSuccess(""); setCounterofferId(offer.offer_id); }}>Make a Counteroffer</button>
          </div>}
          {canAnswer && counterOpen && <CounterofferForm max={offer.listed_total} busy={busy} onSubmit={(amount, message) => act(offer, "counteroffer", amount, message)} onCancel={() => setCounterofferId("")} />}
        </article>;
      })}
    </section>
  </section></SellerLayout>;
};

export default Dashboard;
