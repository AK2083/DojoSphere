import { expect, test } from '@shared/tests/e2e/fixtures'
import { gotoHashRoute } from '@shared/tests/e2e/navigation'
import { waitForOtpInputs } from '@shared/tests/e2e/otp-input'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('email verification page', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('email verification route renders confirmation flow', async ({ page }) => {
    await gotoHashRoute(page, '/#/emailverification', '.v-otp-input')

    await expect(page).toHaveURL(/#\/emailverification$/)
    await waitForOtpInputs(page)
    await expect(page.locator('button[type="submit"]').first()).toBeDisabled()
  })
})
