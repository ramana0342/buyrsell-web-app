
CREATE TABLE IF NOT EXISTS buy_sell_mart.sellers (
    seller_id VARCHAR NOT NULL PRIMARY KEY,
    business_name VARCHAR NOT NULL,
    owner_name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    phone VARCHAR NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    seller_status VARCHAR DEFAULT 'pending',
    profile_image TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
