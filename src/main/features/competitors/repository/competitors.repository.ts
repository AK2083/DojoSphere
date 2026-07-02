import type { Database } from '@main/shared/database'
import { randomUUID } from 'node:crypto'

import {
  recordCompetitorCreated,
  recordCompetitorDeleted,
  recordCompetitorUpdated
} from '@main/features/audit'
import {
  DEFAULT_AGE_CLASS_ID,
  DEFAULT_BIRTH_DATE,
  DEFAULT_GENDER,
  DEFAULT_NATIONALITY,
  DEFAULT_PASS_NUMBER,
  DEFAULT_WEIGHT_CLASS_ID,
  PLACEHOLDER_DISTRICT_ID,
  UNKNOWN_CLUB_ID
} from '@main/shared/database/reference-seed-ids'
import { getDatabase, runInTransaction } from '@main/shared/database'
import { withDbErrorLogging } from '@main/shared/logging'

/** Gender codes stored in `competitors.gender`. */
export type CompetitorGender = 'd' | 'f' | 'm'

/** Detail fields shared by create and update inputs. */
type CompetitorDetailInput = {
  gender?: CompetitorGender | null
  birthDate?: string | null
  nationality?: string | null
  passNumber?: string | null
  gradeId?: string | null
  licenseNumber?: string | null
  contactPhone?: string | null
  coach?: string | null
}

/** Input for creating a competitor record. */
export type CreateCompetitorInput = CompetitorDetailInput & {
  givenName: string
  familyName: string
  club?: string | null
  weightClass?: string | null
  clubId?: string | null
  weightClassId?: string | null
  ageClassId?: string | null
}

/** Partial input for updating a competitor record. */
export type UpdateCompetitorInput = CompetitorDetailInput & {
  givenName?: string
  familyName?: string
  club?: string | null
  weightClass?: string | null
  clubId?: string | null
  weightClassId?: string | null
  ageClassId?: string | null
}

/** Persisted competitor row returned by repository queries. */
export type CompetitorRecord = {
  id: string
  givenName: string
  familyName: string
  gender: CompetitorGender
  birthDate: string
  nationality: string
  passNumber: string
  club: string | null
  weightClass: string | null
  licenseNumber: string | null
  contactPhone: string | null
  coach: string | null
  clubId: string
  weightClassId: string
  ageClassId: string
  gradeId: string | null
  createdAt: string
  updatedAt: string | null
}

type CompetitorRow = Omit<CompetitorRecord, 'weightClass'> & {
  maxWeightKg: number | null
  minWeightKg: number | null
}

const COMPETITOR_SELECT = `
  SELECT
    c.id,
    c.given_name AS givenName,
    c.family_name AS familyName,
    c.gender AS gender,
    c.birth_date AS birthDate,
    c.nationality AS nationality,
    c.pass_number AS passNumber,
    c.club_id AS clubId,
    c.weight_class_id AS weightClassId,
    c.age_class_id AS ageClassId,
    c.grade_id AS gradeId,
    c.license_number AS licenseNumber,
    c.contact_phone AS contactPhone,
    c.coach AS coach,
    cl.name AS club,
    wc.max_weight_kg AS maxWeightKg,
    wc.min_weight_kg AS minWeightKg,
    c.created_at AS createdAt,
    c.updated_at AS updatedAt
  FROM competitors c
  JOIN clubs cl ON cl.id = c.club_id
  LEFT JOIN weight_classes wc ON wc.id = c.weight_class_id
`

const FIELD_NAME_MAP = {
  givenName: 'given_name',
  familyName: 'family_name',
  clubId: 'club_id',
  weightClassId: 'weight_class_id',
  ageClassId: 'age_class_id'
} as const

const AUDIT_FIELD_NAME_MAP: Record<keyof typeof FIELD_NAME_MAP, string> = {
  givenName: 'given_name',
  familyName: 'family_name',
  clubId: 'club',
  weightClassId: 'weight_class',
  ageClassId: 'age_class_id'
}

