import { expect, test } from '@playwright/test'
import {
  goToPasswordResetOtpStep,
  mockRecoveryRequest,
  waitForPasswordResetOtpStep
} from '@shared/tests/e2e/password-recovery'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('OtpStep', () => {
  test.describe.configure({ timeout: 60_000 })

  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
    await mockRecoveryRequest(page)
  })

  test('renders otp fields after successful email step', async ({ page }) => {
    await goToPasswordResetOtpStep(page)

    await waitForPasswordResetOtpStep(page)
    await expect(
      page.locator('#otpTitle').filter({ hasText: /verification code for user@example.com/i })
    ).toBeVisible()
  })
})
