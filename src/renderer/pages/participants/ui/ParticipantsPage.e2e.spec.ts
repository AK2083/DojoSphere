import { expect, test } from '@shared/tests/e2e/fixtures'
import { gotoParticipantsPage } from '@shared/tests/e2e/get-participant-overview'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('participants page', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('renders page heading and participant list', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await gotoParticipantsPage(page)

    await expect(page.getByRole('heading', { name: 'Participant list', exact: true })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Leo', exact: true })).toBeVisible()
  })
})
