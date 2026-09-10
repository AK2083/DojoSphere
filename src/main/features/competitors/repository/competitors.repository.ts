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
  DEFAULT_GRADING_SYSTEM_ID,
  DEFAULT_NATIONALITY,
  DEFAULT_PASS_NUMBER,
  PLACEHOLDER_DISTRICT_ID,
  UNKNOWN_ASSOCIATION_ID
} from '@main/shared/database/reference-seed-ids'
import { getDatabase, runInTransaction } from '@main/shared/database'
import { withDbErrorLogging } from '@main/shared/logging'

import { parseGradeFromCell } from '../import/parse-grade'
import { assertNoDuplicateCompetitor } from './competitor-duplicate'
import { importRowFailureCode } from './competitor-import-row-error'

/** Gender codes stored in `competitors.gender`. */
export type CompetitorGender = 'd' | 'f' | 'm'

/** Registration status codes stored in `competitors.registration_status`. */
export type CompetitorRegistrationStatus = 'late_registration' | 'registered'

const REGISTRATION_STATUS_CODES: ReadonlySet<CompetitorRegistrationStatus> = new Set([
  'registered',
  'late_registration'
])

const REMARKS_MAX_LENGTH = 500

/** Detail fields shared by create and update inputs. */
type CompetitorDetailInput = {
  gender?: CompetitorGender | null
  birthDate?: string | null
  nationality?: string | null
  passNumber?: string | null
  gradeId?: string | null
  licenseNumber?: string | null
  contactPhone?: string | null
  contactPerson?: string | null
  startEligible?: boolean | null
  registrationStatus?: CompetitorRegistrationStatus | null
  remarks?: string | null
}

/** Input for creating a competitor record. */
export type CreateCompetitorInput = CompetitorDetailInput & {
  givenName: string
  familyName: string
  association?: string | null
  weightClass?: string | null
  associationId?: string | null
  weightClassId?: string | null
  ageClassId?: string | null
}

/** Partial input for updating a competitor record. */
export type UpdateCompetitorInput = CompetitorDetailInput & {
  givenName?: string
  familyName?: string
  association?: string | null
  weightClass?: string | null
  associationId?: string | null
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
  association: string | null
  weightClass: string | null
  licenseNumber: string | null
  contactPhone: string | null
  contactPerson: string | null
  associationId: string
  weightClassId: string | null
  ageClassId: string
  gradeId: string | null
  startEligible: boolean
  registrationStatus: CompetitorRegistrationStatus | null
  remarks: string | null
  createdAt: string
  updatedAt: string | null
}

