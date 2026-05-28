import { expect, test } from '@playwright/test'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

const CLOUD_STATUS_KEY = 'dojosphere.cloud.status.isCloudUsed'

test.describe('CloudStatus', () => {
  test('toggles cloud mode and persists state to local storage', async ({ page }) => {
    await setEnglishLanguage(page)
    await page.addInitScript(
      ([cloudStatusKey]) => {
        globalThis.localStorage?.setItem(cloudStatusKey, JSON.stringify(true))
      },
      [CLOUD_STATUS_KEY]
    )

    await page.goto('/#/dashboard')

    const chip = page.getByTestId('cloud-status-chip')

    await expect(chip).toContainText('Cloud')
    await chip.click()
    await expect(chip).toContainText('Local')

    let storedCloudStatus = await page.evaluate(
      ([cloudStatusKey]) => {
        return JSON.parse(globalThis.localStorage?.getItem(cloudStatusKey) ?? 'null')
      },
      [CLOUD_STATUS_KEY]
    )
    expect(storedCloudStatus).toBe(false)

    await chip.click()
    await expect(chip).toContainText('Cloud')

    storedCloudStatus = await page.evaluate(
      ([cloudStatusKey]) => {
        return JSON.parse(globalThis.localStorage?.getItem(cloudStatusKey) ?? 'null')
      },
      [CLOUD_STATUS_KEY]
    )
    expect(storedCloudStatus).toBe(true)
  })
})
