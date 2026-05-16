import { expect, test } from '@playwright/test'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('EmailStep', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('enables next action after entering a valid email', async ({ page }) => {
    await page.goto('/#/passwordreset')

    const nextButton = page.getByRole('button', { name: 'Continue', exact: true })
    await expect(nextButton).toBeDisabled()

    const emailInput = page.locator('input[autocomplete="email"]').first()
    await emailInput.fill('user@example.com')

    await expect(nextButton).toBeEnabled()
  })
})
