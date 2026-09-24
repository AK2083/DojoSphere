import fs from 'node:fs'
import path from 'node:path'

const outDir = 'supabase/migrations'
fs.mkdirSync(outDir, { recursive: true })

function write(name, content) {
  const filePath = path.join(outDir, name)
  fs.writeFileSync(filePath, `${content.trimEnd()}\n`, 'utf8')
  console.log('wrote', name, fs.statSync(filePath).size)
}

function preventMutationTriggers(table) {
  return `
CREATE OR REPLACE FUNCTION public.${table}_prevent_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'reference data is read-only';
END;
$$;

CREATE TRIGGER ${table}_prevent_update
BEFORE UPDATE ON ${table}
FOR EACH ROW
EXECUTE FUNCTION public.${table}_prevent_update();

CREATE OR REPLACE FUNCTION public.${table}_prevent_delete()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'reference data cannot be deleted';
END;
$$;

CREATE TRIGGER ${table}_prevent_delete
BEFORE DELETE ON ${table}
FOR EACH ROW
EXECUTE FUNCTION public.${table}_prevent_delete();
`.trim()
}

function rlsSelect(tables) {
  return tables
    .map(
      (table) => `
ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;

CREATE POLICY ${table}_select_authenticated
  ON ${table} FOR SELECT TO authenticated
  USING (true);

CREATE POLICY ${table}_select_anon
  ON ${table} FOR SELECT TO anon
  USING (true);

GRANT SELECT ON ${table} TO authenticated, anon;`
    )
    .join('\n')
}

write(
  '20260919120000_grades_create_tables.sql',
  `-- Grades reference data for Supabase/Postgres.
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

${preventMutationTriggers('grading_systems')}

${preventMutationTriggers('grades')}
${rlsSelect(['grading_systems', 'grades'])}
`
)

{
  const sql = fs.readFileSync(
    'src/main/shared/database/migrations/V004__grades_create_table.sql',
    'utf8'
  )
  const systemsStart = sql.indexOf('INSERT INTO grading_systems')
  const gradesStart = sql.indexOf('INSERT INTO grades')
  const triggerStart = sql.indexOf('CREATE TRIGGER IF NOT EXISTS grading_systems_prevent_update')
  const systemsInsert = sql.slice(systemsStart, gradesStart).trim()
  const gradesInsert = sql.slice(gradesStart, triggerStart).trim()
  const systemsPg = systemsInsert.replace(/, 1\)/g, ', true)').replace(/, 0\)/g, ', false)')

  write(
    '20260919120100_grades_seed.sql',
    `-- Port of V004 grades seed for Supabase/Postgres.

${systemsPg}

${gradesInsert}
`
  )
}

write(
  '20260919120200_age_classes_create_tables.sql',
  `-- Age classes reference data for Supabase/Postgres.
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

${preventMutationTriggers('age_classes')}
${rlsSelect(['age_classes'])}
`
)

{
  const sql = fs.readFileSync(
    'src/main/shared/database/migrations/V005__age_classes_create_table.sql',
    'utf8'
  )
  const insertStart = sql.indexOf('INSERT INTO age_classes')
  const triggerStart = sql.indexOf('CREATE TRIGGER IF NOT EXISTS age_classes_prevent_update')
  const insert = sql.slice(insertStart, triggerStart).trim()
  write(
    '20260919120300_age_classes_seed.sql',
    `-- Port of V005 age_classes seed for Supabase/Postgres.

${insert}
`
  )
}

write(
  '20260919120400_weight_classes_create_tables.sql',
  `-- Weight classes reference data for Supabase/Postgres.
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

${preventMutationTriggers('weight_classes')}
${rlsSelect(['weight_classes'])}
`
)

{
  const sql = fs.readFileSync(
    'src/main/shared/database/migrations/V006__weight_classes_create_table.sql',
    'utf8'
  )
  const insertStart = sql.indexOf('INSERT INTO weight_classes')
  const triggerStart = sql.indexOf('CREATE TRIGGER IF NOT EXISTS weight_classes_prevent_update')
  const insert = sql.slice(insertStart, triggerStart).trim()
  write(
    '20260919120500_weight_classes_seed.sql',
    `-- Port of V006 weight_classes seed for Supabase/Postgres.

${insert}
`
  )
}

console.log('done')
