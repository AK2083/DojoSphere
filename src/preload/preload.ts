import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'

import type { ElectronAPI, ImportProgressEvent } from '@shared/types/electron-api'

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
  hasPermission: (token, resource, action) =>
    ipcRenderer.invoke('authorization:hasPermission', { token, resource, action }),
  getOsUsername: () => ipcRenderer.invoke('system:osUsername')
}

contextBridge.exposeInMainWorld('api', api)
