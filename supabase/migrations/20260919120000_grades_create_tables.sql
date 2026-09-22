-- Grades reference data for Supabase/Postgres.
-- Mirrors local SQLite V004 (schema only; seed in following migration).

CREATE TABLE grading_systems (
  id uuid PRIMARY KEY,
  code text NOT NULL UNIQUE,
  name_key text NOT NULL,
  sport_code text NOT NULL,
  country_code text,
  is_active boolean NOT NULL DEFAULT true
);

CREATE TABLE grades (
  id uuid PRIMARY KEY,
  grading_system_id uuid NOT NULL
    REFERENCES grading_systems (id) ON DELETE RESTRICT,
  code text NOT NULL,
  label_key text NOT NULL,
  rank_order integer NOT NULL,
  level_type text NOT NULL CHECK (level_type IN ('kyu', 'dan', 'mon', 'other')),
  level_number integer NOT NULL,
  belt_color_token text,
  UNIQUE (grading_system_id, code),
  UNIQUE (grading_system_id, rank_order)
);

CREATE INDEX idx_grades_grading_system_id ON grades (grading_system_id);
CREATE INDEX idx_grades_rank_order ON grades (grading_system_id, rank_order);

CREATE OR REPLACE FUNCTION public.grading_systems_prevent_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'reference data is read-only';
END;
$$;

CREATE TRIGGER grading_systems_prevent_update
BEFORE UPDATE ON grading_systems
FOR EACH ROW
EXECUTE FUNCTION public.grading_systems_prevent_update();

CREATE OR REPLACE FUNCTION public.grading_systems_prevent_delete()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'reference data cannot be deleted';
END;
$$;

CREATE TRIGGER grading_systems_prevent_delete
BEFORE DELETE ON grading_systems
FOR EACH ROW
EXECUTE FUNCTION public.grading_systems_prevent_delete();

CREATE OR REPLACE FUNCTION public.grades_prevent_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'reference data is read-only';
END;
$$;

CREATE TRIGGER grades_prevent_update
BEFORE UPDATE ON grades
FOR EACH ROW
EXECUTE FUNCTION public.grades_prevent_update();

CREATE OR REPLACE FUNCTION public.grades_prevent_delete()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'reference data cannot be deleted';
END;
$$;

CREATE TRIGGER grades_prevent_delete
BEFORE DELETE ON grades
FOR EACH ROW
EXECUTE FUNCTION public.grades_prevent_delete();

ALTER TABLE grading_systems ENABLE ROW LEVEL SECURITY;

CREATE POLICY grading_systems_select_authenticated
  ON grading_systems FOR SELECT TO authenticated
  USING (true);

CREATE POLICY grading_systems_select_anon
  ON grading_systems FOR SELECT TO anon
  USING (true);

GRANT SELECT ON grading_systems TO authenticated, anon;

ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

CREATE POLICY grades_select_authenticated
  ON grades FOR SELECT TO authenticated
  USING (true);

CREATE POLICY grades_select_anon
  ON grades FOR SELECT TO anon
  USING (true);

GRANT SELECT ON grades TO authenticated, anon;
