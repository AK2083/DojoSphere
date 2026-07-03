import { expect, test } from '@shared/tests/e2e/fixtures'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('ParticipantImportStepper', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
    await page.goto('/#/participants/import')
    await expect(page.getByRole('heading', { name: 'Import participants' })).toBeVisible()
  })

  test('renders stepper with three steps', async ({ page }) => {
    await expect(page.locator('.v-stepper')).toBeVisible()
    await expect(page.locator('.v-stepper-header .v-stepper-item')).toHaveCount(3)
    await expect(page.getByRole('button', { name: 'Cancel import' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Next step' })).toBeVisible()
  })
})
