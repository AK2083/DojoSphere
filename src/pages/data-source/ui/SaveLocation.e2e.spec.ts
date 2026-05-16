import { expect, test } from '@playwright/test'

test.describe('data-source page', () => {
  test('root route redirects to datasource', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveURL(/#\/datasource$/)
    await expect(page.locator('form')).toHaveCount(1)
    await expect(page.locator('input[autocomplete="email"]')).toHaveCount(1)
    await expect(page.locator('input[autocomplete="new-password"]')).toHaveCount(1)
  })

  test('shows registration and local work actions', async ({ page }) => {
    await page.goto('/#/datasource')

    await expect(page.locator('button[type="submit"]')).toHaveCount(1)
    await expect(page.locator('.v-card button')).toHaveCount(2)
    await expect(page.locator('a[href$="#/login"]').first()).toBeVisible()
  })
})
