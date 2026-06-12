import { afterEach, vi } from 'vitest'

import {
  app,
  BrowserWindowConstructor,
  contextBridge,
  ipcMain,
  ipcRenderer,
  Menu,
  resetElectronMocks
} from './electron-mock'

vi.mock('electron', () => ({
  app,
  BrowserWindow: BrowserWindowConstructor,
  contextBridge,
  ipcMain,
  ipcRenderer,
  Menu
}))

afterEach(() => {
  resetElectronMocks()
})
