import { randomUUID } from 'node:crypto'

import { describe, expect, it } from 'vitest'

import { createMemoryDatabase } from '../../test/database'

import { runMigrations } from './runner'

function migratedDb() {
  const db = createMemoryDatabase()
  runMigrations(db)
  return db
}

describe('integrity triggers', () => {
  it('rejects competitors linked to inactive clubs on insert', () => {
    const db = migratedDb()
    const inactiveClubId = randomUUID()

    db.prepare(
      `
      INSERT INTO clubs (id, district_id, name, is_active, source)
      VALUES (?, 'd1000000-0000-4000-8000-000000000004', 'Inactive Club', 0, 'test')
    `
    ).run(inactiveClubId)

    expect(() =>
      db
        .prepare(
          `
        INSERT INTO competitors (
          id, given_name, family_name, gender, birth_date, club_id, nationality,
          weight_class_id, age_class_id, pass_number
        )
        VALUES (?, 'Ada', 'Lovelace', 'f', '2000-01-01', ?, 'de', ?, ?, '123')
      `
        )
        .run(
          randomUUID(),
          inactiveClubId,
          'b3000000-0000-4000-8000-000000000001',
          'c2000000-0000-4000-8000-000000000003'
        )
    ).toThrow(/club is not active/i)
  })

  it('rejects non-normalized competitor nationality on insert', () => {
    const db = migratedDb()

    expect(() =>
      db
        .prepare(
          `
        INSERT INTO competitors (
          id, given_name, family_name, gender, birth_date, club_id, nationality,
          weight_class_id, age_class_id, pass_number
        )
        VALUES (?, 'Ada', 'Lovelace', 'f', '2000-01-01', ?, ' de ', ?, ?, '123')
      `
        )
        .run(
          randomUUID(),
          '00000000-0000-0000-0000-000000000000',
          'b3000000-0000-4000-8000-000000000001',
          'c2000000-0000-4000-8000-000000000003'
        )
    ).toThrow(/nationality must be uppercase/i)
  })

  it('rejects mismatched weight_class_id and age_class_id', () => {
    const db = migratedDb()

    expect(() =>
      db
        .prepare(
          `
        INSERT INTO competitors (
          id, given_name, family_name, gender, birth_date, club_id, nationality,
          weight_class_id, age_class_id, pass_number
        )
        VALUES (?, 'Ada', 'Lovelace', 'f', '2000-01-01', ?, 'DE', ?, ?, '123')
      `
        )
        .run(
          randomUUID(),
          '00000000-0000-0000-0000-000000000000',
          'b3000000-0000-4000-8000-000000000001',
          'c2000000-0000-4000-8000-000000000004'
        )
    ).toThrow(/weight_class_id does not match age_class_id/i)
  })

  it('prevents deleting system roles and seed clubs', () => {
    const db = migratedDb()

    expect(() => db.prepare(`DELETE FROM roles WHERE name = 'list_keeper'`).run()).toThrow(
      /system role cannot be deleted/i
    )

    expect(() =>
      db.prepare(`DELETE FROM clubs WHERE id = '00000000-0000-0000-0000-000000000000'`).run()
    ).toThrow(/seed club cannot be deleted/i)
  })

  it('prevents mutating reference tables and audit logs', () => {
    const db = migratedDb()
    const actorUserId = randomUUID()

    db.prepare(
      `
      INSERT INTO users (id, display_name, user_type)
      VALUES (?, 'Auditor', 'system')
    `
    ).run(actorUserId)

    db.prepare(
      `
      INSERT INTO authorization_audit_logs (id, actor_user_id, action, entity_type, entity_id)
      VALUES (?, ?, 'created', 'competitor', 'competitor-1')
    `
    ).run(randomUUID(), actorUserId)

    expect(() =>
      db.prepare(`UPDATE age_classes SET label_key = 'changed' WHERE djb_row = 1`).run()
    ).toThrow(/reference data is read-only/i)

    expect(() =>
      db
        .prepare(
          `UPDATE authorization_audit_logs SET action = 'deleted' WHERE entity_id = 'competitor-1'`
        )
        .run()
    ).toThrow(/audit logs are immutable/i)
  })

  it('enforces access request status rules and timestamps', () => {
    const db = migratedDb()
    const requestId = randomUUID()
    const directorId = randomUUID()
    const approvedUserId = randomUUID()
    const roleId = db.prepare(`SELECT id FROM roles WHERE name = 'score_judge'`).get() as {
      id: string
    }

    db.prepare(
      `
      INSERT INTO users (id, display_name, user_type)
      VALUES (?, 'Director', 'system'), (?, 'Judge', 'device')
    `
    ).run(directorId, approvedUserId)

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
      UPDATE access_requests
      SET status = 'approved', approved_by_user_id = ?, approved_user_id = ?
      WHERE id = ?
    `
    ).run(directorId, approvedUserId, requestId)

    const approved = db
      .prepare(`SELECT status, approved_at AS approvedAt FROM access_requests WHERE id = ?`)
      .get(requestId) as { status: string; approvedAt: string | null }

    expect(approved.status).toBe('approved')
    expect(approved.approvedAt).toEqual(expect.any(String))

    expect(() =>
      db.prepare(`UPDATE access_requests SET status = 'pending' WHERE id = ?`).run(requestId)
    ).toThrow(/access request status is final/i)
  })

  it('treats revocation timestamps as final', () => {
    const db = migratedDb()
    const userId = randomUUID()
    const sessionId = randomUUID()

    db.prepare(
      `
      INSERT INTO users (id, display_name, user_type)
      VALUES (?, 'Session User', 'local')
    `
    ).run(userId)

    db.prepare(
      `
      INSERT INTO sessions (id, user_id, token_hash, expires_at, revoked_at)
      VALUES (?, ?, 'hash', datetime('now', '+1 day'), datetime('now'))
    `
    ).run(sessionId, userId)

    expect(() =>
      db.prepare(`UPDATE sessions SET revoked_at = NULL WHERE id = ?`).run(sessionId)
    ).toThrow(/session revocation is final/i)
  })
})
