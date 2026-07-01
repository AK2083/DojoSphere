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
  DEFAULT_WEIGHT_CLASS_ID,
  PLACEHOLDER_DISTRICT_ID,
  UNKNOWN_CLUB_ID
} from '@main/shared/database/reference-seed-ids'
import { getDatabase, runInTransaction } from '@main/shared/database'
import { withDbErrorLogging } from '@main/shared/logging'

/** Input for creating a competitor record. */
export type CreateCompetitorInput = {
  givenName: string
  familyName: string
  club?: string | null
  weightClass?: string | null
  clubId?: string | null
  weightClassId?: string | null
  ageClassId?: string | null
}

/** Partial input for updating a competitor record. */
export type UpdateCompetitorInput = {
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
  club: string | null
  weightClass: string | null
  clubId: string
  weightClassId: string
  ageClassId: string
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
    c.club_id AS clubId,
    c.weight_class_id AS weightClassId,
    c.age_class_id AS ageClassId,
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
        pass_number
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
      ).run(
        id,
        givenName,
        familyName,
        DEFAULT_GENDER,
        DEFAULT_BIRTH_DATE,
        clubId,
        DEFAULT_NATIONALITY,
        weightClassId,
        ageClassId,
        ''
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

  if (!nextValues.givenName) {
    throw new Error('Given name must not be empty')
  }

  if (!nextValues.familyName) {
    throw new Error('Family name must not be empty')
  }

  const changedFields = (Object.keys(FIELD_NAME_MAP) as Array<keyof typeof FIELD_NAME_MAP>).filter(
    (field) => nextValues[field] !== existing[field]
  )

  if (changedFields.length === 0) {
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
        updated_at = datetime('now')
      WHERE id = ?
    `
      ).run(
        nextValues.givenName,
        nextValues.familyName,
        nextValues.clubId,
        nextValues.weightClassId,
        nextValues.ageClassId,
        competitorId
      )

      recordCompetitorUpdated({
        actorUserId,
        competitorId,
        changedFields: changedFields.map((field) => AUDIT_FIELD_NAME_MAP[field])
      })
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
