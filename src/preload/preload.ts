import { contextBridge, ipcRenderer } from 'electron'

import type { ElectronAPI } from '@shared/types/electron-api'

const api: ElectronAPI = {
  getUsers: () => ipcRenderer.invoke('users:list'),
  addUser: (user) => ipcRenderer.invoke('users:add', user),
  ensureLocalSession: (displayName) => ipcRenderer.invoke('users:ensureLocalSession', displayName),
  getLocalSession: (token) => ipcRenderer.invoke('sessions:get', token),
  revokeLocalSession: (token) => ipcRenderer.invoke('sessions:revoke', token),
  updateUserDisplayName: (token, displayName) =>
    ipcRenderer.invoke('users:updateDisplayName', { token, displayName }),
  dbHealthcheck: () => ipcRenderer.invoke('db:healthcheck'),
  checkGrafanaCloudReachability: () => ipcRenderer.invoke('telemetry:checkGrafanaReachability'),
  setTelemetryUploadPreferences: (preferences) =>
    ipcRenderer.invoke('telemetry:setUploadPreferences', preferences),
  uploadTelemetryOnError: () => ipcRenderer.invoke('telemetry:uploadOnError'),
  auditRecord: (input) => ipcRenderer.invoke('audit:record', input),
  getCompetitors: (token) => ipcRenderer.invoke('competitors:list', token),
  addCompetitor: (token, input) => ipcRenderer.invoke('competitors:add', { token, ...input }),
  updateCompetitor: (token, id, input) =>
    ipcRenderer.invoke('competitors:update', { token, id, ...input }),
  deleteCompetitor: (token, id) => ipcRenderer.invoke('competitors:delete', { token, id }),
  getOsUsername: () => ipcRenderer.invoke('system:osUsername')
}

contextBridge.exposeInMainWorld('api', api)
