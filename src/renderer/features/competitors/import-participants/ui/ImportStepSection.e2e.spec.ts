import { expect, test } from '@shared/tests/e2e/fixtures'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('ImportStepSection', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
    await page.goto('/#/participants/import')
    await expect(page.getByRole('heading', { name: 'Import participants' })).toBeVisible()
  })

  test('renders the current step title and description in the step card', async ({ page }) => {
    const stepCard = page.locator('.import-step-section')

    await expect(stepCard.getByText('Select file', { exact: true })).toBeVisible()
    await expect(
      stepCard.getByText('Choose an Excel file with participant data to import.')
    ).toBeVisible()
  })
})
