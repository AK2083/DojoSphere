import { expect, test } from '@shared/tests/e2e/fixtures'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('ImportResultEntry', { tag: '@regression' }, () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
    await page.goto('/#/participants/import')
    await expect(page.getByRole('heading', { name: 'Import participants' })).toBeVisible()

    await page.getByLabel('Select Excel file for import').setInputFiles({
      name: 'participants.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer: globalThis.Buffer.from('stub')
    })

    // Wait for auto-advance to mapping, then start the import step.
    await expect(page.locator('.import-step-section').getByText('Map columns', { exact: true })).toBeVisible({
      timeout: 10_000
    })
    await expect(page.getByRole('button', { name: 'Next step' })).toBeEnabled()
    await page.getByRole('button', { name: 'Next step' }).click()
    await expect(page.getByRole('button', { name: 'Finish import' })).toBeVisible({
      timeout: 10_000
    })
  })

  test(
    'renders imported participant with name, association and status icon',
    { tag: '@smoke' },
    async ({ page }) => {
      await expect(page.getByText('Yuki Tanaka')).toBeVisible()
      await expect(page.getByText('Dojo Nord').first()).toBeVisible()
      await expect(page.getByLabel('Yuki Tanaka imported successfully')).toBeVisible()
    }
  )
})
