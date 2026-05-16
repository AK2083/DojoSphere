import { expect, test } from '@playwright/test'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

const THEME_STORAGE_KEY = 'dojosphere.settings.theme'

test.describe('ThemeToggle', () => {
  test('persists system, dark and light mode selections', async ({ page }) => {
    await setEnglishLanguage(page)
    await page.addInitScript(
      ([themeKey]) => {
        globalThis.localStorage?.setItem(themeKey, JSON.stringify('system'))
      },
      [THEME_STORAGE_KEY]
    )

    await page.goto('/#/settings')

    await page.getByLabel('Dark Mode', { exact: true }).click()
    let storedTheme = await page.evaluate(
      ([themeKey]) => {
        return JSON.parse(globalThis.localStorage?.getItem(themeKey) ?? 'null')
      },
      [THEME_STORAGE_KEY]
    )
    expect(storedTheme).toBe('dark')

    await page.getByLabel('Light Mode', { exact: true }).click()
    storedTheme = await page.evaluate(
      ([themeKey]) => {
        return JSON.parse(globalThis.localStorage?.getItem(themeKey) ?? 'null')
      },
      [THEME_STORAGE_KEY]
    )
    expect(storedTheme).toBe('light')

    await page.getByLabel('System Setting', { exact: true }).click()
    storedTheme = await page.evaluate(
      ([themeKey]) => {
        return JSON.parse(globalThis.localStorage?.getItem(themeKey) ?? 'null')
      },
      [THEME_STORAGE_KEY]
    )
    expect(storedTheme).toBe('system')
  })
})
