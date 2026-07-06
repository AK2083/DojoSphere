import { expect, test } from '@shared/tests/e2e/fixtures'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('ImportMappingStep', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
    await page.goto('/#/participants/import')
    await expect(page.getByRole('heading', { name: 'Import participants' })).toBeVisible()

    await page.getByLabel('Select Excel file for import').setInputFiles({
      name: 'participants.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer: globalThis.Buffer.from('stub')
    })
  })

  test('lists participant fields with per-field excel column selects', async ({ page }) => {
    const stepCard = page.locator('.import-step-section')

    await expect(stepCard.getByText('Map columns', { exact: true })).toBeVisible()
    await expect(
      stepCard.getByText(
        'Assign the matching column from the Excel file to each participant field.',
        {
          exact: false
        }
      )
    ).toBeVisible()
    await expect(page.getByText('Given name').first()).toBeVisible()
    const givenNameRow = page
      .locator('.import-mapping-step__list')
      .getByRole('listitem')
      .filter({ hasText: 'Given name' })
    await expect(givenNameRow.getByRole('combobox', { name: 'File column' })).toBeVisible()
  })
})
