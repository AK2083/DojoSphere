import { contextBridge, ipcRenderer } from 'electron'

import type { ElectronAPI } from '@shared/types/electron-api'

const api: ElectronAPI = {
  getUsers: () => ipcRenderer.invoke('users:list'),
  addUser: (user) => ipcRenderer.invoke('users:add', user),
  dbHealthcheck: () => ipcRenderer.invoke('db:healthcheck')
}

contextBridge.exposeInMainWorld('api', api)
