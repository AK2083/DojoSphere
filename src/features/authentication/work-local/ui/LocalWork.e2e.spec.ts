import { expect, test } from '@playwright/test'

const LANGUAGE_STORAGE_KEY = 'dojosphere.settings.language'

test.describe('LocalWork', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(
      ([languageKey]) => {
        globalThis.localStorage?.setItem(languageKey, JSON.stringify('en'))
      },
      [LANGUAGE_STORAGE_KEY]
    )
  })

  test('renders local work action on datasource page', async ({ page }) => {
    await page.goto('/#/datasource')

    await expect(
      page.getByRole('button', { name: 'Continue without registration', exact: true })
    ).toBeVisible()
  })
})
