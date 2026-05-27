import { expect, test } from '@playwright/test'
import { goToPasswordResetOtpStep, mockRecoveryRequest } from '@shared/tests/e2e/password-recovery'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('OtpStep', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
    await mockRecoveryRequest(page)
  })

  test('renders otp fields after successful email step', async ({ page }) => {
    await goToPasswordResetOtpStep(page)

    const otpInputs = page.getByRole('textbox', { name: /Please enter OTP character/i })
    if ((await otpInputs.count()) === 0) {
      await page.reload()
      await goToPasswordResetOtpStep(page)
    }

    await expect(otpInputs).toHaveCount(6, { timeout: 10_000 })
    await expect(page.locator('#otpTitle').last()).toHaveText(
      'Enter verification code for user@example.com'
    )
  })
})
