import { expect, test } from '@playwright/test'

const LANGUAGE_STORAGE_KEY = 'dojosphere.settings.language'

test.describe('LanguageSwitch', () => {
  test('changes language to German and persists selection', async ({ page }) => {
    await page.addInitScript(
      ([languageKey]) => {
        globalThis.localStorage?.setItem(languageKey, JSON.stringify('en'))
      },
      [LANGUAGE_STORAGE_KEY]
    )

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

    await expect
      .poll(async () =>
        page.evaluate(
          ([languageKey]) => JSON.parse(globalThis.localStorage?.getItem(languageKey) ?? 'null'),
          [LANGUAGE_STORAGE_KEY]
        )
      )
      .toBe('de')
  })
})
