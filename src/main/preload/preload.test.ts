import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ElectronAPI } from '@shared/types/electron-api'

import { contextBridge, getExposedApi, ipcRenderer } from '../test/electron-mock'

describe('preload', () => {
  beforeEach(async () => {
    vi.resetModules()
    await import('../preload/preload')
  })

  it('exposes the electron api on window', () => {
    expect(contextBridge.exposeInMainWorld).toHaveBeenCalledWith('api', expect.any(Object))
  })

  it('invokes the main process ipc channels', async () => {
    const api = getExposedApi() as unknown as ElectronAPI

    ipcRenderer.invoke.mockResolvedValueOnce([])
    await api.getUsers()
    expect(ipcRenderer.invoke).toHaveBeenCalledWith('users:list')

    ipcRenderer.invoke.mockResolvedValueOnce({ id: 'user-1', sessionToken: 'token-1' })
    await api.addUser({ displayName: 'Test User' })
    expect(ipcRenderer.invoke).toHaveBeenCalledWith('users:add', { displayName: 'Test User' })

    ipcRenderer.invoke.mockResolvedValueOnce(null)
    await api.getLocalSession('token-1')
    expect(ipcRenderer.invoke).toHaveBeenCalledWith('sessions:get', 'token-1')

    ipcRenderer.invoke.mockResolvedValueOnce(undefined)
    await api.revokeLocalSession('token-1')
    expect(ipcRenderer.invoke).toHaveBeenCalledWith('sessions:revoke', 'token-1')

    ipcRenderer.invoke.mockResolvedValueOnce({ ok: true, version: '3.45.0' })
    await api.dbHealthcheck()
    expect(ipcRenderer.invoke).toHaveBeenCalledWith('db:healthcheck')

    ipcRenderer.invoke.mockResolvedValueOnce('adrian')
    await api.getOsUsername()
    expect(ipcRenderer.invoke).toHaveBeenCalledWith('system:osUsername')
  })
})
