import { vi } from 'vitest'

type IpcHandler = (...args: unknown[]) => unknown

const ipcHandlers = new Map<string, IpcHandler>()
let exposedApi: Record<string, unknown> | undefined
let browserWindowMock: BrowserWindowMock | undefined

export type BrowserWindowMock = {
  loadURL: ReturnType<typeof vi.fn>
  loadFile: ReturnType<typeof vi.fn>
  webContents: {
    on: ReturnType<typeof vi.fn>
    openDevTools: ReturnType<typeof vi.fn>
  }
}

export const BrowserWindowConstructor = vi.fn(function BrowserWindow(this: BrowserWindowMock) {
  browserWindowMock = {
    loadURL: vi.fn().mockResolvedValue(undefined),
    loadFile: vi.fn().mockResolvedValue(undefined),
    webContents: {
      on: vi.fn(),
      openDevTools: vi.fn()
    }
  }

  return browserWindowMock
})

export const ipcMain = {
  handle: vi.fn((channel: string, handler: IpcHandler) => {
    ipcHandlers.set(channel, handler)
  })
}

export const ipcRenderer = {
  invoke: vi.fn()
}

export const contextBridge = {
  exposeInMainWorld: vi.fn((_key: string, api: Record<string, unknown>) => {
    exposedApi = api
  })
}

export const app = {
  whenReady: vi.fn().mockResolvedValue(undefined),
  quit: vi.fn(),
  on: vi.fn(),
  getPath: vi.fn(() => '/tmp/dojosphere-test'),
  getVersion: vi.fn(() => '1.0.0-test'),
  isPackaged: false
}

export const Menu = {
  setApplicationMenu: vi.fn()
}

export function createBrowserWindowMock() {
  return browserWindowMock
}

export function getIpcHandler(channel: string) {
  const handler = ipcHandlers.get(channel)

  if (!handler) {
    throw new Error(`IPC handler for channel "${channel}" was not registered.`)
  }

  return handler
}

export function getExposedApi<T extends Record<string, unknown> = Record<string, unknown>>() {
  if (!exposedApi) {
    throw new Error('No API was exposed via contextBridge.')
  }

  return exposedApi as T
}

export function resetElectronMocks() {
  ipcHandlers.clear()
  exposedApi = undefined
  browserWindowMock = undefined
  BrowserWindowConstructor.mockClear()
  ipcMain.handle.mockClear()
  ipcRenderer.invoke.mockClear()
  contextBridge.exposeInMainWorld.mockClear()
  Menu.setApplicationMenu.mockClear()
  app.whenReady.mockClear()
  app.quit.mockClear()
  app.on.mockClear()
  app.getPath.mockClear()
  app.getPath.mockReturnValue('/tmp/dojosphere-test')
  app.getVersion.mockClear()
  app.getVersion.mockReturnValue('1.0.0-test')
  app.isPackaged = false
}
