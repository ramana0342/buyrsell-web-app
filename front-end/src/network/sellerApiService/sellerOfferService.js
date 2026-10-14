import sellerAxios from "../axios/sellerAxios";
export const getReceivedOffers = () => sellerAxios.get("/seller/offers");
export const actOnReceivedOffer = (id, data) => sellerAxios.post(`/seller/offers/${id}/actions`, data);
export const confirmReceivedOfferContact = (id, consent) => sellerAxios.post(`/seller/offers/${id}/contact-confirmation`, { consent });
