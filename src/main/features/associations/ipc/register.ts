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
}
