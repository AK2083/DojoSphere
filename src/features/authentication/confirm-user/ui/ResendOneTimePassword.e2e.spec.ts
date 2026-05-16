import { expect, test } from '@playwright/test'

const LANGUAGE_STORAGE_KEY = 'dojosphere.settings.language'

test.describe('ResendOneTimePassword (confirm-user)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(
      ([languageKey]) => {
        globalThis.localStorage?.setItem(languageKey, JSON.stringify('en'))
      },
      [LANGUAGE_STORAGE_KEY]
    )
  })

  test('renders resend action on confirmation page', async ({ page }) => {
    await page.goto('/#/emailverification')

    await expect(
      page.getByRole('button', { name: 'Send me a new confirmation code', exact: true })
    ).toBeVisible()
  })
})
