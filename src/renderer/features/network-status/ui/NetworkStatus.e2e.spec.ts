import { expect, test } from '@playwright/test'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('NetworkStatus', () => {
  test('renders network label in footer', async ({ page }) => {
    await setEnglishLanguage(page)
    await page.goto('/#/dashboard')

    const chip = page.getByTestId('network-status-chip')

    await expect(chip).toContainText(/Online|Offline/)
  })
})
