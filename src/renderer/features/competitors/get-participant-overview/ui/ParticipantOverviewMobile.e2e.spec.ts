import { expect, test } from '@shared/tests/e2e/fixtures'
import { gotoParticipantsPage } from '@shared/tests/e2e/get-participant-overview'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('ParticipantOverviewMobile', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
    await page.setViewportSize({ width: 390, height: 844 })
    await gotoParticipantsPage(page, { withParticipants: true })
  })

  test('renders participant cards with detail toggle', async ({ page }) => {
    await expect(page.getByText('Yuki Tanaka')).toBeVisible()
    await expect(page.getByText('Anna Weber')).toBeVisible()
    await expect(page.getByText('Leo Martin')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Add participant' })).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Show additional details' }).first()
    ).toBeVisible()
  })

  test('expands and collapses card details', async ({ page }) => {
    const detailsToggle = page.getByRole('button', { name: 'Show additional details' }).first()

    await expect(page.getByText('Date of birth', { exact: true })).not.toBeVisible()
    await detailsToggle.click()
    await expect(page.getByText('Date of birth', { exact: true })).toBeVisible()
    await page.getByRole('button', { name: 'Hide additional details' }).first().click()
    await expect(page.getByText('Date of birth', { exact: true })).not.toBeVisible()
  })
})
