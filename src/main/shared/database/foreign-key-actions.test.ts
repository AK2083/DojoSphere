import { randomUUID } from 'node:crypto'

import { describe, expect, it } from 'vitest'

import { createMemoryDatabase } from '../../test/database'

import { runMigrations } from './runner'

function migratedDb() {
  const db = createMemoryDatabase()
  runMigrations(db)
  return db
}

describe('foreign key ON DELETE actions', () => {
  it('nulls optional user references when a user is deleted', () => {
    const db = migratedDb()
    const actorUserId = randomUUID()
    const subjectUserId = randomUUID()
    const roleId = db.prepare(`SELECT id FROM roles WHERE name = 'list_keeper'`).get() as {
      id: string
    }
    const assignmentId = randomUUID()

    db.prepare(
      `
      INSERT INTO users (id, display_name, user_type)
      VALUES (?, 'Actor', 'system'), (?, 'Subject', 'local')
    `
    ).run(actorUserId, subjectUserId)

    db.prepare(
      `
      INSERT INTO user_role_assignments (
        id, user_id, role_id, scope_type, created_by_user_id, revoked_by_user_id
      )
      VALUES (?, ?, ?, 'global', ?, ?)
    `
    ).run(assignmentId, subjectUserId, roleId.id, actorUserId, actorUserId)

    db.prepare(`DELETE FROM users WHERE id = ?`).run(actorUserId)

    const assignment = db
      .prepare(
        `
      SELECT created_by_user_id AS createdBy, revoked_by_user_id AS revokedBy
      FROM user_role_assignments
      WHERE id = ?
    `
      )
      .get(assignmentId) as { createdBy: string | null; revokedBy: string | null }

    expect(assignment.createdBy).toBeNull()
    expect(assignment.revokedBy).toBeNull()
  })

  it('blocks deleting users referenced by audit logs', () => {
    const db = migratedDb()
    const actorUserId = randomUUID()
    const auditId = randomUUID()

    db.prepare(
      `
      INSERT INTO users (id, display_name, user_type)
      VALUES (?, 'Actor', 'system')
    `
    ).run(actorUserId)

    db.prepare(
      `
      INSERT INTO authorization_audit_logs (id, actor_user_id, action, entity_type, entity_id)
      VALUES (?, ?, 'created', 'competitor', 'competitor-1')
    `
    ).run(auditId, actorUserId)

    expect(() => db.prepare(`DELETE FROM users WHERE id = ?`).run(actorUserId)).toThrow(
      /FOREIGN KEY constraint failed/i
    )
  })

  it('nulls session access_request_id when the access request is deleted', () => {
    const db = migratedDb()
    const userId = randomUUID()
    const requestId = randomUUID()
    const sessionId = randomUUID()
    const roleId = db.prepare(`SELECT id FROM roles WHERE name = 'score_judge'`).get() as {
      id: string
    }

    db.prepare(
      `
      INSERT INTO users (id, display_name, user_type)
      VALUES (?, 'Judge', 'device')
    `
    ).run(userId)

    db.prepare(
      `
      INSERT INTO access_requests (
        id,
        requested_display_name,
        requested_role_id,
        request_token_hash,
        expires_at
      )
      VALUES (?, 'Mat 1', ?, ?, datetime('now', '+1 day'))
    `
    ).run(requestId, roleId.id, 'token-hash')

    db.prepare(
      `
      INSERT INTO sessions (id, user_id, token_hash, expires_at, access_request_id)
      VALUES (?, ?, 'hash', datetime('now', '+1 day'), ?)
    `
    ).run(sessionId, userId, requestId)

    db.prepare(`DELETE FROM access_requests WHERE id = ?`).run(requestId)

    const session = db
      .prepare(`SELECT access_request_id AS accessRequestId FROM sessions WHERE id = ?`)
      .get(sessionId) as { accessRequestId: string | null }

    expect(session.accessRequestId).toBeNull()
  })

  it('blocks deleting a grading system while grades exist', () => {
    const db = migratedDb()

    expect(() =>
      db
        .prepare(`DELETE FROM grading_systems WHERE id = 'f1000000-0000-4000-8000-000000000001'`)
        .run()
    ).toThrow(/reference data cannot be deleted/i)
  })
})
