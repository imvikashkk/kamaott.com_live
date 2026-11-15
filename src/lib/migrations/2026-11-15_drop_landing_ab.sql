-- Landing page A/B test removed (only one landing design now). Undoes 2026-10-16_landing_ab.sql. Safe to re-run.
DROP INDEX IF EXISTS idx_users_lp_run;
ALTER TABLE users
  DROP COLUMN IF EXISTS lp_run,
  DROP COLUMN IF EXISTS lp_variant,
  DROP COLUMN IF EXISTS lp_at;
DROP TABLE IF EXISTS landing_visits;
DROP TABLE IF EXISTS app_settings;
