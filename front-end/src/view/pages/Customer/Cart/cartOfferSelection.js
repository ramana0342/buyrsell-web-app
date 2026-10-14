export const getEligibleCombinedOfferGroups = (cartItems = []) => {
    const sellers = new Map();

    cartItems.forEach(item => {
        const productId = String(item.product_id ?? "").trim();
        const sellerId = String(item.seller_id ?? "").trim();
        const quantity = Number(item.quantity);

        if (!productId || !sellerId || item.product_status !== "active" ||
            !Number.isFinite(Number(item.stock_quantity)) || Number(item.stock_quantity) <= 0 ||
            !Number.isFinite(quantity) || quantity < 1) return;

        if (!sellers.has(sellerId)) sellers.set(sellerId, new Map());
        const products = sellers.get(sellerId);
        if (!products.has(productId)) products.set(productId, item);
    });

    return [...sellers.entries()]
        .map(([sellerId, products]) => ({
            sellerId,
            sellerName: [...products.values()].find(item => item.seller_name)?.seller_name || "seller",
            items: [...products.values()]
        }))
        .filter(group => group.items.length >= 2);
};

export const pruneOfferSelection = (selectedIds, cartItems) => {
    const validIds = new Set(getEligibleCombinedOfferGroups(cartItems).flatMap(group => group.items.map(item => String(item.product_id))));
    return [...new Set(selectedIds.map(String).filter(id => validIds.has(id)))];
};
