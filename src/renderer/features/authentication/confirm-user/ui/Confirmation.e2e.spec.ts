import { expect, test } from '@playwright/test'
import { gotoHashRoute } from '@shared/tests/e2e/navigation'
import { waitForOtpInputs } from '@shared/tests/e2e/otp-input'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('Confirmation', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('renders otp input and disabled submit action', async ({ page }) => {
    await gotoHashRoute(page, '/#/emailverification', '.v-otp-input')

    await waitForOtpInputs(page)
    await expect(page.locator('button[type="submit"]').first()).toBeDisabled()
  })
})
