import { expect, test } from '@playwright/test'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('Confirmation', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('renders otp input and disabled submit action', async ({ page }) => {
    await page.goto('/#/emailverification')

    const otpInputs = page.getByRole('textbox', { name: /Please enter OTP character/i })
    if ((await otpInputs.count()) === 0) {
      await page.reload()
      await expect(page).toHaveURL(/#\/emailverification$/)
    }

    await expect(otpInputs).toHaveCount(6, { timeout: 10_000 })
    await expect(page.locator('button[type="submit"]').first()).toBeDisabled()
  })
})
