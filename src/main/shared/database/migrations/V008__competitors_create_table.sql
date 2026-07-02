-- Text length limits mirror src/renderer/shared/domain/competitor-field-limits.ts
CREATE TABLE IF NOT EXISTS competitors (
  id TEXT PRIMARY KEY,
  given_name TEXT NOT NULL
    CHECK (length(trim(given_name)) BETWEEN 1 AND 80),
  family_name TEXT NOT NULL
    CHECK (length(trim(family_name)) BETWEEN 1 AND 80),
  gender TEXT NOT NULL CHECK (gender IN ('f', 'm', 'd')),
  birth_date TEXT NOT NULL
    CHECK (
      length(birth_date) = 10
      AND birth_date GLOB '????-??-??'
    ),
  club_id TEXT NOT NULL
    REFERENCES clubs(id) ON DELETE RESTRICT,
  nationality TEXT NOT NULL
    CHECK (
      length(nationality) = 2
      AND nationality GLOB '[A-Za-z][A-Za-z]'
    ),
  weight_class_id TEXT NOT NULL
    REFERENCES weight_classes(id) ON DELETE RESTRICT,
  age_class_id TEXT NOT NULL
    REFERENCES age_classes(id) ON DELETE RESTRICT,
  pass_number TEXT NOT NULL
    CHECK (
      length(trim(pass_number)) BETWEEN 1 AND 32
      AND pass_number NOT GLOB '*[^0-9A-Za-z-/]*'
    ),
  grade_id TEXT
    REFERENCES grades(id) ON DELETE SET NULL,
  license_number TEXT
    CHECK (
      license_number IS NULL
      OR (
        length(trim(license_number)) BETWEEN 1 AND 32
        AND license_number NOT GLOB '*[^0-9A-Za-z-/]*'
      )
    ),
  contact_phone TEXT
    CHECK (contact_phone IS NULL OR length(contact_phone) <= 32),
  coach TEXT
    CHECK (coach IS NULL OR length(trim(coach)) BETWEEN 1 AND 80),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT
);

CREATE INDEX idx_competitors_family_name ON competitors(family_name);
CREATE INDEX idx_competitors_club_id ON competitors(club_id);
CREATE INDEX idx_competitors_weight_class_id ON competitors(weight_class_id);
CREATE INDEX idx_competitors_age_class_id ON competitors(age_class_id);
CREATE INDEX idx_competitors_grade_id ON competitors(grade_id);
