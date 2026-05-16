import { describe, expect, it, vi } from 'vitest'

import {
  goToPasswordResetNewPasswordStep,
  goToPasswordResetOtpStep,
  mockRecoveryFlowRequests,
  mockRecoveryRequest,
  mockRecoveryVerify
} from './password-recovery'

function createPageDouble() {
  const fill = vi.fn().mockResolvedValue(undefined)
  const click = vi.fn().mockResolvedValue(undefined)
  const route = vi.fn().mockResolvedValue(undefined)
  const goto = vi.fn().mockResolvedValue(undefined)
  const keyboardType = vi.fn().mockResolvedValue(undefined)

  const page = {
    route,
    goto,
    keyboard: {
      type: keyboardType
    },
    locator: vi.fn().mockReturnValue({
      first: vi.fn().mockReturnValue({
        fill,
        click
      })
    }),
    getByRole: vi.fn().mockReturnValue({
      click
    })
  }

  return { page, route, goto, fill, click, keyboardType }
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

  it('registers both request and verify endpoint mocks', async () => {
    const { page, route } = createPageDouble()

    await mockRecoveryFlowRequests(page as never)

    expect(route).toHaveBeenNthCalledWith(1, '**/auth/v1/recover**', expect.any(Function))
    expect(route).toHaveBeenNthCalledWith(2, '**/auth/v1/verify**', expect.any(Function))
  })

  it('navigates to otp step with default email', async () => {
    const { page, goto, fill, click } = createPageDouble()

    await goToPasswordResetOtpStep(page as never)

    expect(goto).toHaveBeenCalledWith('/#/passwordreset')
    expect(fill).toHaveBeenCalledWith('user@example.com')
    expect(click).toHaveBeenCalledTimes(1)
  })

  it('navigates to otp step with custom email', async () => {
    const { page, fill } = createPageDouble()

    await goToPasswordResetOtpStep(page as never, 'custom@example.com')

    expect(fill).toHaveBeenCalledWith('custom@example.com')
  })

  it('navigates from otp to new-password step with defaults', async () => {
    const { page, click, keyboardType } = createPageDouble()

    await goToPasswordResetNewPasswordStep(page as never)

    expect(keyboardType).toHaveBeenCalledWith('123456')
    expect(click).toHaveBeenCalledTimes(3)
  })

  it('navigates from otp to new-password step with custom token', async () => {
    const { page, keyboardType } = createPageDouble()

    await goToPasswordResetNewPasswordStep(page as never, 'custom@example.com', '654321')

    expect(keyboardType).toHaveBeenCalledWith('654321')
  })
})
