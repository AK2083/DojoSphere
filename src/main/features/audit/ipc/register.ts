import { ipcMain } from 'electron'

import { getActiveSessionByToken } from '@main/features/sessions'
import { requireActiveSession } from '@main/shared/security'
import type { AuditRecordInput } from '@shared/types/electron-api'

import { insertAuditLog } from '../repository/audit.repository'

function assertAuditField(value: string, fieldName: string) {
  if (!value.trim()) {
    throw new Error(`${fieldName} must not be empty`)
  }
}

/**
 * Registers IPC handlers for audit event recording.
 */
export function registerAuditIpc() {
  ipcMain.handle('audit:record', (_event, input: AuditRecordInput) => {
    assertAuditField(input.action, 'action')
    assertAuditField(input.entityType, 'entityType')

    const session = requireActiveSession(input.token, getActiveSessionByToken)

    insertAuditLog({
      actorUserId: session.userId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      oldValueJson: input.oldValueJson ?? null,
      newValueJson: input.newValueJson ?? null
    })
  })
}
