import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'

import type {
  AssociationSyncProgressEvent,
  ElectronAPI,
  ImportProgressEvent
} from '@shared/types/electron-api'

const api: ElectronAPI = {
  getUsers: () => ipcRenderer.invoke('users:list'),
  addUser: (user) => ipcRenderer.invoke('users:add', user),
  ensureLocalSession: (displayName) => ipcRenderer.invoke('users:ensureLocalSession', displayName),
  getLocalSession: (token) => ipcRenderer.invoke('sessions:get', token),
  revokeLocalSession: (token) => ipcRenderer.invoke('sessions:revoke', token),
  updateUserDisplayName: (token, displayName) =>
    ipcRenderer.invoke('users:updateDisplayName', { token, displayName }),
  dbHealthcheck: () => ipcRenderer.invoke('db:healthcheck'),
  recordError: (input) => ipcRenderer.invoke('logging:recordError', input),
  setDiagnosticsUploadPreferences: (preferences) =>
    ipcRenderer.invoke('diagnostics:setUploadPreferences', preferences),
  auditRecord: (input) => ipcRenderer.invoke('audit:record', input),
  getCompetitors: (token) => ipcRenderer.invoke('competitors:list', token),
  getCompetitor: (token, id) => ipcRenderer.invoke('competitors:get', { token, id }),
  addCompetitor: (token, input) => ipcRenderer.invoke('competitors:add', { token, ...input }),
  updateCompetitor: (token, id, input) =>
    ipcRenderer.invoke('competitors:update', { token, id, ...input }),
  deleteCompetitor: (token, id) => ipcRenderer.invoke('competitors:delete', { token, id }),
  importParticipantsPreview: (token, buffer) =>
    ipcRenderer.invoke('competitors:import:preview', { token, buffer }),
  importParticipantsExecute: (token, buffer, mapping) =>
    ipcRenderer.invoke('competitors:import:execute', { token, buffer, mapping }),
  onImportParticipantsProgress: (listener) => {
    const handler = (_event: IpcRendererEvent, progress: ImportProgressEvent) => listener(progress)

    ipcRenderer.on('competitors:import:progress', handler)

    return () => {
      ipcRenderer.removeListener('competitors:import:progress', handler)
    }
  },
  getAssociations: (token) => ipcRenderer.invoke('associations:list', token),
  getAssociation: (token, id) => ipcRenderer.invoke('associations:get', { token, id }),
  addAssociation: (token, input) => ipcRenderer.invoke('associations:add', { token, ...input }),
  updateAssociation: (token, id, input) =>
    ipcRenderer.invoke('associations:update', { token, id, ...input }),
  deleteAssociation: (token, id) => ipcRenderer.invoke('associations:delete', { token, id }),
  getSyncTimestamps: (token) => ipcRenderer.invoke('associations:getSyncTimestamps', token),
  applySync: (token, payload) => ipcRenderer.invoke('associations:applySync', { token, payload }),
  onSyncProgress: (listener) => {
    const handler = (_event: IpcRendererEvent, progress: AssociationSyncProgressEvent) =>
      listener(progress)

    ipcRenderer.on('associations:sync:progress', handler)

    return () => {
      ipcRenderer.removeListener('associations:sync:progress', handler)
    }
  },
  hasPermission: (token, resource, action) =>
    ipcRenderer.invoke('authorization:hasPermission', { token, resource, action }),
  getOsUsername: () => ipcRenderer.invoke('system:osUsername')
}

contextBridge.exposeInMainWorld('api', api)
