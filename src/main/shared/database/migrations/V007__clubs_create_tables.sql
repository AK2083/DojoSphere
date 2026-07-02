CREATE TABLE IF NOT EXISTS countries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  iso_code TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS associations (
  id TEXT PRIMARY KEY,
  country_id TEXT NOT NULL REFERENCES countries(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  short_name TEXT,
  website TEXT
);

CREATE TABLE IF NOT EXISTS regional_associations (
  id TEXT PRIMARY KEY,
  association_id TEXT NOT NULL REFERENCES associations(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  short_name TEXT,
  website TEXT
);

CREATE TABLE IF NOT EXISTS districts (
  id TEXT PRIMARY KEY,
  regional_association_id TEXT NOT NULL
    REFERENCES regional_associations(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  short_name TEXT,
  sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS clubs (
  id TEXT PRIMARY KEY,
  district_id TEXT NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  short_name TEXT,
  city TEXT,
  website TEXT,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  source TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS club_identifiers (
  id TEXT PRIMARY KEY,
  club_id TEXT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  value TEXT NOT NULL,
  authority TEXT
);

CREATE TABLE IF NOT EXISTS club_addresses (
  id TEXT PRIMARY KEY,
  club_id TEXT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  street TEXT,
  house_number TEXT,
  postal_code TEXT,
  city TEXT,
  country_code TEXT,
  address_type TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS club_contacts (
  id TEXT PRIMARY KEY,
  club_id TEXT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  contact_type TEXT NOT NULL,
  value TEXT NOT NULL,
  label TEXT,
  is_public INTEGER NOT NULL DEFAULT 0 CHECK (is_public IN (0, 1))
);

CREATE INDEX idx_associations_country_id ON associations(country_id);
CREATE INDEX idx_regional_associations_association_id ON regional_associations(association_id);
CREATE INDEX idx_districts_regional_association_id ON districts(regional_association_id);
CREATE INDEX idx_clubs_district_id ON clubs(district_id);
CREATE INDEX idx_clubs_name ON clubs(name);
CREATE INDEX idx_club_identifiers_club_id ON club_identifiers(club_id);
CREATE INDEX idx_club_addresses_club_id ON club_addresses(club_id);
CREATE INDEX idx_club_contacts_club_id ON club_contacts(club_id);

INSERT INTO countries (id, name, iso_code) VALUES
  ('d1000000-0000-4000-8000-000000000001', 'Germany', 'DE');

INSERT INTO associations (id, country_id, name, short_name, website) VALUES
  (
    'd1000000-0000-4000-8000-000000000002',
    'd1000000-0000-4000-8000-000000000001',
    'German Judo Federation',
    'DJB',
    'https://www.judobund.de'
  );

INSERT INTO regional_associations (id, association_id, name, short_name) VALUES
  (
    'd1000000-0000-4000-8000-000000000003',
    'd1000000-0000-4000-8000-000000000002',
    'Placeholder Regional Association',
    NULL
  );

INSERT INTO districts (id, regional_association_id, name, short_name, sort_order) VALUES
  (
    'd1000000-0000-4000-8000-000000000004',
    'd1000000-0000-4000-8000-000000000003',
    'Placeholder District',
    NULL,
    1
  );

INSERT INTO clubs (id, district_id, name, is_active, source) VALUES
  (
    '00000000-0000-0000-0000-000000000000',
    'd1000000-0000-4000-8000-000000000004',
    'Unknown',
    1,
    'seed'
  );
