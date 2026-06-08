import { randomUUID } from 'node:crypto'

import { getDatabase } from '../database/connection'

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

  const insert = db.prepare(`
    INSERT INTO users (id, display_name, email, user_type)
    VALUES (?, ?, ?, ?)
  `)

  return insert.run(id, user.displayName, user.email ?? null, user.userType ?? 'local')
}
