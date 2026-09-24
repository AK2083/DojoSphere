import { expect, test } from '@shared/tests/e2e/fixtures'
import { gotoHashRoute } from '@shared/tests/e2e/navigation'
import { waitForOtpInputs } from '@shared/tests/e2e/otp-input'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('EMailConfirmation', { tag: '@regression' }, () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test(
    'renders OTP confirmation form with disabled submit',
    { tag: ['@smoke', '@critical'] },
    async ({ page }) => {
      await gotoHashRoute(page, '/#/emailverification', '.v-otp-input')

      await expect(page).toHaveURL(/#\/emailverification$/)
      await waitForOtpInputs(page)
      await expect(page.locator('button[type="submit"]').first()).toBeDisabled()
    }
  )
})
