import { expect, test } from '@shared/tests/e2e/fixtures'
import { gotoParticipantsPage } from '@shared/tests/e2e/get-participant-overview'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('ParticipantsPage', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('renders desktop page heading and overview region', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await gotoParticipantsPage(page)

    await expect(page).toHaveURL(/#\/participants$/)
    await expect(page.getByRole('heading', { name: 'Participant list', exact: true })).toBeVisible()
    await expect(page.getByRole('region', { name: 'Participants table' })).toBeVisible()
  })

  test('renders mobile page heading and participant cards', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await gotoParticipantsPage(page)

    await expect(page.getByRole('heading', { name: 'Participant list', exact: true })).toBeVisible()
    await expect(page.getByText('Yuki Tanaka')).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Show additional details' }).first()
    ).toBeVisible()
  })
})
