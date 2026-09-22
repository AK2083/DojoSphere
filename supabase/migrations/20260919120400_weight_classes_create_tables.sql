-- Weight classes reference data for Supabase/Postgres.
-- Mirrors local SQLite V006 (schema only; seed in following migration).
-- Requires age_classes seed to be applied first.

CREATE TABLE weight_classes (
  id uuid PRIMARY KEY,
  age_class_id uuid NOT NULL
    REFERENCES age_classes (id) ON DELETE RESTRICT,
  djb_row integer NOT NULL,
  max_weight_kg double precision,
  min_weight_kg double precision,
  label_key text NOT NULL,
  sort_order integer NOT NULL,
  CHECK (max_weight_kg IS NOT NULL OR min_weight_kg IS NOT NULL)
);

CREATE INDEX idx_weight_classes_age_class_id
  ON weight_classes (age_class_id, sort_order);

CREATE INDEX idx_weight_classes_djb_row
  ON weight_classes (djb_row, sort_order);

CREATE OR REPLACE FUNCTION public.weight_classes_prevent_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'reference data is read-only';
END;
$$;

CREATE TRIGGER weight_classes_prevent_update
BEFORE UPDATE ON weight_classes
FOR EACH ROW
EXECUTE FUNCTION public.weight_classes_prevent_update();

CREATE OR REPLACE FUNCTION public.weight_classes_prevent_delete()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'reference data cannot be deleted';
END;
$$;

CREATE TRIGGER weight_classes_prevent_delete
BEFORE DELETE ON weight_classes
FOR EACH ROW
EXECUTE FUNCTION public.weight_classes_prevent_delete();

ALTER TABLE weight_classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY weight_classes_select_authenticated
  ON weight_classes FOR SELECT TO authenticated
  USING (true);

CREATE POLICY weight_classes_select_anon
  ON weight_classes FOR SELECT TO anon
  USING (true);

GRANT SELECT ON weight_classes TO authenticated, anon;
