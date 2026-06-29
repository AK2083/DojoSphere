import { expect, test } from '@shared/tests/e2e/fixtures'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('password reset page', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('password reset route renders stepper card', async ({ page }) => {
    await page.goto('/#/passwordreset')

    await expect(page).toHaveURL(/#\/passwordreset$/)
    await expect(page.getByText('Reset password', { exact: true })).toBeVisible()
    await expect(page.locator('.v-stepper')).toBeVisible()
    await expect(page.locator('.v-stepper-header .v-stepper-item')).toHaveCount(3)
  })
})
