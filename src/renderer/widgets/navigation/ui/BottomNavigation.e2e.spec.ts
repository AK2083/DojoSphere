import { expect, test } from '@shared/tests/e2e/fixtures'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'
import { mockSupabaseCloudAuthForE2e } from '@shared/tests/e2e/setup-login-available'

test.describe('BottomNavigation', () => {
  test('renders footer with cloud and network status chips', async ({ page }) => {
    await setEnglishLanguage(page)
    await mockSupabaseCloudAuthForE2e(page)

    await page.goto('/#/dashboard')

    await expect(page.locator('footer')).toBeVisible()
    await expect(page.getByTestId('cloud-status-chip')).toHaveAttribute('aria-label', 'Cloud')
    await expect(page.getByTestId('network-status-chip')).toHaveAttribute(
      'aria-label',
      /Online|Offline/
    )
  })
})
