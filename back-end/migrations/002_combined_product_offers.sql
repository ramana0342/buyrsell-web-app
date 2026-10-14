-- Add product lines to an offer while keeping legacy single-product columns and data.
ALTER TABLE buy_sell_mart.product_offers
  ALTER COLUMN product_id DROP NOT NULL,
  ALTER COLUMN listed_unit_price DROP NOT NULL;

CREATE TABLE IF NOT EXISTS buy_sell_mart.product_offer_items (
  offer_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID NOT NULL REFERENCES buy_sell_mart.product_offers(offer_id) ON DELETE CASCADE,
  product_id VARCHAR(50) NOT NULL,
  product_name_snapshot VARCHAR(255) NOT NULL,
  product_image_snapshot TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  listed_unit_price NUMERIC(12,2) NOT NULL CHECK (listed_unit_price > 0),
  listed_total NUMERIC(14,2) NOT NULL CHECK (listed_total > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS product_offer_items_offer_idx
  ON buy_sell_mart.product_offer_items(offer_id);

-- Backfill existing negotiations, preserving their original price and quantity snapshots.
INSERT INTO buy_sell_mart.product_offer_items
  (offer_id, product_id, product_name_snapshot, product_image_snapshot, quantity, listed_unit_price, listed_total)
SELECT o.offer_id, o.product_id::text, COALESCE(p.product_name, 'Unavailable product'), p.product_url,
       o.quantity, o.listed_unit_price, o.listed_total
FROM buy_sell_mart.product_offers o
LEFT JOIN buy_sell_mart.products p ON p.product_id = o.product_id::text
WHERE o.product_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM buy_sell_mart.product_offer_items i WHERE i.offer_id = o.offer_id
  );
