import { expect, test } from '@shared/tests/e2e/fixtures'
import { gotoParticipantsPage } from '@shared/tests/e2e/get-participant-overview'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('ParticipantImportPage', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('renders import page with stepper', async ({ page }) => {
    await page.goto('/#/participants/import')

    await expect(page.getByRole('heading', { name: 'Import participants' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Back to participant list' })).toBeVisible()
    await expect(page.locator('.v-stepper')).toBeVisible()
  })

  test('navigates from participant list via import button', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await gotoParticipantsPage(page)

    const section = page.getByRole('region', { name: 'Participants list' })
    await section.getByRole('button', { name: 'Import participants' }).click()

    await expect(page).toHaveURL(/#\/participants\/import$/, { timeout: 10_000 })
    await expect(page.getByRole('heading', { name: 'Import participants' })).toBeVisible()
  })
})
