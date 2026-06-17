import { expect, test } from '@playwright/test'
import { gotoHashRoute } from '@shared/tests/e2e/navigation'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'
import { setCloudModeDisabled, setupLoginAvailable } from '@shared/tests/e2e/setup-login-available'

test.describe('LoginForm', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('renders login form fields and actions', async ({ page }) => {
    await gotoHashRoute(page, '/#/login', 'form')

    const loginForm = page.locator('form')
    await expect(loginForm).toHaveCount(1)
    await expect(page.locator('input[autocomplete="email"]')).toHaveCount(1)
    await expect(page.locator('input[autocomplete="current-password"]')).toHaveCount(1)
    await expect(
      page.locator(
        'button[aria-label="Passwort ein- oder ausblenden"], button[title="Passwort ein- oder ausblenden"]'
      )
    ).toHaveCount(1)
    await expect(loginForm.locator('[role="tooltip"]')).toHaveCount(0)
    await expect(page.locator('button[type="submit"]')).toBeDisabled()
    await expect(page.locator('a[href$="#/register"]').first()).toBeVisible()
  })

  test('navigates to password reset when login is available', async ({ page }) => {
    await setupLoginAvailable(page)
    await gotoHashRoute(page, '/#/login', 'input[autocomplete="email"]')

    const forgotPasswordButton = page.getByRole('button', {
      name: 'Forgot your password?',
      exact: true
    })

    await expect(forgotPasswordButton).toBeEnabled({ timeout: 15_000 })
    await forgotPasswordButton.click()
    await expect(page).toHaveURL(/#\/passwordreset$/, { timeout: 15_000 })
  })

  test('disables forgot-password when cloud mode is off', async ({ page }) => {
    await setCloudModeDisabled(page)
    await gotoHashRoute(page, '/#/login', 'input[autocomplete="email"]')

    const forgotPasswordButton = page.getByRole('button', {
      name: 'Forgot your password?',
      exact: true
    })
    const unavailableAlert = page.getByRole('alert').filter({
      hasText: /Login is currently unavailable/
    })

    await expect(unavailableAlert).toBeVisible()
    await expect(unavailableAlert).toContainText(/because cloud mode is disabled/)
    await expect(forgotPasswordButton).toBeDisabled()
    await expect(page).toHaveURL(/#\/login$/)
  })
})
