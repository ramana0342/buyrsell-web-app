
CREATE TABLE IF NOT EXISTS buy_sell_mart.customer_wishlists (
    wishlist_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id VARCHAR NOT NULL,
    product_id VARCHAR NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_wishlist_customer
        FOREIGN KEY (customer_id)
        REFERENCES buy_sell_mart.customers(customer_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_wishlist_product
        FOREIGN KEY (product_id)
        REFERENCES buy_sell_mart.products(product_id)
        ON DELETE CASCADE,

    CONSTRAINT unique_customer_product_wishlist
        UNIQUE (customer_id, product_id)
);
