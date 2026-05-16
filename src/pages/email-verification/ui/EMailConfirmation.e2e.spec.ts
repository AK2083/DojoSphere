import { expect, test } from '@playwright/test'

test.describe('email-verification page', () => {
  test('renders otp input and submit button', async ({ page }) => {
    await page.goto('/#/emailverification')

    await expect(page.locator('.v-otp-input input:visible')).toHaveCount(6)
    await expect(page.locator('button[type="submit"]').first()).toBeDisabled()
  })
})
