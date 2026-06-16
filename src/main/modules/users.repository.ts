import { randomUUID } from 'node:crypto'

import { getDatabase, runInTransaction } from '@main/shared/database'
import { findRoleIdByName } from './roles.repository'
import { createSession } from './sessions.repository'

export type CreateUserInput = {
  displayName: string
  email?: string | null
  userType?: 'local' | 'device' | 'system'
}

export type UserRecord = {
  id: string
  displayName: string
  email: string | null
  userType: 'local' | 'device' | 'system'
  createdAt: string
  updatedAt: string | null
}

export function getUsers(): UserRecord[] {
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
}

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

  runInTransaction(db, () => {
    insertUser.run(id, user.displayName, user.email ?? null, userType)

    if (userType === 'local') {
      insertRoleAssignment.run(randomUUID(), id, findRoleIdByName('list_keeper'), id)
    }
  })

  return { id }
}

export function findLocalUserByDisplayName(displayName: string): UserRecord | null {
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
}

export function ensureLocalUserSession(displayName: string) {
  const existingUser = findLocalUserByDisplayName(displayName)
  const userId = existingUser?.id ?? addUser({ displayName, userType: 'local' }).id
  const session = createSession(userId)

  return {
    id: userId,
    sessionToken: session.token,
    expiresAt: session.expiresAt
  }
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

export function updateUserDisplayName(userId: string, displayName: string): UserRecord {
  const trimmedDisplayName = displayName.trim()

  if (!trimmedDisplayName) {
    throw new Error('Display name must not be empty')
  }

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
}
