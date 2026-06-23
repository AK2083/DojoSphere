import { expect, test } from '@shared/tests/e2e/fixtures'
import { gotoHashRoute } from '@shared/tests/e2e/navigation'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('EmailStep', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('enables next action after entering a valid email', async ({ page }) => {
    await gotoHashRoute(page, '/#/passwordreset', 'input[autocomplete="email"]')

    const emailInputs = page.locator('input[autocomplete="email"]')
    const nextButton = page.getByRole('button', { name: /^(Continue|Weiter)$/ })
    await expect(nextButton).toBeDisabled()

    const emailInput = emailInputs.first()
    await emailInput.fill('user@example.com')

    await expect(nextButton).toBeEnabled()
  })
})
