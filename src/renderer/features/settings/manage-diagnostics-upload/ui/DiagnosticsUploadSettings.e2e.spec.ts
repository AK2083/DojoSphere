import { expect, test } from '@shared/tests/e2e/fixtures'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

const DIAGNOSTICS_STORAGE_KEY = 'dojosphere.settings.diagnostics.autoUploadDiagnostics'

test.describe('DiagnosticsUploadSettings', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('persists diagnostic upload preference when toggled', async ({ page }) => {
    await page.addInitScript(
      ([storageKey]) => {
        globalThis.localStorage?.setItem(storageKey, JSON.stringify(false))
      },
      [DIAGNOSTICS_STORAGE_KEY]
    )

    await page.goto('/#/settings')

    await expect(
      page.locator('label.font-weight-medium').getByText('Send diagnostic data on errors', {
        exact: true
      })
    ).toBeVisible()

    await page.getByLabel('Automatic diagnostic upload disabled', { exact: true }).click()

    const storedEnabled = await page.evaluate(
      ([storageKey]) => {
        return JSON.parse(globalThis.localStorage?.getItem(storageKey) ?? 'null')
      },
      [DIAGNOSTICS_STORAGE_KEY]
    )
    expect(storedEnabled).toBe(true)

    await page.getByLabel('Automatic diagnostic upload enabled', { exact: true }).click()

    const storedDisabled = await page.evaluate(
      ([storageKey]) => {
        return JSON.parse(globalThis.localStorage?.getItem(storageKey) ?? 'null')
      },
      [DIAGNOSTICS_STORAGE_KEY]
    )
    expect(storedDisabled).toBe(false)
  })
})
