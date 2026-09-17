import { ipcMain } from 'electron'

import { userHasPermission } from '@main/features/authorization'
import { getActiveSessionByToken } from '@main/features/sessions'
import { requireActiveSession, requirePermission } from '@main/shared/security'

const ASSOCIATIONS_OVERVIEW_RESOURCE = 'associations-overview'

import {
  addAssociation,
  type CreateAssociationInput,
  deleteAssociation,
  getAssociation,
  getAssociations,
  type UpdateAssociationInput,
  updateAssociation
} from '../repository/associations.repository'
import {
  applySyncBatch,
  getSyncTimestamps,
  type AssociationSyncPayload
} from '../sync/sync-associations.service'

type AddAssociationIpcInput = CreateAssociationInput & { token: string }
type UpdateAssociationIpcInput = UpdateAssociationInput & { token: string; id: string }

/**
 * Registers IPC handlers for association lifecycle management.
 */
export function registerAssociationsIpc() {
  ipcMain.handle('associations:list', (_event, token: string) => {
    const session = requireActiveSession(token, getActiveSessionByToken)

    requirePermission(session.userId, ASSOCIATIONS_OVERVIEW_RESOURCE, 'read', userHasPermission)

    return getAssociations()
  })

  ipcMain.handle('associations:get', (_event, input: { token: string; id: string }) => {
    const session = requireActiveSession(input.token, getActiveSessionByToken)

    requirePermission(session.userId, ASSOCIATIONS_OVERVIEW_RESOURCE, 'read', userHasPermission)

    const association = getAssociation(input.id)

    if (!association) {
      throw new Error('Association not found')
    }

    return association
  })

  ipcMain.handle('associations:add', (_event, input: AddAssociationIpcInput) => {
    const session = requireActiveSession(input.token, getActiveSessionByToken)
    const { token, ...association } = input

    void token

    requirePermission(session.userId, ASSOCIATIONS_OVERVIEW_RESOURCE, 'create', userHasPermission)

    return addAssociation(session.userId, association)
  })

  ipcMain.handle('associations:update', (_event, input: UpdateAssociationIpcInput) => {
    const session = requireActiveSession(input.token, getActiveSessionByToken)
    const { token, id, ...association } = input

    void token

    requirePermission(session.userId, ASSOCIATIONS_OVERVIEW_RESOURCE, 'update', userHasPermission)

    return updateAssociation(session.userId, id, association)
  })

  ipcMain.handle('associations:delete', (_event, input: { token: string; id: string }) => {
    const session = requireActiveSession(input.token, getActiveSessionByToken)

    requirePermission(session.userId, ASSOCIATIONS_OVERVIEW_RESOURCE, 'delete', userHasPermission)

    deleteAssociation(session.userId, input.id)
  })

  /**
   * Returns the latest synced_at timestamp for each association hierarchy table.
   * The renderer uses these to build incremental Supabase queries (only fetch rows
   * whose updated_at is newer than the local synced_at).
   */
  ipcMain.handle('associations:getSyncTimestamps', (_event, token: string) => {
    requireActiveSession(token, getActiveSessionByToken)

    return getSyncTimestamps()
  })

  /**
   * Accepts the sync payload from the renderer (records fetched from Supabase),
   * upserts them into SQLite, and streams per-association progress events back
   * via associations:sync:progress.
   */
  ipcMain.handle(
    'associations:applySync',
    (event, input: { token: string; payload: AssociationSyncPayload }) => {
      requireActiveSession(input.token, getActiveSessionByToken)

      applySyncBatch(input.payload, event.sender)
    }
  )
}
