import { expect, test } from '@shared/tests/e2e/fixtures'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('ImportResultEntry', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
    await page.goto('/#/participants/import')
    await expect(page.getByRole('heading', { name: 'Import participants' })).toBeVisible()

    await page.getByLabel('Select Excel file for import').setInputFiles({
      name: 'participants.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer: globalThis.Buffer.from('stub')
    })

    await page.getByRole('button', { name: 'Next step' }).click()
  })

  test('renders imported participant with name, club and status icon', async ({ page }) => {
    await expect(page.getByText('Yuki Tanaka')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('Dojo Nord').first()).toBeVisible()
    await expect(page.getByLabel('Yuki Tanaka imported successfully')).toBeVisible()
  })
})
