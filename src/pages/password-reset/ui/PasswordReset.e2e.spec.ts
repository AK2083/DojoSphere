import { expect, test } from '@playwright/test'

test.describe('password-reset page', () => {
  test('shows stepper with disabled next action initially', async ({ page }) => {
    await page.goto('/#/passwordreset')

    await expect(page.locator('.v-stepper')).toBeVisible()
    await expect(page.locator('.v-stepper-header .v-stepper-item')).toHaveCount(3)
    await expect(page.locator('.v-stepper .v-btn').last()).toBeDisabled()
  })
})
