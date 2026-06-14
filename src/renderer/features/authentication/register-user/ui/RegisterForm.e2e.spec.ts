import { expect, type Page, test } from '@playwright/test'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

function getRegisterForm(page: Page) {
  return page.locator('form').filter({ has: page.locator('input[autocomplete="new-password"]') })
}

test.describe('RegisterForm', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('renders register form fields and login link', async ({ page }) => {
    await page.goto('/#/register')

    const registerForm = getRegisterForm(page)

    await expect(registerForm).toHaveCount(1)
    await expect(registerForm.locator('input[autocomplete="email"]')).toHaveCount(1)
    await expect(registerForm.locator('input[autocomplete="new-password"]')).toHaveCount(1)
    await expect(
      registerForm.locator(
        'button[aria-label="Show or hide password"], button[title="Show or hide password"]'
      )
    ).toHaveCount(1)
    await expect(registerForm.locator('[role="tooltip"]')).toHaveCount(0)
    await expect(
      registerForm.getByRole('button', { name: 'Register me', exact: true })
    ).toBeDisabled()
    await expect(registerForm.locator('a[href$="#/login"]')).toBeVisible()
  })
})
