
CREATE TABLE IF NOT EXISTS buy_sell_mart.products (
    product_id VARCHAR NOT NULL PRIMARY KEY,
    seller_id VARCHAR NOT NULL,
    category_id VARCHAR NOT NULL,
    product_name VARCHAR NOT NULL,
    slug VARCHAR NOT NULL UNIQUE,
    product_url TEXT NOT NULL UNIQUE,
    short_description VARCHAR,
    description TEXT,
    brand VARCHAR,
    sku VARCHAR UNIQUE,
    selling_price NUMERIC NOT NULL,
    original_price NUMERIC,
    discount_percentage NUMERIC DEFAULT 0,
    gst_percentage NUMERIC DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    minimum_stock_alert INTEGER DEFAULT 5,
    average_rating NUMERIC DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    product_status VARCHAR DEFAULT 'active',
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_category
        FOREIGN KEY (category_id)
        REFERENCES buy_sell_mart.categories(category_id),

    CONSTRAINT fk_product_seller
        FOREIGN KEY (seller_id)
        REFERENCES buy_sell_mart.sellers(seller_id)
        ON DELETE CASCADE
);
