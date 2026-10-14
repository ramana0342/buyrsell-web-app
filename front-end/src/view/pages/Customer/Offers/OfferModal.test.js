import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import OfferModal from "./OfferModal";
import { createCombinedOffer, createOffer } from "../../../../network/customerApiService/customerOfferService";

jest.mock("../../../../network/customerApiService/customerOfferService", () => ({
  createOffer: jest.fn(() => Promise.resolve({})),
  createCombinedOffer: jest.fn(() => Promise.resolve({}))
}));

const productA = { product_id: "A", product_name: "Product A", selling_price: 2000, quantity: 2, stock_quantity: 5 };
const productB = { product_id: "B", product_name: "Product B", selling_price: 3000, quantity: 1, stock_quantity: 4 };

beforeEach(() => { jest.clearAllMocks(); });

test("submits one multi-unit offer using a total amount and leaves cart quantity in its input props", async () => {
  render(<OfferModal product={productA} initialQuantity={3} onClose={jest.fn()} />);
  expect(screen.getByLabelText(/Product A quantity/)).toHaveValue(3);
  expect(screen.getByText(/6,000/)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText(/total offer price/), { target: { value: "5400" } });
  fireEvent.click(screen.getByRole("button", { name: "Submit offer" }));
  await waitFor(() => expect(createOffer).toHaveBeenCalledWith({ productId: "A", quantity: 3, offeredTotal: 5400, message: "" }));
  expect(createCombinedOffer).not.toHaveBeenCalled();
});

test("submits selected same-seller product lines with one combined total", async () => {
  render(<OfferModal products={[productA, productB]} onClose={jest.fn()} />);
  expect(screen.getByText(/7,000/)).toBeInTheDocument();
  expect(screen.getByText("This amount applies to all products listed above together.")).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText(/total offer for all selected products/), { target: { value: "6300" } });
  fireEvent.click(screen.getByRole("button", { name: "Submit offer" }));
  await waitFor(() => expect(createCombinedOffer).toHaveBeenCalledWith({
    items: [{ productId: "A", quantity: 2 }, { productId: "B", quantity: 1 }], offeredTotal: 6300, message: ""
  }));
});
