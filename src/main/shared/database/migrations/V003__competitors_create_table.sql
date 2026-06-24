CREATE TABLE IF NOT EXISTS competitors (
  id TEXT PRIMARY KEY,

  given_name TEXT NOT NULL,
  family_name TEXT NOT NULL,
  club TEXT,
  weight_class TEXT,

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT
);