function formatWeightKg(value: number): string {
  return Number.isInteger(value) ? String(value) : String(value).replace(/\.0$/, '')
}

function formatWeightClassDisplay(
  maxWeightKg: number | null,
  minWeightKg: number | null
): string | null {
  if (maxWeightKg !== null) {
    return `-${formatWeightKg(maxWeightKg)}`
  }

  if (minWeightKg !== null) {
    return `+${formatWeightKg(minWeightKg)}`
  }

  return null
}

function mapCompetitorRow(row: CompetitorRow): CompetitorRecord {
  const { maxWeightKg, minWeightKg, ...competitor } = row

  return {
    ...competitor,
    weightClass: formatWeightClassDisplay(maxWeightKg, minWeightKg)
  }
}

function resolveClubId(db: Database, club?: string | null, clubId?: string | null): string {
  if (clubId?.trim()) {
    return clubId.trim()
  }

  const clubName = club?.trim()

  if (!clubName) {
    return UNKNOWN_CLUB_ID
  }

  const existing = db.prepare(`SELECT id FROM clubs WHERE name = ?`).get(clubName) as
    { id: string } | undefined

  if (existing) {
    return existing.id
  }

  const id = randomUUID()

  db.prepare(
    `
    INSERT INTO clubs (id, district_id, name, is_active, source)
    VALUES (?, ?, ?, 1, 'manual')
  `
  ).run(id, PLACEHOLDER_DISTRICT_ID, clubName)

  return id
}

function parseWeightLimitKg(weightClass?: string | null): number | null {
  const trimmed = weightClass?.trim()

  if (!trimmed) {
    return null
  }

  const withoutSign =
    trimmed.startsWith('+') || trimmed.startsWith('-') ? trimmed.slice(1) : trimmed

  if (!withoutSign) {
    return null
  }

  const value = Number(withoutSign)

  return Number.isFinite(value) ? value : null
}

function resolveWeightClassId(
  db: Database,
  weightClass?: string | null,
  weightClassId?: string | null,
  ageClassId: string = DEFAULT_AGE_CLASS_ID
): string {
  if (weightClassId?.trim()) {
    return weightClassId.trim()
  }

  const trimmed = weightClass?.trim()
  const limitKg = parseWeightLimitKg(weightClass)

  if (limitKg === null) {
    return DEFAULT_WEIGHT_CLASS_ID
  }

  if (trimmed?.startsWith('+')) {
    const plusMatch = db
      .prepare(
        `
      SELECT id
      FROM weight_classes
      WHERE age_class_id = ? AND min_weight_kg = ?
      LIMIT 1
    `
      )
      .get(ageClassId, limitKg) as { id: string } | undefined

    return plusMatch?.id ?? DEFAULT_WEIGHT_CLASS_ID
  }

  const minusMatch = db
    .prepare(
      `
      SELECT id
      FROM weight_classes
      WHERE age_class_id = ? AND max_weight_kg = ?
      LIMIT 1
    `
    )
    .get(ageClassId, limitKg) as { id: string } | undefined

  return minusMatch?.id ?? DEFAULT_WEIGHT_CLASS_ID
}

const GENDER_CODES: ReadonlySet<CompetitorGender> = new Set(['f', 'm', 'd'])

function normalizeGender(gender?: CompetitorGender | null): CompetitorGender {
  const value = gender?.trim() as CompetitorGender | undefined

  return value && GENDER_CODES.has(value) ? value : DEFAULT_GENDER
}

function normalizeBirthDate(birthDate?: string | null): string {
  const trimmed = birthDate?.trim()

  return trimmed || DEFAULT_BIRTH_DATE
}

function normalizeNationality(nationality?: string | null): string {
  const trimmed = nationality?.trim()

  return trimmed ? trimmed.toUpperCase() : DEFAULT_NATIONALITY
}

function normalizePassNumber(passNumber?: string | null): string {
  const trimmed = passNumber?.trim()

  return trimmed || DEFAULT_PASS_NUMBER
}

