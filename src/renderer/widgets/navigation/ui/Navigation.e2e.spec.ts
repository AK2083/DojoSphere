import { expect, test } from '@shared/tests/e2e/fixtures'

test.describe('Navigation widget', () => {
  test('shows at least one settings action on app start', async ({ page }) => {
    await page.goto('/')

    const settingsActions = page.locator('a[href$="#/settings"]')
    await expect(settingsActions.first()).toBeVisible()
  })

  test('desktop view exposes settings link with settings route', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')

    const desktopSettingsLink = page.locator('a[href$="#/settings"]').first()
    await expect(desktopSettingsLink).toBeVisible()
    await expect(desktopSettingsLink).toHaveAttribute('href', /#\/settings$/)
  })

  test('mobile view exposes a settings action', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    const mobileSettingsAction = page.locator('[aria-label="Settings"]').first()
    await expect(mobileSettingsAction).toBeVisible()
  })

  test('settings action is available on settings route too', async ({ page }) => {
    await page.goto('/#/settings')

    const settingsActions = page.locator('a[href$="#/settings"]')
    await expect(settingsActions.first()).toBeVisible()
  })

  test('navigates to register from navigation when not cloud signed in', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')

    await page.getByRole('listitem', { name: 'Register' }).click()
    await expect(page).toHaveURL(/#\/register$/)
  })
})
