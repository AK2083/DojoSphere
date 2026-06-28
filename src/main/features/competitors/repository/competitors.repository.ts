import { randomUUID } from 'node:crypto'

import {
  recordCompetitorCreated,
  recordCompetitorDeleted,
  recordCompetitorUpdated
} from '@main/features/audit'
import { getDatabase, runInTransaction } from '@main/shared/database'
import { withDbErrorLogging } from '@main/shared/logging'

/** Input for creating a competitor record. */
export type CreateCompetitorInput = {
  givenName: string
  familyName: string
  club?: string | null
  weightClass?: string | null
}

/** Partial input for updating a competitor record. */
export type UpdateCompetitorInput = {
  givenName?: string
  familyName?: string
  club?: string | null
  weightClass?: string | null
}

/** Persisted competitor row returned by repository queries. */
export type CompetitorRecord = {
  id: string
  givenName: string
  familyName: string
  club: string | null
  weightClass: string | null
  createdAt: string
  updatedAt: string | null
}

const FIELD_NAME_MAP = {
  givenName: 'given_name',
  familyName: 'family_name',
  club: 'club',
  weightClass: 'weight_class'
} as const

function mapCompetitorRow(row: {
  id: string
  givenName: string
  familyName: string
  club: string | null
  weightClass: string | null
  createdAt: string
  updatedAt: string | null
}): CompetitorRecord {
  return row
}

function getCompetitorById(competitorId: string): CompetitorRecord | null {
  const db = getDatabase()

  const row = db
    .prepare(
      `
      SELECT
        id,
        given_name AS givenName,
        family_name AS familyName,
        club,
        weight_class AS weightClass,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM competitors
      WHERE id = ?
    `
    )
    .get(competitorId) as CompetitorRecord | undefined

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

    return db
      .prepare(
        `
      SELECT
        id,
        given_name AS givenName,
        family_name AS familyName,
        club,
        weight_class AS weightClass,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM competitors
      ORDER BY created_at ASC
    `
      )
      .all() as CompetitorRecord[]
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

  return withDbErrorLogging('competitors', 'create', () => {
    runInTransaction(db, () => {
      db.prepare(
        `
      INSERT INTO competitors (id, given_name, family_name, club, weight_class)
      VALUES (?, ?, ?, ?, ?)
    `
      ).run(id, givenName, familyName, input.club ?? null, input.weightClass ?? null)

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

  const nextValues = {
    givenName: input.givenName !== undefined ? input.givenName.trim() : existing.givenName,
    familyName: input.familyName !== undefined ? input.familyName.trim() : existing.familyName,
    club: input.club !== undefined ? input.club : existing.club,
    weightClass: input.weightClass !== undefined ? input.weightClass : existing.weightClass
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
      SET given_name = ?, family_name = ?, club = ?, weight_class = ?, updated_at = datetime('now')
      WHERE id = ?
    `
      ).run(
        nextValues.givenName,
        nextValues.familyName,
        nextValues.club,
        nextValues.weightClass,
        competitorId
      )

      recordCompetitorUpdated({
        actorUserId,
        competitorId,
        changedFields: changedFields.map((field) => FIELD_NAME_MAP[field])
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
