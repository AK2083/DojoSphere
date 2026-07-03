import { expect, test } from '@shared/tests/e2e/fixtures'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('ImportMappingStep', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
    await page.goto('/#/participants/import')
    await expect(page.getByRole('heading', { name: 'Import participants' })).toBeVisible()
    await page.getByRole('button', { name: 'Next step' }).click()
  })

  test('renders source and target mapping selects', async ({ page }) => {
    const stepCard = page.locator('.import-step-section')

    await expect(stepCard.getByText('Map columns', { exact: true })).toBeVisible()
    await expect(
      stepCard.getByText('Assign a column from the file to a participant form field.')
    ).toBeVisible()
    await expect(page.getByRole('combobox', { name: 'File column' })).toBeVisible()
    await expect(page.getByRole('combobox', { name: 'Participant field' })).toBeVisible()
  })
})
