import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import customerReducer, { logoutCustomer, loginSuccess } from "../../../../features/customer/customerSlice";
import Offers from "./Offers";
import { getMyOffers } from "../../../../network/customerApiService/customerOfferService";

jest.mock("../../../components/Header/Header", () => () => <div>Header</div>);
jest.mock("../../../../network/customerApiService/customerOfferService", () => ({
  getMyOffers: jest.fn(), actOnOffer: jest.fn(), confirmOfferContact: jest.fn()
}));

const offer = { offer_id: "offer-a", status: "pending", quantity: 1, listed_total: 100, original_offer_total: 90, current_offer_total: 90, offer_items: [{ offer_item_id: "line-a", product_name: "Private item", quantity: 1, listed_unit_price: 100, listed_total: 100 }], history: [] };
function renderOffers(store, path = "/customer/offers") {
  return render(<Provider store={store}><MemoryRouter initialEntries={[path]}><Routes><Route path="/customer/offers" element={<Offers />} /><Route path="/" element={<h1>Public home</h1>} /></Routes></MemoryRouter></Provider>);
}
function makeStore(authenticated = true) {
  return configureStore({ reducer: { customer: customerReducer }, preloadedState: { customer: { customer: authenticated ? { customer_id: "customer-a" } : null, accessToken: authenticated ? "token-a" : null, isAuthenticated: authenticated } } });
}

beforeEach(() => { localStorage.clear(); getMyOffers.mockReset(); });

test("direct navigation while logged out redirects without requesting private offers", async () => {
  const store = makeStore(false);
  renderOffers(store);
  expect(await screen.findByRole("heading", { name: "Public home" })).toBeInTheDocument();
  expect(getMyOffers).not.toHaveBeenCalled();
});

test("logout clears a visible offer and an in-flight response cannot restore it", async () => {
  localStorage.setItem("customerAccessToken", "token-a");
  let resolveRequest;
  getMyOffers.mockImplementation(() => new Promise(resolve => { resolveRequest = resolve; }));
  const store = makeStore(true);
  renderOffers(store);
  await waitFor(() => expect(getMyOffers).toHaveBeenCalledTimes(1));
  resolveRequest({ data: { response: [offer] } });
  expect(await screen.findByText(/Private item/)).toBeInTheDocument();
  await act(async () => { store.dispatch(logoutCustomer()); });
  expect(await screen.findByRole("heading", { name: "Public home" })).toBeInTheDocument();
  expect(screen.queryByText(/Private item/)).not.toBeInTheDocument();
});

test("a request from the previous session cannot populate My Offers after logout", async () => {
  localStorage.setItem("customerAccessToken", "token-a");
  let resolveStale;
  getMyOffers.mockImplementation(() => new Promise(resolve => { resolveStale = resolve; }));
  const store = makeStore(true);
  renderOffers(store);
  await waitFor(() => expect(getMyOffers).toHaveBeenCalledTimes(1));
  await act(async () => { store.dispatch(logoutCustomer()); });
  resolveStale({ data: { response: [offer] } });
  expect(await screen.findByRole("heading", { name: "Public home" })).toBeInTheDocument();
  expect(screen.queryByText(/Private item/)).not.toBeInTheDocument();
});

test("a previous customer's data is cleared before a new customer request resolves", async () => {
  localStorage.setItem("customerAccessToken", "token-a");
  getMyOffers.mockResolvedValueOnce({ data: { response: [offer] } });
  const store = makeStore(true);
  renderOffers(store);
  expect(await screen.findByText(/Private item/)).toBeInTheDocument();
  let resolveNew;
  getMyOffers.mockImplementationOnce(() => new Promise(resolve => { resolveNew = resolve; }));
  localStorage.setItem("customerAccessToken", "token-b");
  store.dispatch(loginSuccess({ customer: { customer_id: "customer-b" }, accessToken: "token-b" }));
  await waitFor(() => expect(getMyOffers).toHaveBeenCalledTimes(2));
  expect(screen.queryByText(/Private item/)).not.toBeInTheDocument();
  resolveNew({ data: { response: [] } });
  await waitFor(() => expect(screen.getByText("You haven't made any offers yet.")).toBeInTheDocument());
});
