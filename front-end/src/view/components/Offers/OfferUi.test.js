import React, { useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CounterofferForm, OfferHistory } from "./OfferUi";

function FormHarness({ onSubmit }) {
  const [open, setOpen] = useState(false);
  return <><button type="button" onClick={() => setOpen(true)}>Make a Counteroffer</button>{open && <CounterofferForm max={5000} busy={false} onSubmit={onSubmit} onCancel={() => setOpen(false)} />}</>;
}

describe("offer negotiation UI", () => {
  test("negotiation history expands and collapses with its disclosure", () => {
    render(<OfferHistory entries={[{ sender_role: "seller", action: "counteroffer", amount: "3200", created_at: "2026-10-13T00:00:00Z" }]} />);
    const summary = screen.getByText(/Negotiation history/);
    const details = summary.closest("details");
    expect(details.open).toBe(false);
    fireEvent.click(summary);
    expect(details.open).toBe(true);
    expect(screen.getByText("Seller")).toBeInTheDocument();
    expect(screen.getByText("₹3,200")).toBeInTheDocument();
    fireEvent.click(summary);
    expect(details.open).toBe(false);
  });

  test("cancel closes the counteroffer form without submitting", async () => {
    const onSubmit = jest.fn();
    render(<FormHarness onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: "Make a Counteroffer" }));
    expect(screen.getByRole("heading", { name: "Make a Counteroffer" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(screen.queryByRole("heading", { name: "Make a Counteroffer" })).not.toBeInTheDocument());
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test.each(["", "0", "-1", "5200", "12.345"])("rejects invalid counteroffer amount %s", async amount => {
    const onSubmit = jest.fn();
    render(<FormHarness onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: "Make a Counteroffer" }));
    fireEvent.change(screen.getByLabelText(/Counteroffer total price/), { target: { value: amount } });
    fireEvent.click(screen.getByRole("button", { name: "Send Counteroffer" }));
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("sends the entered amount and optional message from its submit button", async () => {
    const onSubmit = jest.fn().mockResolvedValue(true);
    render(<FormHarness onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: "Make a Counteroffer" }));
    fireEvent.change(screen.getByLabelText(/Counteroffer total price/), { target: { value: "3200" } });
    fireEvent.change(screen.getByLabelText(/Message/), { target: { value: "Can you meet me here?" } });
    fireEvent.click(screen.getByRole("button", { name: "Send Counteroffer" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(3200, "Can you meet me here?"));
    await waitFor(() => expect(screen.queryByRole("heading", { name: "Make a Counteroffer" })).not.toBeInTheDocument());
  });

  test("keeps send disabled while a request is pending", () => {
    render(<CounterofferForm max={5000} busy onSubmit={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByRole("button", { name: "Sending…" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
  });
});
