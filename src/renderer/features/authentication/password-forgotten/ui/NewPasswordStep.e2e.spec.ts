import { expect, test } from '@shared/tests/e2e/fixtures'
import {
  goToPasswordResetNewPasswordStep,
  mockRecoveryFlowRequests
} from '@shared/tests/e2e/password-recovery'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('NewPasswordStep', { tag: '@regression' }, () => {
  test.describe.configure({ timeout: 60_000 })

  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
    await mockRecoveryFlowRequests(page)
  })

  test(
    'renders new-password fields after successful otp step',
    { tag: '@critical' },
    async ({ page }) => {
      await goToPasswordResetNewPasswordStep(page)

      await expect(page.locator('input[aria-label="New password"]')).toHaveCount(1)
      await expect(page.locator('input[aria-label="Repeat password"]')).toHaveCount(1)
    }
  )
})
