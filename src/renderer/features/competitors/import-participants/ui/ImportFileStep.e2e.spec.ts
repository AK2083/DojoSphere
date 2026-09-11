import { expect, test } from '@shared/tests/e2e/fixtures'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('ImportFileStep', { tag: '@regression' }, () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
    await page.goto('/#/participants/import')
    await expect(page.getByRole('heading', { name: 'Import participants' })).toBeVisible()
  })

  test(
    'renders excel file input on first step',
    { tag: ['@smoke', '@critical'] },
    async ({ page }) => {
      await expect(page.getByLabel('Select Excel file for import')).toBeVisible()
      await expect(page.getByText('Supported format: Excel (.xlsx, .xls)')).toBeVisible()
    }
  )
})
