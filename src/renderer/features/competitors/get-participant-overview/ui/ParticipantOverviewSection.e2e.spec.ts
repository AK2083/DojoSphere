import { expect, test } from '@shared/tests/e2e/fixtures'
import { gotoParticipantsPage } from '@shared/tests/e2e/get-participant-overview'
import { getPlaywrightParticipantId } from '@shared/tests/e2e/playwright-competitor-fixtures'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('ParticipantOverviewSection', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('renders empty state without seeded participants', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await gotoParticipantsPage(page)

    await expect(page.getByText('No participants registered yet.')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Add participant' })).toBeVisible()
  })

  test('renders participant cards when data is available', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await gotoParticipantsPage(page, { withParticipants: true })

    const participantsSection = page.getByRole('region', { name: 'Participants list' })

    await expect(participantsSection).toHaveAttribute('aria-busy', 'false')
    await expect(page.getByText('Yuki Tanaka')).toBeVisible()
    await expect(page.getByText('Anna Weber')).toBeVisible()
    await expect(page.getByText('Leo Martin')).toBeVisible()
  })

  test('renders a single-column grid on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await gotoParticipantsPage(page, { withParticipants: true })

    await expect(page.getByText('Anna Weber')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Add participant' })).toBeVisible()
  })

  test('navigates to create and edit routes from the section', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await gotoParticipantsPage(page, { withParticipants: true })

    const section = page.getByRole('region', { name: 'Participants list' })
    const addButton = section.getByRole('button', { name: 'Add participant' })

    await expect(addButton).toBeVisible()
    await addButton.click()
    await expect(page).toHaveURL(/#\/participants\/new$/, { timeout: 10_000 })

    await gotoParticipantsPage(page, { withParticipants: true })

    const yukiId = await getPlaywrightParticipantId(page, 'Yuki')
    await page.getByRole('button', { name: 'Edit Yuki Tanaka' }).click()
    await expect(page).toHaveURL(new RegExp(`#/participants/${yukiId}/edit$`))
  })
})
