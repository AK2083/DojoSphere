import { isActivityLoggingEnabled } from '@shared/lib/telemetry/activity-logging-scope'
import type { AuditEventPayload } from '@shared/types/electron-api'

/**
 * Records an audit event via the main-process IPC pipeline.
 *
 * Requires an active session token; writes are performed in main after session validation.
 *
 * @param token - Raw session token of the acting user.
 * @param event - Audit fields mapped to `authorization_audit_logs` columns.
 */
export async function auditRecord(token: string, event: AuditEventPayload): Promise<void> {
  if (!isActivityLoggingEnabled() || !globalThis.window.api?.auditRecord) {
    return
  }

  await globalThis.window.api.auditRecord({ token, ...event })
}
