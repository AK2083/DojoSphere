import { randomUUID } from 'node:crypto'

import { recordRoleAssigned } from '@main/features/audit'
import { findRoleIdByName } from '@main/features/authorization'
import { getDatabase, runInTransaction } from '@main/shared/database'
import { withDbErrorLogging } from '@main/shared/logging'

/** Input for creating a user record. */
export type CreateUserInput = {
  displayName: string
  email?: string | null
  userType?: 'local' | 'device' | 'system'
}

/** Persisted user row returned by repository queries. */
export type UserRecord = {
  id: string
  displayName: string
  email: string | null
  userType: 'local' | 'device' | 'system'
  createdAt: string
  updatedAt: string | null
}

/**
 * Returns all users ordered by creation time.
 *
 * @returns All user records in the database.
 */
export function getUsers(): UserRecord[] {
  return withDbErrorLogging('users', 'list', () => {
    const db = getDatabase()

    return db
      .prepare(
        `
      SELECT
        id,
        display_name AS displayName,
        email,
        user_type AS userType,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM users
    `
      )
      .all() as UserRecord[]
  })
}

/**
 * Creates a user and assigns the list-keeper role for local users.
 *
 * @param user - User fields to persist.
 * @returns The created user identifier.
 */
export function addUser(user: CreateUserInput) {
  const db = getDatabase()
  const id = randomUUID()
  const userType = user.userType ?? 'local'

  const insertUser = db.prepare(`
    INSERT INTO users (id, display_name, email, user_type)
    VALUES (?, ?, ?, ?)
  `)

  const insertRoleAssignment = db.prepare(`
    INSERT INTO user_role_assignments (id, user_id, role_id, scope_type, created_by_user_id)
    VALUES (?, ?, ?, 'global', ?)
  `)

  return withDbErrorLogging('users', 'create', () => {
    runInTransaction(db, () => {
      insertUser.run(id, user.displayName, user.email ?? null, userType)

      if (userType === 'local') {
        const roleId = findRoleIdByName('list_keeper')
        const assignmentId = randomUUID()

        insertRoleAssignment.run(assignmentId, id, roleId, id)

        recordRoleAssigned({
          actorUserId: id,
          roleId,
          userId: id,
          assignmentId,
          scopeType: 'global'
        })
      }
    })

    return { id }
  })
}

/**
 * Finds a local user by exact display name match.
 *
 * @param displayName - Display name to look up.
 * @returns The matching user or null when not found.
 */
export function findLocalUserByDisplayName(displayName: string): UserRecord | null {
  return withDbErrorLogging('users', 'findByDisplayName', () => {
    const db = getDatabase()

    const row = db
      .prepare(
        `
      SELECT
        id,
        display_name AS displayName,
        email,
        user_type AS userType,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM users
      WHERE display_name = ?
        AND user_type = 'local'
      LIMIT 1
    `
      )
      .get(displayName) as UserRecord | undefined

    return row ?? null
  })
}

function getUserById(userId: string): UserRecord | null {
  const db = getDatabase()

  const row = db
    .prepare(
      `
      SELECT
        id,
        display_name AS displayName,
        email,
        user_type AS userType,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM users
      WHERE id = ?
    `
    )
    .get(userId) as UserRecord | undefined

  return row ?? null
}

/**
 * Updates the display name of an existing user.
 *
 * @param userId - Identifier of the user to update.
 * @param displayName - New display name (trimmed; must not be empty).
 * @returns The updated user record.
 * @throws {Error} When the display name is empty or the user does not exist.
 */
export function updateUserDisplayName(userId: string, displayName: string): UserRecord {
  const trimmedDisplayName = displayName.trim()

  if (!trimmedDisplayName) {
    throw new Error('Display name must not be empty')
  }

  return withDbErrorLogging('users', 'updateDisplayName', () => {
    const db = getDatabase()

    const result = db
      .prepare(
        `
      UPDATE users
      SET display_name = ?, updated_at = datetime('now')
      WHERE id = ?
    `
      )
      .run(trimmedDisplayName, userId) as { changes: number }

    if (result.changes === 0) {
      throw new Error('User not found')
    }

    const user = getUserById(userId)

    if (!user) {
      throw new Error('User not found')
    }

    return user
  })
}
