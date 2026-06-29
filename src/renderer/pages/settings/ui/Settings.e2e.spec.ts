import { expect, test } from '@shared/tests/e2e/fixtures'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('settings page', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('renders settings sections', async ({ page }) => {
    await page.goto('/#/settings')

    await expect(page).toHaveURL(/#\/settings$/)
    await expect(page.getByRole('heading', { name: 'Settings', exact: true })).toBeVisible()
    await expect(
      page.locator('label.font-weight-medium').getByText('Username', { exact: true })
    ).toBeVisible()
    await expect(
      page.locator('label.font-weight-medium').getByText('Send diagnostic data on errors', {
        exact: true
      })
    ).toBeVisible()
    await expect(
      page.locator('label.font-weight-medium').getByText('Language', { exact: true })
    ).toBeVisible()
    await expect(page.getByLabel('Dark Mode', { exact: true })).toBeVisible()
  })
})
