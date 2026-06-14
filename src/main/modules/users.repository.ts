import { randomUUID } from 'node:crypto'

import { getDatabase } from '../database/connection'
import { LIST_KEEPER_ROLE_ID } from '../database/seeded-roles'
import { runInTransaction } from '../database/transactions'
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
      insertRoleAssignment.run(randomUUID(), id, LIST_KEEPER_ROLE_ID, id)
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
