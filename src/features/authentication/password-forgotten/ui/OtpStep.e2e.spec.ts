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

    await expect(page.locator('.v-otp-input input:visible')).toHaveCount(6)
    await expect(page.locator('#otpTitle').last()).toHaveText(
      'Enter verification code for user@example.com'
    )
  })
})
