import { expect, test } from '@shared/tests/e2e/fixtures'
import { gotoParticipantsPage } from '@shared/tests/e2e/get-participant-overview'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('ParticipantOverviewSection', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('switches between desktop table and mobile cards by viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await gotoParticipantsPage(page)

    await expect(page.getByRole('columnheader', { name: 'Given name' })).toBeVisible()
    await expect(page.getByText('Yuki Tanaka')).not.toBeVisible()

    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/#/participants')
    await gotoParticipantsPage(page)

    await expect(page.getByText('Yuki Tanaka')).toBeVisible()
    await expect(page.getByRole('columnheader', { name: 'Given name' })).not.toBeVisible()
  })
})
