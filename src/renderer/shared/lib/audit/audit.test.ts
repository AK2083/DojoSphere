import { afterEach, describe, expect, it, vi } from 'vitest'

const isActivityLoggingEnabled = vi.hoisted(() => vi.fn(() => true))

vi.mock('@shared/lib/logging/activity-logging-scope', () => ({
  isActivityLoggingEnabled
}))

import { auditRecord } from './audit'

describe('auditRecord', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    isActivityLoggingEnabled.mockReturnValue(true)
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

  it('no-ops on audience routes when activity logging is disabled', async () => {
    isActivityLoggingEnabled.mockReturnValue(false)

    const auditRecordApi = vi.fn().mockResolvedValue(undefined)

    vi.stubGlobal('window', {
      api: {
        auditRecord: auditRecordApi
      }
    })

    await auditRecord('token-1', {
      action: 'created',
      entityType: 'competitor',
      entityId: 'competitor-1'
    })

    expect(auditRecordApi).not.toHaveBeenCalled()
  })
})
