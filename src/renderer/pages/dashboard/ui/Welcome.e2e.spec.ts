import { expect, test } from '@shared/tests/e2e/fixtures'

test.describe('dashboard page', () => {
  test('bootstraps local auth on app start and shows dashboard', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveURL(/#\/$/)
    await expect(page.getByText('Hallo')).toBeVisible()
  })

  test('redirects legacy dashboard route to root', async ({ page }) => {
    await page.goto('/#/dashboard')

    await expect(page).toHaveURL(/#\/$/)
    await expect(page.getByText('Hallo')).toBeVisible()
  })
})
