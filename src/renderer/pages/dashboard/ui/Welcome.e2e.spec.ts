import { expect, test } from '@shared/tests/e2e/fixtures'

test.describe('dashboard page', { tag: '@regression' }, () => {
  test(
    'bootstraps local auth on app start and shows dashboard',
    { tag: ['@smoke', '@critical'] },
    async ({ page }) => {
      await page.goto('/')

      await expect(page).toHaveURL(/#\/$/)
      await expect(page.getByText('Hallo')).toBeVisible()
    }
  )

  test('redirects legacy dashboard route to root', { tag: '@smoke' }, async ({ page }) => {
    await page.goto('/#/dashboard')

    await expect(page).toHaveURL(/#\/$/)
    await expect(page.getByText('Hallo')).toBeVisible()
  })
})
