import { expect, type Page, test } from '@playwright/test'
import { gotoHashRoute } from '@shared/tests/e2e/navigation'
import { getOtpInputs, typeOtp } from '@shared/tests/e2e/otp-input'

async function enteredOtp(page: Page): Promise<string> {
  const values = await getOtpInputs(page).evaluateAll((inputs) =>
    inputs.map((input) => ('value' in input ? String(input.value ?? '') : '')).join('')
  )

  return values
}

test.describe('shared/ui OtpInput', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHashRoute(page, '/#/emailverification', '.v-otp-input')
    await expect(getOtpInputs(page)).toHaveCount(6)
  })

  test('renders six otp fields and keeps submit disabled on load', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]').first()

    await expect(submitButton).toBeDisabled()
  })

  test('enables submit only after entering six digits', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]').first()
    const otpInputs = getOtpInputs(page)

    await typeOtp(page, '12345')
    await expect(submitButton).toBeDisabled()

    await otpInputs.nth(5).fill('6')
    await expect(submitButton).toBeEnabled()
  })

  test('supports paste-like full code input in first field', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]').first()
    const firstOtpField = getOtpInputs(page).first()

    await firstOtpField.fill('654321')

    await expect(submitButton).toBeEnabled()
    expect(await enteredOtp(page)).toBe('654321')
  })

  test('accepts numeric input and ignores non-digit characters', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]').first()

    await typeOtp(page, 'ab12cd34')

    await expect(submitButton).toBeDisabled()
    expect(await enteredOtp(page)).toBe('1234')
  })
})
