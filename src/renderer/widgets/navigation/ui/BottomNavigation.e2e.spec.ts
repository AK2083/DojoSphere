import { expect, test } from '@shared/tests/e2e/fixtures'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

const CLOUD_STATUS_KEY = 'dojosphere.cloud.status.isCloudUsed'

test.describe('BottomNavigation', () => {
  test('renders footer with cloud and network status chips', async ({ page }) => {
    await setEnglishLanguage(page)
    await page.addInitScript(
      ([cloudStatusKey]) => {
        globalThis.localStorage?.setItem(cloudStatusKey, JSON.stringify(true))
      },
      [CLOUD_STATUS_KEY]
    )

    await page.goto('/#/dashboard')

    await expect(page.locator('footer')).toBeVisible()
    await expect(page.getByTestId('cloud-status-chip')).toHaveAttribute('aria-label', 'Cloud')
    await expect(page.getByTestId('network-status-chip')).toHaveAttribute(
      'aria-label',
      /Online|Offline/
    )
  })
})
