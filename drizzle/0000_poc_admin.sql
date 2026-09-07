CREATE TABLE IF NOT EXISTS member_profiles (
  id TEXT PRIMARY KEY NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  household TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  birthday TEXT,
  anniversary TEXT,
  notes TEXT NOT NULL DEFAULT '',
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_member_profiles_active_name
ON member_profiles(is_active, last_name, first_name);

CREATE TABLE IF NOT EXISTS content_review_notes (
  id TEXT PRIMARY KEY NOT NULL,
  page_path TEXT NOT NULL,
  title TEXT NOT NULL,
  note TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_content_review_notes_page_created
ON content_review_notes(page_path, created_at);
