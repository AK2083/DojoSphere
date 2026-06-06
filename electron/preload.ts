import { contextBridge, ipcRenderer } from 'electron'

import type { ElectronAPI } from '@shared/types/electron-api'

const api: ElectronAPI = {
  getUsers: () => ipcRenderer.invoke('get-users'),
  addUser: (user) => ipcRenderer.invoke('add-user', user),
  dbHealthcheck: () => ipcRenderer.invoke('db-healthcheck')
}

contextBridge.exposeInMainWorld('api', api)
