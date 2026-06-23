import { insertAuditLog } from '../repository/audit.repository'

/**
 * Records an audit entry when an active session is revoked.
 *
 * @param session - Revoked session identifier and owning user.
 * @param session.id
 * @param session.userId
 */
export function recordSessionRevoked(session: { id: string; userId: string }) {
  insertAuditLog({
    actorUserId: session.userId,
    action: 'revoked',
    entityType: 'session',
    entityId: session.id
  })
}

/**
 * Records an audit entry when a role is assigned to a user.
 *
 * @param input - Role assignment identifiers without PII in JSON payloads.
 * @param input.actorUserId
 * @param input.roleId
 * @param input.userId
 * @param input.assignmentId
 * @param input.scopeType
 */
export function recordRoleAssigned(input: {
  actorUserId: string
  roleId: string
  userId: string
  assignmentId: string
  scopeType: string
}) {
  insertAuditLog({
    actorUserId: input.actorUserId,
    action: 'assigned',
    entityType: 'role',
    entityId: input.roleId,
    newValueJson: JSON.stringify({
      user_id: input.userId,
      assignment_id: input.assignmentId,
      scope_type: input.scopeType
    })
  })
}
