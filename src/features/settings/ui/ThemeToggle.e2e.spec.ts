import { expect, test } from '@playwright/test'

const LANGUAGE_STORAGE_KEY = 'dojosphere.settings.language'
const THEME_STORAGE_KEY = 'dojosphere.settings.theme'

test.describe('ThemeToggle', () => {
  test('persists system, dark and light mode selections', async ({ page }) => {
    await page.addInitScript(
      ([languageKey, themeKey]) => {
        globalThis.localStorage?.setItem(languageKey, JSON.stringify('en'))
        globalThis.localStorage?.setItem(themeKey, JSON.stringify('system'))
      },
      [LANGUAGE_STORAGE_KEY, THEME_STORAGE_KEY]
    )

    await page.goto('/#/settings')

    await page.getByLabel('Dark Mode', { exact: true }).click()
    await expect
      .poll(async () =>
        page.evaluate(
          ([themeKey]) => JSON.parse(globalThis.localStorage?.getItem(themeKey) ?? 'null'),
          [THEME_STORAGE_KEY]
        )
      )
      .toBe('dark')

    await page.getByLabel('Light Mode', { exact: true }).click()
    await expect
      .poll(async () =>
        page.evaluate(
          ([themeKey]) => JSON.parse(globalThis.localStorage?.getItem(themeKey) ?? 'null'),
          [THEME_STORAGE_KEY]
        )
      )
      .toBe('light')

    await page.getByLabel('System Setting', { exact: true }).click()
    await expect
      .poll(async () =>
        page.evaluate(
          ([themeKey]) => JSON.parse(globalThis.localStorage?.getItem(themeKey) ?? 'null'),
          [THEME_STORAGE_KEY]
        )
      )
      .toBe('system')
  })
})
