CREATE TABLE IF NOT EXISTS countries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  iso_code TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS federations (
  id TEXT PRIMARY KEY,
  country_id TEXT NOT NULL REFERENCES countries(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  short_name TEXT,
  website TEXT
);

CREATE TABLE IF NOT EXISTS regional_federations (
  id TEXT PRIMARY KEY,
  federation_id TEXT NOT NULL REFERENCES federations(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  short_name TEXT,
  website TEXT
);

CREATE TABLE IF NOT EXISTS districts (
  id TEXT PRIMARY KEY,
  regional_federation_id TEXT NOT NULL
    REFERENCES regional_federations(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  short_name TEXT,
  sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS associations (
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

CREATE TABLE IF NOT EXISTS association_identifiers (
  id TEXT PRIMARY KEY,
  association_id TEXT NOT NULL REFERENCES associations(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  value TEXT NOT NULL,
  authority TEXT
);

CREATE TABLE IF NOT EXISTS association_addresses (
  id TEXT PRIMARY KEY,
  association_id TEXT NOT NULL REFERENCES associations(id) ON DELETE CASCADE,
  street TEXT,
  house_number TEXT,
  postal_code TEXT,
  city TEXT,
  country_code TEXT,
  address_type TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS association_contacts (
  id TEXT PRIMARY KEY,
  association_id TEXT NOT NULL REFERENCES associations(id) ON DELETE CASCADE,
  contact_type TEXT NOT NULL,
  value TEXT NOT NULL,
  label TEXT,
  is_public INTEGER NOT NULL DEFAULT 0 CHECK (is_public IN (0, 1))
);

CREATE INDEX idx_federations_country_id ON federations(country_id);
CREATE INDEX idx_regional_federations_federation_id ON regional_federations(federation_id);
CREATE INDEX idx_districts_regional_federation_id ON districts(regional_federation_id);
CREATE INDEX idx_associations_district_id ON associations(district_id);
CREATE INDEX idx_associations_name ON associations(name);
CREATE INDEX idx_association_identifiers_association_id ON association_identifiers(association_id);
CREATE INDEX idx_association_addresses_association_id ON association_addresses(association_id);
CREATE INDEX idx_association_contacts_association_id ON association_contacts(association_id);

INSERT INTO countries (id, name, iso_code) VALUES
  ('d1000000-0000-4000-8000-000000000001', 'Germany', 'DE');

INSERT INTO federations (id, country_id, name, short_name, website) VALUES
  (
    'd1000000-0000-4000-8000-000000000002',
    'd1000000-0000-4000-8000-000000000001',
    'German Judo Federation',
    'DJB',
    'https://www.judobund.de'
  );

INSERT INTO regional_federations (id, federation_id, name, short_name) VALUES
  (
    'd1000000-0000-4000-8000-000000000003',
    'd1000000-0000-4000-8000-000000000002',
    'Placeholder Regional Federation',
    NULL
  );

INSERT INTO districts (id, regional_federation_id, name, short_name, sort_order) VALUES
  (
    'd1000000-0000-4000-8000-000000000004',
    'd1000000-0000-4000-8000-000000000003',
    'Placeholder District',
    NULL,
    1
  );

INSERT INTO associations (id, district_id, name, is_active, source) VALUES
  (
    '00000000-0000-0000-0000-000000000000',
    'd1000000-0000-4000-8000-000000000004',
    'Unknown',
    1,
    'seed'
  );

CREATE TRIGGER IF NOT EXISTS associations_set_updated_at
AFTER UPDATE ON associations
FOR EACH ROW
WHEN NEW.updated_at IS OLD.updated_at
BEGIN
  UPDATE associations SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS associations_prevent_delete_seed
BEFORE DELETE ON associations
WHEN OLD.source = 'seed'
BEGIN
  SELECT RAISE(ABORT, 'seed association cannot be deleted');
END;

CREATE TRIGGER IF NOT EXISTS associations_prevent_seed_identity_change
BEFORE UPDATE ON associations
WHEN OLD.source = 'seed'
  AND (
    NEW.id != OLD.id
    OR NEW.district_id != OLD.district_id
    OR NEW.source != OLD.source
  )
BEGIN
  SELECT RAISE(ABORT, 'seed association identity is immutable');
END;
