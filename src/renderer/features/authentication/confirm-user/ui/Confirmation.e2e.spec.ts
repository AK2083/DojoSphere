import { expect, test } from '@shared/tests/e2e/fixtures'
import { gotoHashRoute } from '@shared/tests/e2e/navigation'
import { waitForOtpInputs } from '@shared/tests/e2e/otp-input'
import { setupPendingEmailVerification } from '@shared/tests/e2e/setup-email-verification'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('Confirmation', { tag: '@regression' }, () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
    await setupPendingEmailVerification(page)
  })

  test(
    'renders otp input and disabled submit action',
    { tag: ['@smoke', '@critical'] },
    async ({ page }) => {
      await gotoHashRoute(page, '/#/emailverification', '.v-otp-input')

      await waitForOtpInputs(page)
      await expect(page.locator('button[type="submit"]').first()).toBeDisabled()
    }
  )
})
