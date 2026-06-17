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
  getOtpInputs,
  OTP_INPUTS_SELECTOR,
  typeOtp,
  waitForOtpInputs,
  waitForPasswordResetOtpStep
} from './otp-input'

function createOtpPageDouble() {
  const fill = vi.fn().mockResolvedValue(undefined)
  const click = vi.fn().mockResolvedValue(undefined)
  const keyboardType = vi.fn().mockResolvedValue(undefined)
  const fieldLocator = { fill, click }

  const page = {
    locator: vi.fn().mockImplementation((selector: string) => {
      if (selector === OTP_INPUTS_SELECTOR) {
        return {
          first: vi.fn().mockReturnValue(fieldLocator)
        }
      }

      if (selector === '#otpTitle') {
        return {
          filter: vi.fn().mockReturnValue(fieldLocator)
        }
      }

      return {
        first: vi.fn().mockReturnValue(fieldLocator)
      }
    }),
    keyboard: {
      type: keyboardType
    }
  }

  return { page, fill, click, keyboardType }
}

describe('otp-input e2e helpers', () => {
  it('returns a locator for otp input fields', () => {
    const { page } = createOtpPageDouble()

    getOtpInputs(page as never)

    expect(page.locator).toHaveBeenCalledWith(OTP_INPUTS_SELECTOR)
  })

  it('waits for six otp input fields', async () => {
    const { page } = createOtpPageDouble()

    await waitForOtpInputs(page as never)

    expect(playwrightExpect).toHaveBeenCalled()
  })

  it('waits for password reset otp step', async () => {
    const { page } = createOtpPageDouble()

    await waitForPasswordResetOtpStep(page as never)

    expect(page.locator).toHaveBeenCalledWith('#otpTitle')
    expect(playwrightExpect).toHaveBeenCalled()
  })

  it('fills a six-character token', async () => {
    const { page, fill, click, keyboardType } = createOtpPageDouble()

    await typeOtp(page as never, '123456')

    expect(fill).toHaveBeenCalledWith('123456')
    expect(click).not.toHaveBeenCalled()
    expect(keyboardType).not.toHaveBeenCalled()
  })

  it('types a token via keyboard when length is not six', async () => {
    const { page, fill, click, keyboardType } = createOtpPageDouble()

    await typeOtp(page as never, '12345')

    expect(click).toHaveBeenCalled()
    expect(keyboardType).toHaveBeenCalledWith('12345')
    expect(fill).not.toHaveBeenCalled()
  })
})