function normalizeOptionalText(value?: string | null): string | null {
  const trimmed = value?.trim()

  return trimmed ? trimmed : null
}

/**
 * Returns a single competitor by id, or null when not found.
 *
 * @param competitorId - Identifier of the competitor to load.
 * @returns The competitor record or null.
 */
export function getCompetitor(competitorId: string): CompetitorRecord | null {
  return getCompetitorById(competitorId)
}

function getCompetitorById(competitorId: string): CompetitorRecord | null {
  const db = getDatabase()

  const row = db.prepare(`${COMPETITOR_SELECT} WHERE c.id = ?`).get(competitorId) as
    CompetitorRow | undefined

  return row ? mapCompetitorRow(row) : null
}

/**
 * Returns all competitors ordered by creation time.
 *
 * @returns All competitor records in the database.
 */
export function getCompetitors(): CompetitorRecord[] {
  return withDbErrorLogging('competitors', 'list', () => {
    const db = getDatabase()

    return (
      db.prepare(`${COMPETITOR_SELECT} ORDER BY c.created_at ASC`).all() as CompetitorRow[]
    ).map(mapCompetitorRow)
  })
}

/**
 * Creates a competitor and records an audit event.
 *
 * @param actorUserId - User performing the action.
 * @param input - Competitor fields to persist.
 * @returns The created competitor record.
 */
