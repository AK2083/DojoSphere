import { expect, test } from '@shared/tests/e2e/fixtures'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('register page', { tag: '@regression' }, () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test(
    'register route renders registration form',
    { tag: ['@smoke', '@critical'] },
    async ({ page }) => {
      await page.goto('/#/register')

      await expect(page).toHaveURL(/#\/register$/)
      await expect(
        page.locator('form').filter({ has: page.locator('input[autocomplete="email"]') })
      ).toHaveCount(1)
    }
  )
})
