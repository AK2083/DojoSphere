import { expect, test } from '@playwright/test'

test.describe('Navigation widget', () => {
  test('shows the settings action', async ({ page }) => {
    await page.goto('/')

    const settingsLink = page.getByRole('link', { name: 'Settings' }).first()
    await expect(settingsLink).toBeVisible()
    await expect(settingsLink).toHaveAttribute('href', /#\/settings$/)
  })
})
