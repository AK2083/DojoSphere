import { contextBridge, ipcRenderer } from 'electron'

import type { ElectronAPI } from '@shared/types/electron-api'

const api: ElectronAPI = {
  getUsers: () => ipcRenderer.invoke('users:list'),
  addUser: (user) => ipcRenderer.invoke('users:add', user),
  getLocalSession: (token) => ipcRenderer.invoke('sessions:get', token),
  revokeLocalSession: (token) => ipcRenderer.invoke('sessions:revoke', token),
  dbHealthcheck: () => ipcRenderer.invoke('db:healthcheck'),
  getOsUsername: () => ipcRenderer.invoke('system:osUsername')
}

contextBridge.exposeInMainWorld('api', api)
