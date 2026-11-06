CREATE TABLE IF NOT EXISTS buy_sell_mart.categories (
    category_id VARCHAR NOT NULL PRIMARY KEY,
    category_name VARCHAR NOT NULL UNIQUE,
    category_image TEXT,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);