import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ElectronAPI } from '@shared/types/electron-api'

import { contextBridge, getExposedApi, ipcRenderer } from '../main/test/electron-mock'

describe('preload', () => {
  beforeEach(async () => {
    vi.resetModules()
    await import('./preload')
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

    ipcRenderer.invoke.mockResolvedValueOnce(undefined)
    await api.recordError({
      service: 'auth',
      action: 'login',
      message: 'Invalid credentials',
      code: 'auth.invalid_credentials'
    })
    expect(ipcRenderer.invoke).toHaveBeenCalledWith('logging:recordError', {
      service: 'auth',
      action: 'login',
      message: 'Invalid credentials',
      code: 'auth.invalid_credentials'
    })

    ipcRenderer.invoke.mockResolvedValueOnce(undefined)
    await api.setDiagnosticsUploadPreferences({ autoUploadDiagnostics: true })
    expect(ipcRenderer.invoke).toHaveBeenCalledWith('diagnostics:setUploadPreferences', {
      autoUploadDiagnostics: true
    })

    ipcRenderer.invoke.mockResolvedValueOnce(undefined)
    await api.auditRecord({
      token: 'token-1',
      action: 'approved',
      entityType: 'access_request',
      entityId: 'request-1'
    })
    expect(ipcRenderer.invoke).toHaveBeenCalledWith('audit:record', {
      token: 'token-1',
      action: 'approved',
      entityType: 'access_request',
      entityId: 'request-1'
    })

    ipcRenderer.invoke.mockResolvedValueOnce('adrian')
    await api.getOsUsername()
    expect(ipcRenderer.invoke).toHaveBeenCalledWith('system:osUsername')

    ipcRenderer.invoke.mockResolvedValueOnce({
      id: 'user-1',
      sessionToken: 'token-1',
      expiresAt: '2099-01-01T00:00:00.000Z'
    })
    await api.ensureLocalSession('Test User')
    expect(ipcRenderer.invoke).toHaveBeenCalledWith('users:ensureLocalSession', 'Test User')

    ipcRenderer.invoke.mockResolvedValueOnce({
      id: 'user-1',
      displayName: 'Updated User',
      email: null,
      userType: 'local',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-02T00:00:00.000Z'
    })
    await api.updateUserDisplayName('token-1', 'Updated User')
    expect(ipcRenderer.invoke).toHaveBeenCalledWith('users:updateDisplayName', {
      token: 'token-1',
      displayName: 'Updated User'
    })

    ipcRenderer.invoke.mockResolvedValueOnce([])
    await api.getCompetitors('token-1')
    expect(ipcRenderer.invoke).toHaveBeenCalledWith('competitors:list', 'token-1')

    ipcRenderer.invoke.mockResolvedValueOnce({
      id: 'competitor-1',
      givenName: 'Yuki',
      familyName: 'Tanaka',
      club: null,
      weightClass: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: null
    })
    await api.addCompetitor('token-1', { givenName: 'Yuki', familyName: 'Tanaka' })
    expect(ipcRenderer.invoke).toHaveBeenCalledWith('competitors:add', {
      token: 'token-1',
      givenName: 'Yuki',
      familyName: 'Tanaka'
    })

    ipcRenderer.invoke.mockResolvedValueOnce({
      id: 'competitor-1',
      givenName: 'Yuki',
      familyName: 'Tanaka',
      club: 'Osaka Dojo',
      weightClass: '-60',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-02T00:00:00.000Z'
    })
    await api.updateCompetitor('token-1', 'competitor-1', { club: 'Osaka Dojo' })
    expect(ipcRenderer.invoke).toHaveBeenCalledWith('competitors:update', {
      token: 'token-1',
      id: 'competitor-1',
      club: 'Osaka Dojo'
    })

    ipcRenderer.invoke.mockResolvedValueOnce(undefined)
    await api.deleteCompetitor('token-1', 'competitor-1')
    expect(ipcRenderer.invoke).toHaveBeenCalledWith('competitors:delete', {
      token: 'token-1',
      id: 'competitor-1'
    })

    ipcRenderer.invoke.mockResolvedValueOnce(true)
    await api.hasPermission('token-1', 'participants-overview', 'read')
    expect(ipcRenderer.invoke).toHaveBeenCalledWith('authorization:hasPermission', {
      token: 'token-1',
      resource: 'participants-overview',
      action: 'read'
    })
  })
})
