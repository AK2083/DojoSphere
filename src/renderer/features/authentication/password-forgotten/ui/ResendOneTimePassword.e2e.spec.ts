import { expect, test } from '@shared/tests/e2e/fixtures'
import { goToPasswordResetOtpStep, mockRecoveryRequest } from '@shared/tests/e2e/password-recovery'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('ResendOneTimePassword (password-forgotten)', () => {
  test.describe.configure({ timeout: 60_000 })

  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
    await mockRecoveryRequest(page)
  })

  test('shows resend action on otp step', async ({ page }) => {
    await goToPasswordResetOtpStep(page)

    const resendButton = page.getByRole('button', {
      name: 'Send me a new confirmation code',
      exact: true
    })

    await expect(resendButton).toBeVisible()
    await expect(resendButton).toBeEnabled()
  })
})
