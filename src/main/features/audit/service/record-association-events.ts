import { insertAuditLog } from '../repository/audit.repository'

const ASSOCIATION_FIELD_NAMES = [
  'name',
  'short_name',
  'city',
  'website',
  'is_active',
  'district',
  'identifiers',
  'addresses',
  'contacts'
] as const

/**
 * Records an audit entry when an association is created.
 *
 * @param input - Actor and association identifiers without PII in JSON payloads.
 * @param input.actorUserId
 * @param input.associationId
 */
export function recordAssociationCreated(input: { actorUserId: string; associationId: string }) {
  insertAuditLog({
    actorUserId: input.actorUserId,
    action: 'created',
    entityType: 'association',
    entityId: input.associationId,
    newValueJson: JSON.stringify({ fields: [...ASSOCIATION_FIELD_NAMES] })
  })
}

/**
 * Records an audit entry when an association is updated.
 *
 * @param input - Actor, association identifiers, and changed field names only (no PII values).
 * @param input.actorUserId
 * @param input.associationId
 * @param input.changedFields
 */
export function recordAssociationUpdated(input: {
  actorUserId: string
  associationId: string
  changedFields: string[]
}) {
  insertAuditLog({
    actorUserId: input.actorUserId,
    action: 'updated',
    entityType: 'association',
    entityId: input.associationId,
    newValueJson: JSON.stringify({ changed_fields: input.changedFields })
  })
}

/**
 * Records an audit entry when an association is deleted.
 *
 * @param input - Actor and association identifiers.
 * @param input.actorUserId
 * @param input.associationId
 */
export function recordAssociationDeleted(input: { actorUserId: string; associationId: string }) {
  insertAuditLog({
    actorUserId: input.actorUserId,
    action: 'deleted',
    entityType: 'association',
    entityId: input.associationId
  })
}
