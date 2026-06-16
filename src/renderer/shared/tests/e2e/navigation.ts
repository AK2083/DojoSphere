import { expect, type Page } from '@playwright/test'

/**
 * Navigates to a hash route and waits until the SPA is ready.
 *
 * Retries navigation when Vite serves a transient module-load failure under parallel e2e load.
 *
 * @param page - Playwright page instance.
 * @param hashPath - Hash route path, e.g. `/#/login`.
 * @param readySelector - Optional selector that must be visible before continuing.
 */
export async function gotoHashRoute(
  page: Page,
  hashPath: string,
  readySelector?: string
): Promise<void> {
  const escapedPath = hashPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const urlPattern = new RegExp(`${escapedPath}$`)

  for (let attempt = 1; attempt <= 3; attempt++) {
    await page.goto(hashPath, { waitUntil: 'domcontentloaded' })

    try {
      await expect(page).toHaveURL(urlPattern, { timeout: 15_000 })

      if (readySelector) {
        await expect(page.locator(readySelector).first()).toBeVisible({ timeout: 15_000 })
      }

      return
    } catch (error) {
      if (attempt === 3) {
        throw error
      }

      await page.reload({ waitUntil: 'domcontentloaded' })
    }
  }
}
