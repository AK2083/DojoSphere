import { expect, type Page, test } from '@playwright/test'

const OTP_ROUTE = '/#/emailverification'
const OTP_INPUTS_SELECTOR = '.v-otp-input input:visible'

async function enteredOtp(page: Page): Promise<string> {
  const values = await page
    .locator(OTP_INPUTS_SELECTOR)
    .evaluateAll((inputs) =>
      inputs.map((input) => ('value' in input ? String(input.value ?? '') : '')).join('')
    )

  return values
}

async function typeOtp(page: Page, token: string): Promise<void> {
  const firstOtpField = page.locator(OTP_INPUTS_SELECTOR).first()
  await firstOtpField.click()
  await page.keyboard.type(token)
}

test.describe('shared/ui OtpInput', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(OTP_ROUTE)
    await expect(page.locator(OTP_INPUTS_SELECTOR)).toHaveCount(6)
  })

  test('renders six otp fields and keeps submit disabled on load', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]').first()

    await expect(submitButton).toBeDisabled()
    await expect(page.locator(OTP_INPUTS_SELECTOR)).toHaveCount(6)
  })

  test('enables submit only after entering six digits', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]').first()
    const otpInputs = page.locator(OTP_INPUTS_SELECTOR)

    await typeOtp(page, '12345')
    await expect(submitButton).toBeDisabled()

    await otpInputs.nth(5).fill('6')
    await expect(submitButton).toBeEnabled()
  })

  test('supports paste-like full code input in first field', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]').first()
    const firstOtpField = page.locator(OTP_INPUTS_SELECTOR).first()

    await firstOtpField.fill('654321')

    await expect(submitButton).toBeEnabled()
    await expect.poll(async () => enteredOtp(page)).toBe('654321')
  })

  test('accepts numeric input and ignores non-digit characters', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]').first()

    await typeOtp(page, 'ab12cd34')

    await expect(submitButton).toBeDisabled()
    await expect.poll(async () => enteredOtp(page)).toBe('1234')
  })
})
