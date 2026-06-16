import { expect, test } from '@playwright/test'
import { waitForOtpInputs } from '@shared/tests/e2e/otp-input'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('Confirmation', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('renders otp input and disabled submit action', async ({ page }) => {
    await page.goto('/#/emailverification')

    const emailVerificationUrl = /#\/emailverification$/
    if (!emailVerificationUrl.test(page.url())) {
      await page.reload()
      await expect(page).toHaveURL(emailVerificationUrl)
    }

    await waitForOtpInputs(page)
    await expect(page.locator('button[type="submit"]').first()).toBeDisabled()
  })
})
