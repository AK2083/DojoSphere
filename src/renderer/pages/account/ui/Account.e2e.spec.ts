import { expect, test } from '@shared/tests/e2e/fixtures'

test.describe('account page', () => {
  test('bootstraps local auth and renders account page', async ({ page }) => {
    await page.goto('/#/account')

    await expect(page).toHaveURL(/#\/account$/)
    await expect(page.getByText('Hallo')).toBeVisible()
  })
})
