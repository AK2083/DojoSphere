import { beforeEach, describe, expect, it } from 'vitest'

import { installPlaywrightBrowserElectronApi, isPlaywrightBrowserOnly } from './e2e-api'

describe('isPlaywrightBrowserOnly', () => {
  it('returns true for enabled values', () => {
    expect(isPlaywrightBrowserOnly('true')).toBe(true)
    expect(isPlaywrightBrowserOnly('1')).toBe(true)
  })

  it('returns false when unset or disabled', () => {
    expect(isPlaywrightBrowserOnly(undefined)).toBe(false)
    expect(isPlaywrightBrowserOnly('false')).toBe(false)
    expect(isPlaywrightBrowserOnly('')).toBe(false)
  })
})

describe('installPlaywrightBrowserElectronApi', () => {
  beforeEach(() => {
    sessionStorage.clear()
    installPlaywrightBrowserElectronApi()
  })

  it('persists competitors without sensitive fields and rehydrates them after reload', async () => {
    const { sessionToken } = await globalThis.window.api.ensureLocalSession('TestUser')

    await globalThis.window.api.addCompetitor(sessionToken, {
      givenName: 'Yuki',
      familyName: 'Tanaka',
      gender: 'm',
      birthDate: '2011-04-12',
      nationality: 'DE',
      passNumber: 'JP-000142',
      club: 'Dojo Nord',
      weightClass: '-60'
    })

    const stored = sessionStorage.getItem('dojosphere.e2e.competitors')

    expect(stored).not.toBeNull()
    expect(stored).not.toContain('2011-04-12')
    expect(stored).not.toContain('JP-000142')

    installPlaywrightBrowserElectronApi()

    const competitors = await globalThis.window.api.getCompetitors(sessionToken)

    expect(competitors).toEqual([
      expect.objectContaining({
        givenName: 'Yuki',
        familyName: 'Tanaka',
        gender: 'm',
        birthDate: '2011-04-12',
        nationality: 'DE',
        passNumber: 'JP-000142'
      })
    ])
  })

  it('bootstraps and resolves a local session', async () => {
    const result = await globalThis.window.api.ensureLocalSession('TestUser')

    expect(result.sessionToken).toBe('local-session-token')

    const session = await globalThis.window.api.getLocalSession(result.sessionToken)

    expect(session?.user.displayName).toBe('TestUser')
  })

  it('updates the display name for the active local session', async () => {
    const { sessionToken } = await globalThis.window.api.ensureLocalSession('TestUser')

    const updatedUser = await globalThis.window.api.updateUserDisplayName(
      sessionToken,
      'Updated User'
    )

    expect(updatedUser.displayName).toBe('Updated User')

    const session = await globalThis.window.api.getLocalSession(sessionToken)

    expect(session?.user.displayName).toBe('Updated User')
  })

  it('rejects display name updates without a valid session token', async () => {
    await expect(
      globalThis.window.api.updateUserDisplayName('missing-token', 'Updated User')
    ).rejects.toThrow('Unauthorized')
  })

  it('rejects empty display name updates', async () => {
    const { sessionToken } = await globalThis.window.api.ensureLocalSession('TestUser')

    await expect(globalThis.window.api.updateUserDisplayName(sessionToken, '   ')).rejects.toThrow(
      'Display name must not be empty'
    )
  })

  it('returns null for unknown local sessions', async () => {
    await expect(globalThis.window.api.getLocalSession('missing-token')).resolves.toBeNull()
  })
})
