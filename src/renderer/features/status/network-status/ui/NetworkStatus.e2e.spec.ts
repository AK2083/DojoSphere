import { expect, test } from '@shared/tests/e2e/fixtures'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('NetworkStatus', () => {
  test('renders network status in footer', async ({ page }) => {
    await setEnglishLanguage(page)
    await page.goto('/#/dashboard')

    const chip = page.getByTestId('network-status-chip')

    await expect(chip).toHaveAttribute('aria-label', /Online|Offline/)
  })
})
