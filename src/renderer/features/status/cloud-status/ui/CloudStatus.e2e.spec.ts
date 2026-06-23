import { expect, test } from '@shared/tests/e2e/fixtures'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

const CLOUD_STATUS_KEY = 'dojosphere.cloud.status.isCloudUsed'

test.describe('CloudStatus', () => {
  test('displays cloud mode from local storage', async ({ page }) => {
    await setEnglishLanguage(page)
    await page.addInitScript(
      ([cloudStatusKey]) => {
        globalThis.localStorage?.setItem(cloudStatusKey, JSON.stringify(true))
      },
      [CLOUD_STATUS_KEY]
    )

    await page.goto('/#/dashboard')

    await expect(page.getByTestId('cloud-status-chip')).toHaveAttribute('aria-label', 'Cloud')
  })

  test('displays local mode from local storage', async ({ page }) => {
    await setEnglishLanguage(page)
    await page.addInitScript(
      ([cloudStatusKey]) => {
        globalThis.localStorage?.setItem(cloudStatusKey, JSON.stringify(false))
      },
      [CLOUD_STATUS_KEY]
    )

    await page.goto('/#/dashboard')

    await expect(page.getByTestId('cloud-status-chip')).toHaveAttribute('aria-label', 'Local')
  })
})
