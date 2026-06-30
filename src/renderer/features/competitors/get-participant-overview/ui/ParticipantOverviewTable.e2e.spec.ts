import type { Page } from '@playwright/test'
import { expect, test } from '@shared/tests/e2e/fixtures'
import { gotoParticipantsPage } from '@shared/tests/e2e/get-participant-overview'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

function getParticipantsRegion(page: Page) {
  return page.getByRole('region', { name: 'Participants table' })
}

test.describe('ParticipantOverviewTable', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
    await page.setViewportSize({ width: 1280, height: 800 })
    await gotoParticipantsPage(page)
  })

  test('renders desktop table columns and toolbar actions', async ({ page }) => {
    const region = getParticipantsRegion(page)

    await expect(region).toBeVisible()
    await expect(page.getByRole('columnheader', { name: 'Given name' })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: 'Family name' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Add participant' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Edit Yuki Tanaka' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Delete Anna Weber' })).toBeVisible()
  })
})
