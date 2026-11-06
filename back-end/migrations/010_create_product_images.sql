CREATE TABLE IF NOT EXISTS buy_sell_mart.product_images (
    image_id VARCHAR NOT NULL PRIMARY KEY,
    product_id VARCHAR NOT NULL,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    public_id TEXT
);