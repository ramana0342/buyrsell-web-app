-- Offer and product ids use UUIDs; customer and seller ids are text identifiers.
CREATE TABLE IF NOT EXISTS buy_sell_mart.product_offers (
  offer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id TEXT NOT NULL,
  seller_id TEXT NOT NULL,
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  listed_unit_price NUMERIC(12,2) NOT NULL CHECK (listed_unit_price > 0),
  listed_total NUMERIC(14,2) NOT NULL CHECK (listed_total > 0),
  original_offer_total NUMERIC(14,2) NOT NULL CHECK (original_offer_total > 0 AND original_offer_total <= listed_total),
  current_offer_total NUMERIC(14,2) NOT NULL CHECK (current_offer_total > 0),
  final_agreed_total NUMERIC(14,2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','countered','accepted','rejected','cancelled','expired','pending_contact')),
  accepted_by TEXT CHECK (accepted_by IN ('customer','seller')),
  customer_contact_consent BOOLEAN NOT NULL DEFAULT FALSE,
  seller_contact_consent BOOLEAN NOT NULL DEFAULT FALSE,
  customer_confirmed_at TIMESTAMPTZ,
  seller_confirmed_at TIMESTAMPTZ,
  agreed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '14 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS product_offers_customer_idx ON buy_sell_mart.product_offers(customer_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS product_offers_seller_idx ON buy_sell_mart.product_offers(seller_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS buy_sell_mart.product_offer_history (
  entry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID NOT NULL REFERENCES buy_sell_mart.product_offers(offer_id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('customer','seller')),
  sender_id TEXT NOT NULL,
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  message TEXT,
  action TEXT NOT NULL CHECK (action IN ('offer','counteroffer','accept','reject','cancel','contact_confirmed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS product_offer_history_offer_idx ON buy_sell_mart.product_offer_history(offer_id, created_at);
