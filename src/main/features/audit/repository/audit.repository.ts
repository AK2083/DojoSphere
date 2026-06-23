import { randomUUID } from 'node:crypto'

import { getDatabase } from '@main/shared/database'

/** Fields persisted to `authorization_audit_logs`. */
export type AuditLogInsert = {
  actorUserId: string | null
  action: string
  entityType: string
  entityId?: string | null
  oldValueJson?: string | null
  newValueJson?: string | null
  ipAddress?: string | null
  userAgent?: string | null
}

/**
 * Inserts a row into `authorization_audit_logs`.
 *
 * @param record - Audit event fields mapped to table columns.
 * @returns The generated audit log identifier.
 */
export function insertAuditLog(record: AuditLogInsert): string {
  const db = getDatabase()
  const id = randomUUID()

  db.prepare(
    `
    INSERT INTO authorization_audit_logs (
      id,
      actor_user_id,
      action,
      entity_type,
      entity_id,
      old_value_json,
      new_value_json,
      ip_address,
      user_agent
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
  ).run(
    id,
    record.actorUserId,
    record.action,
    record.entityType,
    record.entityId ?? null,
    record.oldValueJson ?? null,
    record.newValueJson ?? null,
    record.ipAddress ?? null,
    record.userAgent ?? null
  )

  return id
}
