import { expect, test } from '@shared/tests/e2e/fixtures'
import { gotoParticipantsPage } from '@shared/tests/e2e/get-participant-overview'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('ParticipantEntry', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
    await page.setViewportSize({ width: 1280, height: 800 })
  })

  test('shows club name below participant name in the card header', async ({ page }) => {
    await gotoParticipantsPage(page, { withParticipants: true })

    const yukiCard = page.locator('.participant-entry').filter({ hasText: 'Yuki Tanaka' })

    await expect(yukiCard).toBeVisible()
    await expect(yukiCard.getByText('Dojo Nord')).toBeVisible()
  })

  test('shows summary fields and expandable details', async ({ page }) => {
    await gotoParticipantsPage(page, { withParticipants: true })

    await expect(page.getByText('JP-000142')).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Show additional details' }).first()
    ).toBeVisible()

    await page.getByRole('button', { name: 'Show additional details' }).first().click()

    await expect(
      page.getByRole('button', { name: 'Hide additional details' }).first()
    ).toBeVisible()
    await expect(page.getByText('S. Fischer').first()).toBeVisible()
  })

  test('exposes edit and delete actions with accessible names', async ({ page }) => {
    await gotoParticipantsPage(page, { withParticipants: true })

    await expect(page.getByRole('button', { name: 'Edit Yuki Tanaka' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Delete Anna Weber' })).toBeVisible()
  })
})
