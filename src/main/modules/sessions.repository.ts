import { createHash, randomBytes, randomUUID } from 'node:crypto'

import { getDatabase } from '../database/connection'

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000

export type LocalSessionRecord = {
  id: string
  userId: string
  expiresAt: string
  createdAt: string
  user: {
    id: string
    displayName: string
    email: string | null
    userType: 'local' | 'device' | 'system'
    createdAt: string
    updatedAt: string | null
  }
}

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

function createToken() {
  return randomBytes(32).toString('base64url')
}

export function createSession(userId: string) {
  const db = getDatabase()
  const id = randomUUID()
  const token = createToken()
  const tokenHash = hashToken(token)
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString()

  db.prepare(
    `
    INSERT INTO sessions (id, user_id, token_hash, expires_at)
    VALUES (?, ?, ?, ?)
  `
  ).run(id, userId, tokenHash, expiresAt)

  return { id, token, expiresAt }
}

export function getActiveSessionByToken(token: string): LocalSessionRecord | null {
  const db = getDatabase()
  const tokenHash = hashToken(token)

  const row = db
    .prepare(
      `
      SELECT
        s.id,
        s.user_id AS userId,
        s.expires_at AS expiresAt,
        s.created_at AS createdAt,
        u.id AS user_id,
        u.display_name AS displayName,
        u.email,
        u.user_type AS userType,
        u.created_at AS userCreatedAt,
        u.updated_at AS userUpdatedAt
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = ?
        AND s.revoked_at IS NULL
        AND s.expires_at > datetime('now')
    `
    )
    .get(tokenHash) as
    | {
        id: string
        userId: string
        expiresAt: string
        createdAt: string
        user_id: string
        displayName: string
        email: string | null
        userType: 'local' | 'device' | 'system'
        userCreatedAt: string
        userUpdatedAt: string | null
      }
    | undefined

  if (!row) {
    return null
  }

  db.prepare(`UPDATE sessions SET last_seen_at = datetime('now') WHERE id = ?`).run(row.id)

  return {
    id: row.id,
    userId: row.userId,
    expiresAt: row.expiresAt,
    createdAt: row.createdAt,
    user: {
      id: row.user_id,
      displayName: row.displayName,
      email: row.email,
      userType: row.userType,
      createdAt: row.userCreatedAt,
      updatedAt: row.userUpdatedAt
    }
  }
}

export function revokeSessionByToken(token: string) {
  const db = getDatabase()
  const tokenHash = hashToken(token)

  db.prepare(
    `
    UPDATE sessions
    SET revoked_at = datetime('now')
    WHERE token_hash = ?
      AND revoked_at IS NULL
  `
  ).run(tokenHash)
}
