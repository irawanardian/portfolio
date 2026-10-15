BEGIN;

CREATE TABLE IF NOT EXISTS photo_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS
  photo_categories_name_lower_idx
ON photo_categories (LOWER(name));

INSERT INTO photo_categories (name, slug, sort_order)
VALUES
  ('Wedding', 'wedding', 1),
  ('Prewedding', 'prewedding', 2),
  ('Engagement', 'engagement', 3),
  ('Portrait', 'portrait', 4),
  ('Event', 'event', 5),
  ('Product', 'product', 6),
  ('Landscape', 'landscape', 7),
  ('Street', 'street', 8),
  ('Corporate', 'corporate', 9)
ON CONFLICT (slug) DO NOTHING;

COMMIT;
