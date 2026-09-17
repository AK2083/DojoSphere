-- Add updated_at tracking to association hierarchy tables that didn't have it yet.
-- The associations table already has updated_at + trigger from 20260915163500.
-- These columns enable incremental cloud → local sync (compare Supabase updated_at
-- against local synced_at to skip unchanged rows).
--
-- Also grants SELECT to the anon role so that the DojoSphere desktop client can
-- download public reference data without requiring an active cloud session.

ALTER TABLE countries ADD COLUMN updated_at timestamptz;
ALTER TABLE federations ADD COLUMN updated_at timestamptz;
ALTER TABLE regional_federations ADD COLUMN updated_at timestamptz;
ALTER TABLE districts ADD COLUMN updated_at timestamptz;

-- countries

CREATE OR REPLACE FUNCTION public.set_countries_updated_at()
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

CREATE TRIGGER countries_set_updated_at
BEFORE UPDATE ON countries
FOR EACH ROW
EXECUTE FUNCTION public.set_countries_updated_at();

-- federations

CREATE OR REPLACE FUNCTION public.set_federations_updated_at()
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

CREATE TRIGGER federations_set_updated_at
BEFORE UPDATE ON federations
FOR EACH ROW
EXECUTE FUNCTION public.set_federations_updated_at();

-- regional_federations

CREATE OR REPLACE FUNCTION public.set_regional_federations_updated_at()
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

CREATE TRIGGER regional_federations_set_updated_at
BEFORE UPDATE ON regional_federations
FOR EACH ROW
EXECUTE FUNCTION public.set_regional_federations_updated_at();

-- districts

CREATE OR REPLACE FUNCTION public.set_districts_updated_at()
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

CREATE TRIGGER districts_set_updated_at
BEFORE UPDATE ON districts
FOR EACH ROW
EXECUTE FUNCTION public.set_districts_updated_at();

-- ---------------------------------------------------------------------------
-- Anon read access
-- Allow unauthenticated (anon) clients to read the association reference
-- directory. These tables contain publicly available data (club names,
-- addresses, federation hierarchy) and must be readable by the DojoSphere
-- desktop client even before the user has a valid cloud session.
-- The existing *_select_authenticated policies stay in place so that both
-- roles can read the data.
-- ---------------------------------------------------------------------------

CREATE POLICY countries_select_anon
  ON countries FOR SELECT TO anon
  USING (true);

CREATE POLICY federations_select_anon
  ON federations FOR SELECT TO anon
  USING (true);

CREATE POLICY regional_federations_select_anon
  ON regional_federations FOR SELECT TO anon
  USING (true);

CREATE POLICY districts_select_anon
  ON districts FOR SELECT TO anon
  USING (true);

CREATE POLICY associations_select_anon
  ON associations FOR SELECT TO anon
  USING (true);

CREATE POLICY association_identifiers_select_anon
  ON association_identifiers FOR SELECT TO anon
  USING (true);

CREATE POLICY association_addresses_select_anon
  ON association_addresses FOR SELECT TO anon
  USING (true);

CREATE POLICY association_contacts_select_anon
  ON association_contacts FOR SELECT TO anon
  USING (true);

-- Grant SELECT to the anon role (mirrors the authenticated grant in the
-- initial migration).
GRANT SELECT ON countries, federations, regional_federations, districts, associations,
  association_identifiers, association_addresses, association_contacts
  TO anon;
