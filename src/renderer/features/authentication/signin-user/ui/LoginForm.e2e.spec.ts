import { expect, test } from '@playwright/test'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('LoginForm', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('renders login form fields and actions', async ({ page }) => {
    await page.goto('/#/login')
    await expect(page).toHaveURL(/#\/login$/)

    if ((await page.locator('form').count()) === 0) {
      await page.reload()
      await expect(page).toHaveURL(/#\/login$/)
    }

    await expect(page.locator('form')).toHaveCount(1, { timeout: 10_000 })
    await expect(page.locator('input[autocomplete="email"]')).toHaveCount(1)
    await expect(page.locator('input[autocomplete="current-password"]')).toHaveCount(1)
    await expect(
      page.locator(
        'button[aria-label="Passwort ein- oder ausblenden"], button[title="Passwort ein- oder ausblenden"]'
      )
    ).toHaveCount(1)
    await expect(page.locator('[role="tooltip"]')).toHaveCount(0)
    await expect(page.locator('button[type="submit"]')).toBeDisabled()
    await expect(page.locator('a[href$="#/datasource"]').first()).toBeVisible()
  })

  test('handles forgot-password action based on login availability', async ({ page }) => {
    await page.goto('/#/login')

    const forgotPasswordButton = page.getByRole('button', {
      name: 'Forgot your password?',
      exact: true
    })
    const unavailableAlert = page.getByRole('alert').filter({
      hasText: /Login is currently unavailable/
    })

    await expect(forgotPasswordButton).toBeVisible()

    // Network bootstrap (heartbeat) may disable login shortly after the page loads.
    await expect
      .poll(async () => {
        if (await unavailableAlert.isVisible()) {
          return 'unavailable'
        }

        if (await forgotPasswordButton.isEnabled()) {
          return 'available'
        }

        return 'pending'
      })
      .not.toBe('pending')

    if (await unavailableAlert.isVisible()) {
      await expect(unavailableAlert).toContainText(
        /Login is currently unavailable|because cloud mode is disabled|while you are offline/
      )
      await expect(forgotPasswordButton).toBeDisabled()
      await expect(page).toHaveURL(/#\/login$/)
      return
    }

    await forgotPasswordButton.click()
    await expect(page).toHaveURL(/#\/passwordreset$/)
  })
})
