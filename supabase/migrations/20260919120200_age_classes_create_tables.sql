-- Age classes reference data for Supabase/Postgres.
-- Mirrors local SQLite V005 (schema only; seed in following migration).

CREATE TABLE age_classes (
  id uuid PRIMARY KEY,
  djb_row integer NOT NULL CHECK (djb_row BETWEEN 1 AND 18),
  gender text NOT NULL CHECK (gender IN ('f', 'm')),
  competition_form text NOT NULL CHECK (competition_form IN ('individual', 'team')),
  label_key text NOT NULL,
  min_age integer,
  max_age integer,
  age_display text,
  fight_time_minutes integer NOT NULL CHECK (fight_time_minutes IN (2, 3, 4)),
  birth_years text NOT NULL,
  weight_mode text NOT NULL CHECK (weight_mode IN ('fixed', 'flexible')),
  ruleset_version text NOT NULL,
  sort_order integer NOT NULL,
  UNIQUE (djb_row, ruleset_version)
);

CREATE INDEX idx_age_classes_sort_order ON age_classes (sort_order);
CREATE INDEX idx_age_classes_ruleset ON age_classes (ruleset_version);

CREATE OR REPLACE FUNCTION public.age_classes_prevent_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'reference data is read-only';
END;
$$;

CREATE TRIGGER age_classes_prevent_update
BEFORE UPDATE ON age_classes
FOR EACH ROW
EXECUTE FUNCTION public.age_classes_prevent_update();

CREATE OR REPLACE FUNCTION public.age_classes_prevent_delete()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'reference data cannot be deleted';
END;
$$;

CREATE TRIGGER age_classes_prevent_delete
BEFORE DELETE ON age_classes
FOR EACH ROW
EXECUTE FUNCTION public.age_classes_prevent_delete();

ALTER TABLE age_classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY age_classes_select_authenticated
  ON age_classes FOR SELECT TO authenticated
  USING (true);

CREATE POLICY age_classes_select_anon
  ON age_classes FOR SELECT TO anon
  USING (true);

GRANT SELECT ON age_classes TO authenticated, anon;
