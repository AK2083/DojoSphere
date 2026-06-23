import { afterEach, describe, expect, it, vi } from 'vitest'

import { auditRecord } from './audit'

describe('auditRecord', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('forwards audit events to window.api with the session token', async () => {
    const auditRecordApi = vi.fn().mockResolvedValue(undefined)

    vi.stubGlobal('window', {
      api: {
        auditRecord: auditRecordApi
      }
    })

    await auditRecord('token-1', {
      action: 'approved',
      entityType: 'access_request',
      entityId: 'request-1'
    })

    expect(auditRecordApi).toHaveBeenCalledWith({
      token: 'token-1',
      action: 'approved',
      entityType: 'access_request',
      entityId: 'request-1'
    })
  })

  it('no-ops when window.api is unavailable', async () => {
    vi.stubGlobal('window', {})

    await expect(
      auditRecord('token-1', {
        action: 'approved',
        entityType: 'access_request'
      })
    ).resolves.toBeUndefined()
  })
})
