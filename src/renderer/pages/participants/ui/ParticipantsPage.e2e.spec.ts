import { expect, test } from '@shared/tests/e2e/fixtures'
import { gotoParticipantsPage } from '@shared/tests/e2e/get-participant-overview'
import { getPlaywrightParticipantId } from '@shared/tests/e2e/playwright-competitor-fixtures'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('ParticipantsPage', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('renders page heading and participant card list', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await gotoParticipantsPage(page, { withParticipants: true })

    await expect(page).toHaveURL(/#\/participants$/)
    await expect(page.getByRole('heading', { name: 'Participant list', exact: true })).toBeVisible()
    await expect(page.getByRole('region', { name: 'Participants list' })).toBeVisible()
    await expect(page.getByText('Yuki Tanaka')).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Show additional details' }).first()
    ).toBeVisible()
  })

  test('renders participant cards on narrow viewports', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await gotoParticipantsPage(page, { withParticipants: true })

    await expect(page.getByRole('heading', { name: 'Participant list', exact: true })).toBeVisible()
    await expect(page.getByText('Anna Weber')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Add participant' })).toBeVisible()
  })

  test('navigates to create and edit form pages', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await gotoParticipantsPage(page, { withParticipants: true })

    await page.getByRole('button', { name: 'Add participant' }).click()
    await expect(page).toHaveURL(/#\/participants\/new$/)
    await expect(page.getByRole('heading', { name: 'Add participant', exact: true })).toBeVisible()

    await gotoParticipantsPage(page, { withParticipants: true })

    const yukiId = await getPlaywrightParticipantId(page, 'Yuki')
    await page.getByRole('button', { name: 'Edit Yuki Tanaka' }).click()
    await expect(page).toHaveURL(new RegExp(`#/participants/${yukiId}/edit$`))
    await expect(page.getByRole('heading', { name: 'Edit participant', exact: true })).toBeVisible()
  })
})
