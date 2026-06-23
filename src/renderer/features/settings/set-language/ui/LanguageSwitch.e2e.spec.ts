import { expect, test } from '@shared/tests/e2e/fixtures'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('LanguageSwitch', () => {
  test('changes language to German and persists selection', async ({ page }) => {
    await setEnglishLanguage(page)

    await page.goto('/#/settings')

    await expect(
      page.locator('label.font-weight-medium').getByText('Language', { exact: true })
    ).toBeVisible()

    const languageCombobox = page.locator('.v-select [role="combobox"]:visible').first()
    await languageCombobox.click()
    await page.getByRole('option', { name: 'Deutsch', exact: true }).click()

    await expect(
      page.locator('label.font-weight-medium').getByText('Sprache', { exact: true })
    ).toBeVisible()

    const storedLanguage = await page.evaluate(() =>
      JSON.parse(globalThis.localStorage?.getItem('dojosphere.settings.language') ?? 'null')
    )
    expect(storedLanguage).toBe('de')
  })
})
