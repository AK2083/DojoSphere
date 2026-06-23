import { insertAuditLog } from '../repository/audit.repository'

const COMPETITOR_FIELD_NAMES = ['given_name', 'family_name', 'club', 'weight_class'] as const

/**
 * Records an audit entry when a competitor is created.
 *
 * @param input - Actor and competitor identifiers without PII in JSON payloads.
 * @param input.actorUserId
 * @param input.competitorId
 */
export function recordCompetitorCreated(input: { actorUserId: string; competitorId: string }) {
  insertAuditLog({
    actorUserId: input.actorUserId,
    action: 'created',
    entityType: 'competitor',
    entityId: input.competitorId,
    newValueJson: JSON.stringify({ fields: [...COMPETITOR_FIELD_NAMES] })
  })
}

/**
 * Records an audit entry when a competitor is updated.
 *
 * @param input - Actor, competitor identifiers, and changed field names only (no PII values).
 * @param input.actorUserId
 * @param input.competitorId
 * @param input.changedFields
 */
export function recordCompetitorUpdated(input: {
  actorUserId: string
  competitorId: string
  changedFields: string[]
}) {
  insertAuditLog({
    actorUserId: input.actorUserId,
    action: 'updated',
    entityType: 'competitor',
    entityId: input.competitorId,
    newValueJson: JSON.stringify({ changed_fields: input.changedFields })
  })
}

/**
 * Records an audit entry when a competitor is deleted.
 *
 * @param input - Actor and competitor identifiers.
 * @param input.actorUserId
 * @param input.competitorId
 */
export function recordCompetitorDeleted(input: { actorUserId: string; competitorId: string }) {
  insertAuditLog({
    actorUserId: input.actorUserId,
    action: 'deleted',
    entityType: 'competitor',
    entityId: input.competitorId
  })
}