type CompetitorRow = Omit<CompetitorRecord, 'weightClass' | 'startEligible'> & {
  maxWeightKg: number | null
  minWeightKg: number | null
  startEligible: number
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
    c.association_id AS associationId,
    c.weight_class_id AS weightClassId,
    c.age_class_id AS ageClassId,
    c.grade_id AS gradeId,
    c.license_number AS licenseNumber,
    c.contact_phone AS contactPhone,
    c.contact_person AS contactPerson,
    c.start_eligible AS startEligible,
    c.registration_status AS registrationStatus,
    c.remarks AS remarks,
    cl.name AS association,
    wc.max_weight_kg AS maxWeightKg,
    wc.min_weight_kg AS minWeightKg,
    c.created_at AS createdAt,
    c.updated_at AS updatedAt
  FROM competitors c
  JOIN associations cl ON cl.id = c.association_id
  LEFT JOIN weight_classes wc ON wc.id = c.weight_class_id
`

const FIELD_NAME_MAP = {
  givenName: 'given_name',
  familyName: 'family_name',
  associationId: 'association_id',
  weightClassId: 'weight_class_id',
  ageClassId: 'age_class_id'
} as const

const AUDIT_FIELD_NAME_MAP: Record<keyof typeof FIELD_NAME_MAP, string> = {
  givenName: 'given_name',
  familyName: 'family_name',
  associationId: 'association',
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
  const { maxWeightKg, minWeightKg, startEligible, ...competitor } = row

  return {
    ...competitor,
    startEligible: startEligible === 1,
    weightClass: formatWeightClassDisplay(maxWeightKg, minWeightKg)
  }
}

function resolveAssociationId(
  db: Database,
  association?: string | null,
  associationId?: string | null
): string {
  if (associationId?.trim()) {
    const candidateId = associationId.trim()
    const existingById = db.prepare(`SELECT id FROM associations WHERE id = ?`).get(candidateId) as
      { id: string } | undefined

    if (!existingById) {
      throw new Error('Association not found')
    }

    return existingById.id
  }

  const associationName = association?.trim()

  if (!associationName) {
    return UNKNOWN_ASSOCIATION_ID
  }

  const existing = db.prepare(`SELECT id FROM associations WHERE name = ?`).get(associationName) as
    { id: string } | undefined

  if (existing) {
    return existing.id
  }

  const id = randomUUID()

  db.prepare(
    `
    INSERT INTO associations (id, district_id, name, is_active, source)
    VALUES (?, ?, ?, 1, 'manual')
  `
  ).run(id, PLACEHOLDER_DISTRICT_ID, associationName)

  return id
}

/**
 * Stores or updates the email contact for a association.
 *
 * @param db - Database connection.
 * @param associationId - Association to attach the email contact to.
 * @param email - Email address from the import row.
 */
export function upsertAssociationContactEmail(
  db: Database,
  associationId: string,
  email: string
): void {
  const trimmed = email.trim()

  if (!trimmed || associationId === UNKNOWN_ASSOCIATION_ID) {
    return
  }

  const existing = db
    .prepare(
      `
      SELECT id
      FROM association_contacts
      WHERE association_id = ? AND contact_type = 'email'
      LIMIT 1
    `
    )
    .get(associationId) as { id: string } | undefined

  if (existing) {
    db.prepare(`UPDATE association_contacts SET value = ? WHERE id = ?`).run(trimmed, existing.id)
    return
  }

  db.prepare(
    `
    INSERT INTO association_contacts (id, association_id, contact_type, value, is_public)
    VALUES (?, ?, 'email', ?, 0)
  `
  ).run(randomUUID(), associationId, trimmed)
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
): string | null {
  if (weightClassId?.trim()) {
    const candidateId = weightClassId.trim()
    const candidate = db
      .prepare(
        `
        SELECT id
        FROM weight_classes
        WHERE id = ? AND age_class_id = ?
        LIMIT 1
      `
      )
      .get(candidateId, ageClassId) as { id: string } | undefined

    if (candidate) {
      return candidate.id
    }
  }

  const trimmed = weightClass?.trim()
  const limitKg = parseWeightLimitKg(weightClass)

  if (limitKg === null) {
    return resolveDefaultWeightClassId(db, ageClassId)
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

    return plusMatch?.id ?? resolveDefaultWeightClassId(db, ageClassId)
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

  return minusMatch?.id ?? resolveDefaultWeightClassId(db, ageClassId)
}

/**
 * Resolves the weight class id for a measured body weight within an age class.
 *
 * Picks the lightest class whose upper limit still covers the weight; falls back
 * to an open (`+`) class when the athlete exceeds every capped class.
 *
 * @param db - Database connection.
 * @param weightKg - Measured body weight in kilograms.
 * @param ageClassId - Age class the weight class must belong to.
 * @returns Matching weight class id, or the default class when none fits.
 */
export function resolveWeightClassIdFromKg(
  db: Database,
  weightKg: number,
  ageClassId: string = DEFAULT_AGE_CLASS_ID
): string | null {
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    return resolveDefaultWeightClassId(db, ageClassId)
  }

  const cappedMatch = db
    .prepare(
      `
      SELECT id
      FROM weight_classes
      WHERE age_class_id = ? AND max_weight_kg IS NOT NULL AND max_weight_kg >= ?
      ORDER BY max_weight_kg ASC
      LIMIT 1
    `
    )
    .get(ageClassId, weightKg) as { id: string } | undefined

  if (cappedMatch) {
    return cappedMatch.id
  }

  const openMatch = db
    .prepare(
      `
      SELECT id
      FROM weight_classes
      WHERE age_class_id = ? AND max_weight_kg IS NULL AND min_weight_kg IS NOT NULL
      ORDER BY min_weight_kg DESC
      LIMIT 1
    `
    )
    .get(ageClassId) as { id: string } | undefined

  if (openMatch) {
    return openMatch.id
  }

  return resolveDefaultWeightClassId(db, ageClassId)
}

function resolveDefaultWeightClassId(db: Database, ageClassId: string): string | null {
  const match = db
    .prepare(
      `
      SELECT id
      FROM weight_classes
      WHERE age_class_id = ?
      ORDER BY sort_order ASC
      LIMIT 1
    `
    )
    .get(ageClassId) as { id: string } | undefined

  return match?.id ?? null
}

/**
 * Resolves a grade id from free-text such as `8. Kyu` or a bare number in a Kyu column.
 *
 * Uses the default DJB grading system when no system is specified.
 *
 * @param db - Database connection.
 * @param gradeText - Raw grade cell value.
 * @param headerHint - Optional column header used to infer kyu vs dan.
 * @param gradingSystemId - Grading system to match against.
 * @returns Matching grade id, or null when the text cannot be resolved.
 */
export function resolveGradeIdFromText(
  db: Database,
  gradeText: string | undefined,
  headerHint?: string,
  gradingSystemId: string = DEFAULT_GRADING_SYSTEM_ID
): string | null {
  const parsed = parseGradeFromCell(gradeText ?? '', headerHint)

  if (!parsed) {
    return null
  }

  const match = db
    .prepare(
      `
      SELECT id
      FROM grades
      WHERE grading_system_id = ? AND level_type = ? AND level_number = ?
      LIMIT 1
    `
    )
    .get(gradingSystemId, parsed.levelType, parsed.levelNumber) as { id: string } | undefined

  return match?.id ?? null
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

function normalizeStartEligible(value?: boolean | null): number {
  return value === false ? 0 : 1
}

function normalizeRegistrationStatus(
  value?: CompetitorRegistrationStatus | null
): CompetitorRegistrationStatus | null {
  return value && REGISTRATION_STATUS_CODES.has(value) ? value : null
}

function normalizeRemarks(value?: string | null): string | null {
  const trimmed = value?.trim()

  if (!trimmed) {
    return null
  }

  return trimmed.length > REMARKS_MAX_LENGTH ? trimmed.slice(0, REMARKS_MAX_LENGTH) : trimmed
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
  const associationId = resolveAssociationId(db, input.association, input.associationId)
  const weightClassId = resolveWeightClassId(db, input.weightClass, input.weightClassId, ageClassId)
  const gradeId = normalizeOptionalText(input.gradeId)
  const licenseNumber = normalizeOptionalText(input.licenseNumber)
  const contactPhone = normalizeOptionalText(input.contactPhone)
  const contactPerson = normalizeOptionalText(input.contactPerson)
  const startEligible = normalizeStartEligible(input.startEligible)
  const registrationStatus = normalizeRegistrationStatus(input.registrationStatus)
  const remarks = normalizeRemarks(input.remarks)

  assertNoDuplicateCompetitor(db, {
    givenName,
    familyName,
    birthDate: input.birthDate,
    passNumber: input.passNumber,
    licenseNumber: input.licenseNumber
  })

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
        association_id,
        nationality,
        weight_class_id,
        age_class_id,
        pass_number,
        grade_id,
        license_number,
        contact_phone,
        contact_person,
        start_eligible,
        registration_status,
        remarks
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
      ).run(
        id,
        givenName,
        familyName,
        normalizeGender(input.gender),
        normalizeBirthDate(input.birthDate),
        associationId,
        normalizeNationality(input.nationality),
        weightClassId,
        ageClassId,
        normalizePassNumber(input.passNumber),
        gradeId,
        licenseNumber,
        contactPhone,
        contactPerson,
        startEligible,
        registrationStatus,
        remarks
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

/** Per-row outcome of a bulk competitor import. */
export type ImportCompetitorResult = {
  index: number
  success: boolean
  competitor?: CompetitorRecord
  errorCode?: string
}

/**
 * Imports competitors one row at a time with atomic per-row persistence.
 *
 * Each row is fully validated and inserted in its own transaction. A failing
 * row never writes a partial record and does not abort the remaining rows.
 *
 * @param actorUserId - User performing the import.
 * @param inputs - Competitor inputs to persist, in source order.
 * @returns One result entry per input row, preserving order.
 */
export function importCompetitors(
  actorUserId: string,
  inputs: CreateCompetitorInput[]
): ImportCompetitorResult[] {
  return inputs.map((input, index) => {
    try {
      const competitor = addCompetitor(actorUserId, input)

      return { index, success: true, competitor }
    } catch (error) {
      return { index, success: false, errorCode: importRowFailureCode(error) }
    }
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
  const ageClassChanged = nextAgeClassId !== existing.ageClassId
  const nextValues = {
    givenName: input.givenName !== undefined ? input.givenName.trim() : existing.givenName,
    familyName: input.familyName !== undefined ? input.familyName.trim() : existing.familyName,
    associationId:
      input.associationId !== undefined || input.association !== undefined
        ? resolveAssociationId(getDatabase(), input.association, input.associationId)
        : existing.associationId,
    weightClassId:
      input.weightClassId !== undefined || input.weightClass !== undefined || ageClassChanged
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
    contactPerson:
      input.contactPerson !== undefined
        ? normalizeOptionalText(input.contactPerson)
        : existing.contactPerson,
    startEligible:
      input.startEligible !== undefined
        ? normalizeStartEligible(input.startEligible) === 1
        : existing.startEligible,
    registrationStatus:
      input.registrationStatus !== undefined
        ? normalizeRegistrationStatus(input.registrationStatus)
        : existing.registrationStatus,
    remarks: input.remarks !== undefined ? normalizeRemarks(input.remarks) : existing.remarks
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

  assertNoDuplicateCompetitor(
    db,
    {
      givenName: nextValues.givenName,
      familyName: nextValues.familyName,
      birthDate: nextDetails.birthDate,
      passNumber: nextDetails.passNumber,
      licenseNumber: nextDetails.licenseNumber
    },
    competitorId
  )

  return withDbErrorLogging('competitors', 'update', () => {
    runInTransaction(db, () => {
      db.prepare(
        `
      UPDATE competitors
      SET
        given_name = ?,
        family_name = ?,
        association_id = ?,
        weight_class_id = ?,
        age_class_id = ?,
        gender = ?,
        birth_date = ?,
        nationality = ?,
        pass_number = ?,
        grade_id = ?,
        license_number = ?,
        contact_phone = ?,
        contact_person = ?,
        start_eligible = ?,
        registration_status = ?,
        remarks = ?
      WHERE id = ?
    `
      ).run(
        nextValues.givenName,
        nextValues.familyName,
        nextValues.associationId,
        nextValues.weightClassId,
        nextValues.ageClassId,
        nextDetails.gender,
        nextDetails.birthDate,
        nextDetails.nationality,
        nextDetails.passNumber,
        nextDetails.gradeId,
        nextDetails.licenseNumber,
        nextDetails.contactPhone,
        nextDetails.contactPerson,
        nextDetails.startEligible ? 1 : 0,
        nextDetails.registrationStatus,
        nextDetails.remarks,
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
