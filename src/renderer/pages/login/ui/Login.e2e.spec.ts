import { expect, test } from '@shared/tests/e2e/fixtures'

test.describe('Login', { tag: '@regression' }, () => {
  test('renders login form on login route', { tag: ['@smoke', '@critical'] }, async ({ page }) => {
    await page.goto('/#/login')

    await expect(page).toHaveURL(/#\/login$/)
    await expect(page.locator('form')).toHaveCount(1)
  })
})
