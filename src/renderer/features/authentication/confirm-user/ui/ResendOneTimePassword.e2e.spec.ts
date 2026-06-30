import { expect, test } from '@shared/tests/e2e/fixtures'
import { gotoHashRoute } from '@shared/tests/e2e/navigation'
import { setupPendingEmailVerification } from '@shared/tests/e2e/setup-email-verification'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('ResendOneTimePassword (confirm-user)', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
    await setupPendingEmailVerification(page)
  })

  test('renders resend action on confirmation page', async ({ page }) => {
    await gotoHashRoute(page, '/#/emailverification', '.v-otp-input')

    const resendButton = page.getByRole('button', {
      name: 'Send me a new confirmation code',
      exact: true
    })

    await expect(resendButton).toBeVisible()
    await expect(resendButton).toBeEnabled()
  })
})
