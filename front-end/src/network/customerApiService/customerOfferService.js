import customerAxios from "../axios/customerAxios";
export const createOffer = data => customerAxios.post("/customer/offers", data);
export const createCombinedOffer = data => customerAxios.post("/customer/offers/combined", data);
export const getMyOffers = () => customerAxios.get("/customer/offers");
export const actOnOffer = (id, data) => customerAxios.post(`/customer/offers/${id}/actions`, data);
export const confirmOfferContact = (id, consent) => customerAxios.post(`/customer/offers/${id}/contact-confirmation`, { consent });
