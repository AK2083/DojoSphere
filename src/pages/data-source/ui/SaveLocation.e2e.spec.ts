import { expect, test } from '@playwright/test'

test.describe('data-source page', () => {
  test('root route redirects to datasource', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveURL(/#\/datasource$/)
  })
})
