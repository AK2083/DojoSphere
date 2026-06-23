import { expect, test } from '@shared/tests/e2e/fixtures'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

const LOCAL_SESSION_STORAGE_KEY = 'dojosphere.auth.local.session'

test.describe('UsernameEditor', () => {
  test('loads the default username and persists changes', async ({ page }) => {
    await setEnglishLanguage(page)

    await page.goto('/#/settings')

    const usernameField = page.getByLabel('Username', { exact: true })
    await expect(usernameField).toHaveValue('TestUser')

    await usernameField.fill('Updated Name')
    await page.getByRole('button', { name: 'Save', exact: true }).click()

    await expect(page.getByText('Username saved.', { exact: true })).toBeVisible()
    await expect(usernameField).toHaveValue('Updated Name')

    const storedToken = await page.evaluate(
      ([storageKey]) => globalThis.localStorage?.getItem(storageKey),
      [LOCAL_SESSION_STORAGE_KEY]
    )
    expect(storedToken).toBe('local-session-token')
  })
})
