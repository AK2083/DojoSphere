import { describe, expect, it, vi } from 'vitest'

import { setupPendingEmailVerification } from './setup-email-verification'

describe('setup-email-verification e2e helpers', () => {
  it('seeds pending email verification state before navigation', async () => {
    const addInitScript = vi.fn().mockResolvedValue(undefined)
    const page = { addInitScript }

    await setupPendingEmailVerification(page as never)

    expect(addInitScript).toHaveBeenCalledTimes(1)
    expect(addInitScript).toHaveBeenCalledWith(expect.any(Function), [
      'dojosphere.auth.register.otpActive',
      'dojosphere.auth.register.email',
      'e2e@example.com'
    ])
  })

  it('uses a custom email when provided', async () => {
    const addInitScript = vi.fn().mockResolvedValue(undefined)
    const page = { addInitScript }

    await setupPendingEmailVerification(page as never, 'custom@example.com')

    expect(addInitScript).toHaveBeenCalledWith(expect.any(Function), [
      'dojosphere.auth.register.otpActive',
      'dojosphere.auth.register.email',
      'custom@example.com'
    ])
  })

  it('writes pending verification keys into local storage', async () => {
    const setItem = vi.fn()
    const addInitScript = vi.fn().mockResolvedValue(undefined)
    const page = { addInitScript }

    await setupPendingEmailVerification(page as never, 'custom@example.com')

    const initCallback = addInitScript.mock.calls[0]?.[0] as (
      keys: [string, string, string]
    ) => void

    Object.defineProperty(globalThis, 'localStorage', {
      value: { setItem },
      configurable: true
    })

    initCallback([
      'dojosphere.auth.register.otpActive',
      'dojosphere.auth.register.email',
      'custom@example.com'
    ])

    expect(setItem).toHaveBeenCalledWith('dojosphere.auth.register.otpActive', JSON.stringify(true))
    expect(setItem).toHaveBeenCalledWith(
      'dojosphere.auth.register.email',
      JSON.stringify('custom@example.com')
    )
  })
})
