import fs from 'node:fs'

function parseAgeClasses() {
  const sql = fs.readFileSync(
    'src/main/shared/database/migrations/V005__age_classes_create_table.sql',
    'utf8'
  )
  const ageRe =
    /\('([^']+)', (\d+), '([fm])', '([^']+)', '([^']+)', [^,]+, [^,]+, [^,]*, \d+, '[^']*', '([^']+)'/g
  const rows = []
  let match

  while ((match = ageRe.exec(sql))) {
    rows.push({
      id: match[1],
      djbRow: Number(match[2]),
      gender: match[3],
      competitionForm: match[4],
      labelKey: match[5],
      weightMode: match[6]
    })
  }

  return rows
}

function parseGrades() {
  const sql = fs.readFileSync(
    'src/main/shared/database/migrations/V004__grades_create_table.sql',
    'utf8'
  )
  const re = /\('([^']+)', '([kd])', (\d+), '([^']+)', (\d+)\)/g
  const rows = []
  let match

  while ((match = re.exec(sql))) {
    rows.push({
      id: match[1],
      gradeType: match[2],
      level: Number(match[3]),
      labelKey: match[4],
      sortOrder: Number(match[5])
    })
  }

  return rows
}

function parseWeightClasses(ageByRow) {
  const sql = fs.readFileSync(
    'src/main/shared/database/migrations/V006__weight_classes_create_table.sql',
    'utf8'
  )
  const re = /SELECT '([^']+)', id, (\d+), ([^,]+), ([^,]+),/g
  const rows = []
  let match
  let sort = 0

  while ((match = re.exec(sql))) {
    sort += 1
    const djbRow = Number(match[2])

    rows.push({
      id: match[1],
      djbRow,
      ageClassId: ageByRow[djbRow].id,
      maxWeightKg: match[3].trim() === 'NULL' ? null : Number(match[3]),
      minWeightKg: match[4].trim() === 'NULL' ? null : Number(match[4]),
      sortOrder: sort
    })
  }

  return rows
}

const ageClasses = parseAgeClasses()
const ageByRow = Object.fromEntries(ageClasses.map((ageClass) => [ageClass.djbRow, ageClass]))
const grades = parseGrades()
const weightClasses = parseWeightClasses(ageByRow)

const clubs = [{ id: '00000000-0000-0000-0000-000000000000', nameKey: 'unknown' }]
const nationalities = ['DE', 'AT', 'CH']

const header = `/** Static reference data aligned with SQLite seed migrations (V004–V007). */
/* eslint-disable jsdoc/require-jsdoc -- generated seed constants */

export type AgeClassSeed = {
  id: string
  djbRow: number
  gender: 'f' | 'm'
  competitionForm: 'individual' | 'team'
  labelKey: string
  weightMode: 'fixed' | 'flexible'
}

export type GradeSeed = {
  id: string
  gradeType: 'k' | 'd'
  level: number
  labelKey: string
  sortOrder: number
}

export type WeightClassSeed = {
  id: string
  djbRow: number
  ageClassId: string
  maxWeightKg: number | null
  minWeightKg: number | null
  sortOrder: number
}

export type ClubSeed = {
  id: string
  nameKey: string
}

`

const body = `${header}export const AGE_CLASS_SEEDS: AgeClassSeed[] = ${JSON.stringify(ageClasses, null, 2)}

export const GRADE_SEEDS: GradeSeed[] = ${JSON.stringify(grades, null, 2)}

export const WEIGHT_CLASS_SEEDS: WeightClassSeed[] = ${JSON.stringify(weightClasses, null, 2)}

export const CLUB_SEEDS: ClubSeed[] = ${JSON.stringify(clubs, null, 2)}

export const NATIONALITY_CODES = ${JSON.stringify(nationalities)} as const
`

const target = 'src/renderer/features/competitors/save-participant/model/static-reference-data.ts'
fs.writeFileSync(target, body)
console.log(`Wrote ${target}`)
