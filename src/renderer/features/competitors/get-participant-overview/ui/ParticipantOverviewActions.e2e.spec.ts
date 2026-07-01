import { expect, test } from '@shared/tests/e2e/fixtures'
import { gotoParticipantsPage } from '@shared/tests/e2e/get-participant-overview'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('ParticipantOverviewActions', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('renders desktop toolbar with text add button and filter placeholder', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await gotoParticipantsPage(page)

    const section = page.getByRole('region', { name: 'Participants list' })
    const addButton = section.getByRole('button', { name: 'Add participant' })

    await expect(addButton).toBeVisible()
    await expect(addButton).toContainText('Add participant')
    await expect(section.getByRole('button', { name: 'Filter (not available yet)' })).toBeVisible()
  })

  test('renders mobile toolbar with icon-only add button', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await gotoParticipantsPage(page)

    const section = page.getByRole('region', { name: 'Participants list' })
    const addButton = section.getByRole('button', { name: 'Add participant' })

    await expect(addButton).toBeVisible()
    await expect(addButton).toHaveAttribute('aria-label', 'Add participant')
    await expect(addButton).not.toContainText('Add participant')
  })

  test('navigates to the create form when add is clicked', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await gotoParticipantsPage(page)

    await page.getByRole('button', { name: 'Add participant' }).click()
    await expect(page).toHaveURL(/#\/participants\/new$/)
  })
})
