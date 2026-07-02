import fs from 'node:fs'

const RANK_ORDER_HEX = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '0a',
  '0b',
  '0c',
  '0d',
  '0e',
  '0f',
  '10',
  '11',
  '12',
  '13',
  '14'
]

const DE_DJB_SYSTEM_ID = 'f1000000-0000-4000-8000-000000000001'
const AT_OJV_SYSTEM_ID = 'f1000000-0000-4000-8000-000000000002'
const KODOKAN_SYSTEM_ID = 'f1000000-0000-4000-8000-000000000003'

const DE_DJB_KYU_BELTS = {
  10: 'judo-belt-white',
  9: 'judo-belt-white',
  8: 'judo-belt-white-yellow',
  7: 'judo-belt-yellow',
  6: 'judo-belt-yellow-orange',
  5: 'judo-belt-orange',
  4: 'judo-belt-orange-green',
  3: 'judo-belt-green',
  2: 'judo-belt-blue',
  1: 'judo-belt-brown'
}

const AT_OJV_KYU_BELTS = {
  10: 'judo-belt-white',
  9: 'judo-belt-white-yellow',
  8: 'judo-belt-yellow',
  7: 'judo-belt-yellow-orange',
  6: 'judo-belt-orange',
  5: 'judo-belt-orange-green',
  4: 'judo-belt-green',
  3: 'judo-belt-green-blue',
  2: 'judo-belt-blue-brown',
  1: 'judo-belt-brown'
}

const KODOKAN_KYU_BELTS = {
  10: 'judo-belt-white',
  9: 'judo-belt-white',
  8: 'judo-belt-white',
  7: 'judo-belt-light-blue',
  6: 'judo-belt-light-blue',
  5: 'judo-belt-yellow',
  4: 'judo-belt-orange',
  3: 'judo-belt-green',
  2: 'judo-belt-purple',
  1: 'judo-belt-brown'
}

function danBeltColor(dan) {
  if (dan <= 5) return 'judo-belt-black'
  if (dan <= 8) return 'judo-belt-red-white'
  return 'judo-belt-red'
}

function gradeId(prefix, rankOrder) {
  return `${prefix}000000-0000-4000-8000-0000000000${RANK_ORDER_HEX[rankOrder - 1]}`
}

function resolveKyuLabelKey(kyu, labelScope) {
  return labelScope === 'kodokan' ? `grades.kodokan.kyu.${kyu}` : `grades.kyu.${kyu}`
}

function resolveDanLabelKey(dan, labelScope) {
  return labelScope === 'kodokan' ? `grades.kodokan.dan.${dan}` : `grades.dan.${dan}`
}

function buildGrades(systemId, prefix, kyuBelts, labelScope = 'default') {
  const rows = []

  for (let kyu = 10; kyu >= 1; kyu -= 1) {
    const rankOrder = 11 - kyu
    const belt = kyuBelts[kyu]
    rows.push(
      `  ('${gradeId(prefix, rankOrder)}', '${systemId}', 'kyu-${kyu}', '${resolveKyuLabelKey(kyu, labelScope)}', ${rankOrder}, 'kyu', ${kyu}, '${belt}')`
    )
  }

  for (let dan = 1; dan <= 10; dan += 1) {
    const rankOrder = 10 + dan
    rows.push(
      `  ('${gradeId(prefix, rankOrder)}', '${systemId}', 'dan-${dan}', '${resolveDanLabelKey(dan, labelScope)}', ${rankOrder}, 'dan', ${dan}, '${danBeltColor(dan)}')`
    )
  }

  return rows
}

const gradeRows = [
  ...buildGrades(DE_DJB_SYSTEM_ID, 'a1', DE_DJB_KYU_BELTS),
  ...buildGrades(AT_OJV_SYSTEM_ID, 'a2', AT_OJV_KYU_BELTS),
  ...buildGrades(KODOKAN_SYSTEM_ID, 'a3', KODOKAN_KYU_BELTS, 'kodokan')
]

const sql = `CREATE TABLE IF NOT EXISTS grading_systems (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name_key TEXT NOT NULL,
  sport_code TEXT NOT NULL,
  country_code TEXT,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1))
);

CREATE TABLE IF NOT EXISTS grades (
  id TEXT PRIMARY KEY,
  grading_system_id TEXT NOT NULL,
  code TEXT NOT NULL,
  label_key TEXT NOT NULL,
  rank_order INTEGER NOT NULL,
  level_type TEXT NOT NULL CHECK (level_type IN ('kyu', 'dan', 'mon', 'other')),
  level_number INTEGER NOT NULL,
  belt_color_token TEXT,
  FOREIGN KEY (grading_system_id) REFERENCES grading_systems(id),
  UNIQUE (grading_system_id, code),
  UNIQUE (grading_system_id, rank_order)
);

CREATE INDEX IF NOT EXISTS idx_grades_grading_system_id ON grades(grading_system_id);
CREATE INDEX IF NOT EXISTS idx_grades_rank_order ON grades(grading_system_id, rank_order);

INSERT INTO grading_systems (id, code, name_key, sport_code, country_code, is_active) VALUES
  ('f1000000-0000-4000-8000-000000000001', 'de_djb', 'gradingSystems.deDjb', 'judo', 'DE', 1),
  ('f1000000-0000-4000-8000-000000000002', 'at_ojv', 'gradingSystems.atOjv', 'judo', 'AT', 1),
  ('f1000000-0000-4000-8000-000000000003', 'kodokan', 'gradingSystems.kodokan', 'judo', 'JP', 1);

INSERT INTO grades (
  id,
  grading_system_id,
  code,
  label_key,
  rank_order,
  level_type,
  level_number,
  belt_color_token
) VALUES
${gradeRows.join(',\n')};
`

const target = 'src/main/shared/database/migrations/V004__grades_create_table.sql'
fs.writeFileSync(target, sql, 'utf8')
console.log(`Wrote ${target}`)
