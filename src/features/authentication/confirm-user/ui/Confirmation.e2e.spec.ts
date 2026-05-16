import { expect, test } from '@playwright/test'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('Confirmation', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('renders otp input and disabled submit action', async ({ page }) => {
    await page.goto('/#/emailverification')

    await expect(page.locator('.v-otp-input input:visible')).toHaveCount(6)
    await expect(page.locator('button[type="submit"]').first()).toBeDisabled()
  })
})
