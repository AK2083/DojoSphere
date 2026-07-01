CREATE TABLE IF NOT EXISTS competitors (
  id TEXT PRIMARY KEY,
  given_name TEXT NOT NULL,
  family_name TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('f', 'm', 'd')),
  birth_date TEXT NOT NULL,
  club_id TEXT NOT NULL
    REFERENCES clubs(id) ON DELETE RESTRICT,
  nationality TEXT NOT NULL,
  weight_class_id TEXT NOT NULL
    REFERENCES weight_classes(id) ON DELETE RESTRICT,
  age_class_id TEXT NOT NULL
    REFERENCES age_classes(id) ON DELETE RESTRICT,
  pass_number TEXT NOT NULL,
  grade_id TEXT
    REFERENCES grades(id) ON DELETE SET NULL,
  license_number TEXT,
  contact_phone TEXT,
  coach TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT
);

CREATE INDEX idx_competitors_family_name ON competitors(family_name);
CREATE INDEX idx_competitors_club_id ON competitors(club_id);
CREATE INDEX idx_competitors_weight_class_id ON competitors(weight_class_id);
CREATE INDEX idx_competitors_age_class_id ON competitors(age_class_id);
CREATE INDEX idx_competitors_grade_id ON competitors(grade_id);
