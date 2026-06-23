import { describe, expect, it, vi } from 'vitest'

const { playwrightExpect } = vi.hoisted(() => ({
  playwrightExpect: vi.fn(() => ({
    toBeVisible: vi.fn().mockResolvedValue(undefined),
    toBeEnabled: vi.fn().mockResolvedValue(undefined),
    toHaveCount: vi.fn().mockResolvedValue(undefined)
  }))
}))

vi.mock('@playwright/test', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@playwright/test')>()
  return {
    ...actual,
    expect: playwrightExpect
  }
})

import {
  goToPasswordResetNewPasswordStep,
  goToPasswordResetOtpStep,
  mockRecoveryFlowRequests,
  mockRecoveryRequest,
  mockRecoveryVerify
} from './password-recovery'

function createPageDouble(options: { emailInputCount?: number } = {}) {
  const fill = vi.fn().mockResolvedValue(undefined)
  const click = vi.fn().mockResolvedValue(undefined)
  const route = vi.fn().mockResolvedValue(undefined)
  const goto = vi.fn().mockResolvedValue(undefined)
  const reload = vi.fn().mockResolvedValue(undefined)
  const keyboardType = vi.fn().mockResolvedValue(undefined)
  const count = vi.fn().mockResolvedValue(options.emailInputCount ?? 1)
  let waitForResponseCall = 0
  const waitForResponse = vi
    .fn()
    .mockImplementation(
      async (predicate: (response: { url: () => string; ok: () => boolean }) => boolean) => {
        waitForResponseCall += 1
        const url =
          waitForResponseCall === 1
            ? 'https://example.com/auth/v1/recover'
            : 'https://example.com/auth/v1/verify'
        const response = { url: () => url, ok: () => true }
        predicate(response)
        return response
      }
    )

  const fieldLocator = {
    fill,
    click
  }

  const emailLocator = {
    count,
    first: vi.fn().mockReturnValue(fieldLocator)
  }

  const page = {
    route,
    goto,
    reload,
    waitForResponse,
    keyboard: {
      type: keyboardType
    },
    locator: vi.fn().mockImplementation((selector: string) => {
      if (selector === 'input[autocomplete="email"]') {
        return emailLocator
      }

      if (selector === '#otpTitle') {
        return {
          filter: vi.fn().mockReturnValue(fieldLocator)
        }
      }

      if (selector === '.v-otp-input input:visible') {
        return {
          first: vi.fn().mockReturnValue(fieldLocator)
        }
      }

      return {
        first: vi.fn().mockReturnValue(fieldLocator)
      }
    }),
    getByRole: vi.fn().mockReturnValue({
      click
    })
  }

  return { page, route, goto, reload, fill, click, keyboardType, count, waitForResponse }
}

describe('password-recovery e2e helpers', () => {
  it('mocks recovery request endpoint and fulfills success response', async () => {
    const { page, route } = createPageDouble()

    await mockRecoveryRequest(page as never)

    expect(route).toHaveBeenCalledTimes(1)
    const [matcher, handler] = route.mock.calls[0]
    expect(matcher).toBe('**/auth/v1/recover**')

    const fulfill = vi.fn().mockResolvedValue(undefined)
    await handler({ fulfill })

    expect(fulfill).toHaveBeenCalledWith({
      status: 200,
      contentType: 'application/json',
      body: '{}'
    })
  })

  it('mocks recovery verify endpoint and fulfills success response', async () => {
    const { page, route } = createPageDouble()

    await mockRecoveryVerify(page as never)

    expect(route).toHaveBeenCalledTimes(1)
    const [matcher, handler] = route.mock.calls[0]
    expect(matcher).toBe('**/auth/v1/verify**')

    const fulfill = vi.fn().mockResolvedValue(undefined)
    await handler({ fulfill })

    expect(fulfill).toHaveBeenCalledWith({
      status: 200,
      contentType: 'application/json',
      body: '{}'
    })
  })

  it('registers heartbeat, request and verify endpoint mocks', async () => {
    const { page, route } = createPageDouble()

    await mockRecoveryFlowRequests(page as never)

    expect(route).toHaveBeenNthCalledWith(1, '**/functions/v1/heartbeat', expect.any(Function))
    expect(route).toHaveBeenNthCalledWith(2, '**/auth/v1/recover**', expect.any(Function))
    expect(route).toHaveBeenNthCalledWith(3, '**/auth/v1/verify**', expect.any(Function))
  })

  it('navigates to otp step with default email', async () => {
    const { page, goto, fill, click, waitForResponse } = createPageDouble()

    await goToPasswordResetOtpStep(page as never)

    expect(goto).toHaveBeenCalledWith('/#/passwordreset')
    expect(fill).toHaveBeenCalledWith('user@example.com')
    expect(click).toHaveBeenCalledTimes(1)
    expect(waitForResponse).toHaveBeenCalledTimes(1)
  })

  it('navigates to otp step with custom email', async () => {
    const { page, fill } = createPageDouble()

    await goToPasswordResetOtpStep(page as never, 'custom@example.com')

    expect(fill).toHaveBeenCalledWith('custom@example.com')
  })

  it('reloads once when email input is initially missing', async () => {
    const { page, goto, reload } = createPageDouble({ emailInputCount: 0 })

    await goToPasswordResetOtpStep(page as never)

    expect(reload).toHaveBeenCalledTimes(1)
    expect(goto).toHaveBeenCalledTimes(2)
    expect(goto).toHaveBeenNthCalledWith(1, '/#/passwordreset')
    expect(goto).toHaveBeenNthCalledWith(2, '/#/passwordreset')
  })

  it('navigates from otp to new-password step with defaults', async () => {
    const { page, fill, click, waitForResponse } = createPageDouble()

    await goToPasswordResetNewPasswordStep(page as never)

    expect(fill).toHaveBeenCalledWith('123456')
    expect(click).toHaveBeenCalledTimes(2)
    expect(waitForResponse).toHaveBeenCalledTimes(2)
  })

  it('navigates from otp to new-password step with custom token', async () => {
    const { page, fill } = createPageDouble()

    await goToPasswordResetNewPasswordStep(page as never, 'custom@example.com', '654321')

    expect(fill).toHaveBeenCalledWith('654321')
  })
})
