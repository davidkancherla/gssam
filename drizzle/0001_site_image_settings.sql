CREATE TABLE IF NOT EXISTS site_image_settings (
  slot TEXT PRIMARY KEY NOT NULL,
  label TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_site_image_settings_updated
ON site_image_settings(updated_at);
