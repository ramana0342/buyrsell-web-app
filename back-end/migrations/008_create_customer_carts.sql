
CREATE TABLE IF NOT EXISTS buy_sell_mart.customer_carts (
    cart_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id VARCHAR NOT NULL,
    product_id VARCHAR NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_cart_quantity CHECK (quantity > 0),

    CONSTRAINT fk_cart_customer
        FOREIGN KEY (customer_id)
        REFERENCES buy_sell_mart.customers(customer_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_cart_product
        FOREIGN KEY (product_id)
        REFERENCES buy_sell_mart.products(product_id)
        ON DELETE CASCADE,

    CONSTRAINT uq_cart_customer_product
        UNIQUE (customer_id, product_id)
);
