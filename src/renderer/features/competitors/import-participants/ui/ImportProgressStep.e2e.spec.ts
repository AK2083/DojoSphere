import { expect, test } from '@shared/tests/e2e/fixtures'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('ImportProgressStep', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
    await page.goto('/#/participants/import')
    await expect(page.getByRole('heading', { name: 'Import participants' })).toBeVisible()
    await page.getByRole('button', { name: 'Next step' }).click()
    await page.getByRole('button', { name: 'Next step' }).click()
  })

  test('renders circular import progress and participant results', async ({ page }) => {
    await expect(page.getByRole('progressbar', { name: 'Import progress' })).toBeVisible()
    await expect(page.getByText('Yuki Tanaka')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('Max Miller')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByLabel('Max Miller could not be imported')).toBeVisible()
    await expect(page.getByText('Import complete.')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByRole('button', { name: 'Finish import' })).toBeVisible()
  })

  test('returns to participant list when finish is clicked', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Finish import' })).toBeVisible({
      timeout: 10_000
    })
    await page.getByRole('button', { name: 'Finish import' }).click()
    await expect(page).toHaveURL(/#\/participants$/, { timeout: 10_000 })
  })
})
