import { getEligibleCombinedOfferGroups, pruneOfferSelection } from "./cartOfferSelection";

const item = (product_id, seller_id, extra = {}) => ({
    product_id,
    seller_id,
    seller_name: `Store ${seller_id}`,
    product_status: "active",
    stock_quantity: 10,
    quantity: 1,
    ...extra
});

describe("combined cart offer eligibility", () => {
    test("one product and multiple quantities remain a single product", () => {
        expect(getEligibleCombinedOfferGroups([item("p1", "s1")])).toEqual([]);
        expect(getEligibleCombinedOfferGroups([item("p1", "s1", { quantity: 3 })])).toEqual([]);
    });

    test("two distinct products from one seller use the seller's actual name", () => {
        expect(getEligibleCombinedOfferGroups([item("p1", "s1"), item("p2", "s1")])).toEqual([
            { sellerId: "s1", sellerName: "Store s1", items: [item("p1", "s1"), item("p2", "s1")] }
        ]);
    });

    test("does not combine products across sellers and only renders qualifying seller groups", () => {
        expect(getEligibleCombinedOfferGroups([item("p1", "s1"), item("p2", "s2")])).toEqual([]);
        const groups = getEligibleCombinedOfferGroups([item("p1", "s1"), item("p2", "s1"), item("p3", "s2")]);
        expect(groups.map(group => [group.sellerId, group.items.length])).toEqual([["s1", 2]]);
    });

    test("filters ineligible products and duplicate product rows do not increase the distinct count", () => {
        const rows = [item("p1", "s1"), item("p1", "s1", { quantity: 4 }), item("p2", "s1", { stock_quantity: 0 }), item("p3", "s1", { product_status: "inactive" }), item("", "s1")];
        expect(getEligibleCombinedOfferGroups(rows)).toEqual([]);
        const duplicates = getEligibleCombinedOfferGroups([item("p1", "s1"), item("p1", "s1", { quantity: 4 }), item("p2", "s1")]);
        expect(duplicates[0].items.map(product => product.product_id)).toEqual(["p1", "p2"]);
    });

    test("selection is pruned when a seller falls below two eligible products and quantities do not duplicate IDs", () => {
        const two = [item("p1", "s1"), item("p2", "s1")];
        expect(pruneOfferSelection(["p1", "p1", "p2"], two)).toEqual(["p1", "p2"]);
        expect(pruneOfferSelection(["p1", "p2"], [item("p1", "s1", { quantity: 3 })])).toEqual([]);
    });

    test("seller name has a neutral fallback", () => {
        const row = item("p1", "s1", { seller_name: "" });
        expect(getEligibleCombinedOfferGroups([row, item("p2", "s1", { seller_name: "" })])[0].sellerName).toBe("seller");
    });
});
