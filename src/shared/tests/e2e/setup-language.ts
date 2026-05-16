import type { Page } from '@playwright/test'

const LANGUAGE_STORAGE_KEY = 'dojosphere.settings.language'

/**
 * Ensures tests start with English UI texts for stable locators.
 *
 * @param page - Playwright page instance.
 */
export async function setEnglishLanguage(page: Page): Promise<void> {
  await page.addInitScript(
    ([languageKey]) => {
      globalThis.localStorage?.setItem(languageKey, JSON.stringify('en'))
    },
    [LANGUAGE_STORAGE_KEY]
  )
}
