-- Association hierarchy (Vereinsanlage) for Supabase/Postgres.
-- Independent reference data only — no users, sessions, competitors, or other tenant data.
-- Mirrors local SQLite V007 + V015 (unique Vereinsregisternummer).

CREATE TABLE countries (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  iso_code text NOT NULL UNIQUE
);

CREATE TABLE federations (
  id uuid PRIMARY KEY,
  country_id uuid NOT NULL REFERENCES countries (id) ON DELETE RESTRICT,
  name text NOT NULL,
  short_name text,
  website text
);

CREATE TABLE regional_federations (
  id uuid PRIMARY KEY,
  federation_id uuid NOT NULL REFERENCES federations (id) ON DELETE RESTRICT,
  name text NOT NULL,
  short_name text,
  website text
);

CREATE TABLE districts (
  id uuid PRIMARY KEY,
  regional_federation_id uuid NOT NULL
    REFERENCES regional_federations (id) ON DELETE RESTRICT,
  name text NOT NULL,
  short_name text,
  sort_order integer NOT NULL
);

CREATE TABLE associations (
  id uuid PRIMARY KEY,
  district_id uuid NOT NULL REFERENCES districts (id) ON DELETE RESTRICT,
  name text NOT NULL,
  short_name text,
  city text,
  website text,
  is_active boolean NOT NULL DEFAULT true,
  source text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

CREATE TABLE association_identifiers (
  id uuid PRIMARY KEY,
  association_id uuid NOT NULL REFERENCES associations (id) ON DELETE CASCADE,
  type text NOT NULL,
  value text NOT NULL,
  authority text
);

CREATE TABLE association_addresses (
  id uuid PRIMARY KEY,
  association_id uuid NOT NULL REFERENCES associations (id) ON DELETE CASCADE,
  street text,
  house_number text,
  postal_code text,
  city text,
  country_code text,
  address_type text NOT NULL
);

CREATE TABLE association_contacts (
  id uuid PRIMARY KEY,
  association_id uuid NOT NULL REFERENCES associations (id) ON DELETE CASCADE,
  contact_type text NOT NULL,
  value text NOT NULL,
  label text,
  is_public boolean NOT NULL DEFAULT false
);

CREATE INDEX idx_federations_country_id ON federations (country_id);
CREATE INDEX idx_regional_federations_federation_id ON regional_federations (federation_id);
CREATE INDEX idx_districts_regional_federation_id ON districts (regional_federation_id);
CREATE INDEX idx_associations_district_id ON associations (district_id);
CREATE INDEX idx_associations_name ON associations (name);
CREATE INDEX idx_association_identifiers_association_id ON association_identifiers (association_id);
CREATE INDEX idx_association_addresses_association_id ON association_addresses (association_id);
CREATE INDEX idx_association_contacts_association_id ON association_contacts (association_id);

-- Unique Amtsgerichts-Vereinsregisternummer (local V015).
CREATE UNIQUE INDEX idx_association_identifiers_vereinsregister_number
  ON association_identifiers (value)
  WHERE type = 'vereinsregister_number';

-- Placeholder / system seeds (stable UUIDs shared with local SQLite).
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
    true,
    'seed'
  );

CREATE OR REPLACE FUNCTION public.set_associations_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.updated_at IS NOT DISTINCT FROM OLD.updated_at THEN
    NEW.updated_at := now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER associations_set_updated_at
BEFORE UPDATE ON associations
FOR EACH ROW
EXECUTE FUNCTION public.set_associations_updated_at();

CREATE OR REPLACE FUNCTION public.associations_prevent_delete_seed()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.source = 'seed' THEN
    RAISE EXCEPTION 'seed association cannot be deleted';
  END IF;
  RETURN OLD;
END;
$$;

CREATE TRIGGER associations_prevent_delete_seed
BEFORE DELETE ON associations
FOR EACH ROW
EXECUTE FUNCTION public.associations_prevent_delete_seed();

CREATE OR REPLACE FUNCTION public.associations_prevent_seed_identity_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.source = 'seed'
    AND (
      NEW.id IS DISTINCT FROM OLD.id
      OR NEW.district_id IS DISTINCT FROM OLD.district_id
      OR NEW.source IS DISTINCT FROM OLD.source
    )
  THEN
    RAISE EXCEPTION 'seed association identity is immutable';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER associations_prevent_seed_identity_change
BEFORE UPDATE ON associations
FOR EACH ROW
EXECUTE FUNCTION public.associations_prevent_seed_identity_change();

-- RLS: reference directory is readable for signed-in clients; writes via service_role only.
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE federations ENABLE ROW LEVEL SECURITY;
ALTER TABLE regional_federations ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE association_identifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE association_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE association_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY countries_select_authenticated
  ON countries FOR SELECT TO authenticated
  USING (true);

CREATE POLICY federations_select_authenticated
  ON federations FOR SELECT TO authenticated
  USING (true);

CREATE POLICY regional_federations_select_authenticated
  ON regional_federations FOR SELECT TO authenticated
  USING (true);

CREATE POLICY districts_select_authenticated
  ON districts FOR SELECT TO authenticated
  USING (true);

CREATE POLICY associations_select_authenticated
  ON associations FOR SELECT TO authenticated
  USING (true);

CREATE POLICY association_identifiers_select_authenticated
  ON association_identifiers FOR SELECT TO authenticated
  USING (true);

CREATE POLICY association_addresses_select_authenticated
  ON association_addresses FOR SELECT TO authenticated
  USING (true);

CREATE POLICY association_contacts_select_authenticated
  ON association_contacts FOR SELECT TO authenticated
  USING (true);

GRANT SELECT ON countries, federations, regional_federations, districts, associations,
  association_identifiers, association_addresses, association_contacts
  TO authenticated;