export function addCompetitor(actorUserId: string, input: CreateCompetitorInput): CompetitorRecord {
  const givenName = input.givenName.trim()
  const familyName = input.familyName.trim()

  if (!givenName) {
    throw new Error('Given name must not be empty')
  }

  if (!familyName) {
    throw new Error('Family name must not be empty')
  }

  const db = getDatabase()
  const id = randomUUID()
  const ageClassId = input.ageClassId?.trim() || DEFAULT_AGE_CLASS_ID
  const clubId = resolveClubId(db, input.club, input.clubId)
  const weightClassId = resolveWeightClassId(db, input.weightClass, input.weightClassId, ageClassId)
  const gradeId = normalizeOptionalText(input.gradeId)
  const licenseNumber = normalizeOptionalText(input.licenseNumber)
  const contactPhone = normalizeOptionalText(input.contactPhone)
  const coach = normalizeOptionalText(input.coach)

  return withDbErrorLogging('competitors', 'create', () => {
    runInTransaction(db, () => {
      db.prepare(
        `
      INSERT INTO competitors (
        id,
        given_name,
        family_name,
        gender,
        birth_date,
        club_id,
        nationality,
        weight_class_id,
        age_class_id,
        pass_number,
        grade_id,
        license_number,
        contact_phone,
        coach
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
      ).run(
        id,
        givenName,
        familyName,
        normalizeGender(input.gender),
        normalizeBirthDate(input.birthDate),
        clubId,
        normalizeNationality(input.nationality),
        weightClassId,
        ageClassId,
        normalizePassNumber(input.passNumber),
        gradeId,
        licenseNumber,
        contactPhone,
        coach
      )

      recordCompetitorCreated({ actorUserId, competitorId: id })
    })

    const competitor = getCompetitorById(id)

    if (!competitor) {
      throw new Error('Competitor not found')
    }

    return competitor
  })
}

/**
 * Updates a competitor and records an audit event with changed field names only.
 *
 * @param actorUserId - User performing the action.
 * @param competitorId - Identifier of the competitor to update.
 * @param input - Fields to update.
 * @returns The updated competitor record.
 */
export function updateCompetitor(
  actorUserId: string,
  competitorId: string,
  input: UpdateCompetitorInput
): CompetitorRecord {
  const existing = getCompetitorById(competitorId)

  if (!existing) {
    throw new Error('Competitor not found')
  }

  const nextAgeClassId = input.ageClassId?.trim() || existing.ageClassId
  const nextValues = {
    givenName: input.givenName !== undefined ? input.givenName.trim() : existing.givenName,
    familyName: input.familyName !== undefined ? input.familyName.trim() : existing.familyName,
    clubId:
      input.clubId !== undefined || input.club !== undefined
        ? resolveClubId(getDatabase(), input.club, input.clubId)
        : existing.clubId,
    weightClassId:
      input.weightClassId !== undefined || input.weightClass !== undefined
        ? resolveWeightClassId(
            getDatabase(),
            input.weightClass,
            input.weightClassId,
            nextAgeClassId
          )
        : existing.weightClassId,
    ageClassId: nextAgeClassId
  }

  const nextDetails = {
    gender: input.gender !== undefined ? normalizeGender(input.gender) : existing.gender,
    birthDate:
      input.birthDate !== undefined ? normalizeBirthDate(input.birthDate) : existing.birthDate,
    nationality:
      input.nationality !== undefined
        ? normalizeNationality(input.nationality)
        : existing.nationality,
    passNumber:
      input.passNumber !== undefined ? normalizePassNumber(input.passNumber) : existing.passNumber,
    gradeId: input.gradeId !== undefined ? normalizeOptionalText(input.gradeId) : existing.gradeId,
    licenseNumber:
      input.licenseNumber !== undefined
        ? normalizeOptionalText(input.licenseNumber)
        : existing.licenseNumber,
    contactPhone:
      input.contactPhone !== undefined
        ? normalizeOptionalText(input.contactPhone)
        : existing.contactPhone,
    coach: input.coach !== undefined ? normalizeOptionalText(input.coach) : existing.coach
  }

  if (!nextValues.givenName) {
    throw new Error('Given name must not be empty')
  }

  if (!nextValues.familyName) {
    throw new Error('Family name must not be empty')
  }

  const changedFields = (Object.keys(FIELD_NAME_MAP) as Array<keyof typeof FIELD_NAME_MAP>).filter(
    (field) => nextValues[field] !== existing[field]
  )

  const detailChanged = (Object.keys(nextDetails) as Array<keyof typeof nextDetails>).some(
    (field) => nextDetails[field] !== existing[field]
  )

  if (changedFields.length === 0 && !detailChanged) {
    return existing
  }

  const db = getDatabase()

  return withDbErrorLogging('competitors', 'update', () => {
    runInTransaction(db, () => {
      db.prepare(
        `
      UPDATE competitors
      SET
        given_name = ?,
        family_name = ?,
        club_id = ?,
        weight_class_id = ?,
        age_class_id = ?,
        gender = ?,
        birth_date = ?,
        nationality = ?,
        pass_number = ?,
        grade_id = ?,
        license_number = ?,
        contact_phone = ?,
        coach = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `
      ).run(
        nextValues.givenName,
        nextValues.familyName,
        nextValues.clubId,
        nextValues.weightClassId,
        nextValues.ageClassId,
        nextDetails.gender,
        nextDetails.birthDate,
        nextDetails.nationality,
        nextDetails.passNumber,
        nextDetails.gradeId,
        nextDetails.licenseNumber,
        nextDetails.contactPhone,
        nextDetails.coach,
        competitorId
      )

      if (changedFields.length > 0) {
        recordCompetitorUpdated({
          actorUserId,
          competitorId,
          changedFields: changedFields.map((field) => AUDIT_FIELD_NAME_MAP[field])
        })
      }
    })

    const competitor = getCompetitorById(competitorId)

    if (!competitor) {
      throw new Error('Competitor not found')
    }

    return competitor
  })
}

/**
 * Deletes a competitor and records an audit event.
 *
 * @param actorUserId - User performing the action.
 * @param competitorId - Identifier of the competitor to delete.
 */
export function deleteCompetitor(actorUserId: string, competitorId: string): void {
  const existing = getCompetitorById(competitorId)

  if (!existing) {
    throw new Error('Competitor not found')
  }

  const db = getDatabase()

  withDbErrorLogging('competitors', 'delete', () => {
    runInTransaction(db, () => {
      db.prepare(`DELETE FROM competitors WHERE id = ?`).run(competitorId)

      recordCompetitorDeleted({ actorUserId, competitorId })
    })
  })
}
