-- Ads whose URL is missing ?c=<slug>: map Meta ad id (utm_content) / campaign id (utm_id) → pixel slug.
-- Managed from the admin panel (bakchod_ad → Ad Mapping). Ad mapping wins over campaign mapping.
CREATE TABLE IF NOT EXISTS ad_slug_mappings (
  id            SERIAL PRIMARY KEY,
  match_type    VARCHAR(10)  NOT NULL CHECK (match_type IN ('ad', 'campaign')),
  meta_id       VARCHAR(40)  NOT NULL,
  slug          VARCHAR(50)  NOT NULL REFERENCES pixels(slug) ON UPDATE CASCADE ON DELETE CASCADE,
  campaign_name VARCHAR(200),
  note          TEXT,
  is_active     BOOLEAN      NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (match_type, meta_id)
);

-- fbc = "fb.1.<ms>.<fbclid>" — Meta's fbclid regularly pushes it past 200 chars,
-- which made the payments INSERT fail with "value too long". varchar → text is metadata-only (no rewrite).
ALTER TABLE payments           ALTER COLUMN fbc TYPE TEXT, ALTER COLUMN fbp TYPE TEXT;
ALTER TABLE phone_attributions ALTER COLUMN fbc TYPE TEXT, ALTER COLUMN fbp TYPE TEXT;
