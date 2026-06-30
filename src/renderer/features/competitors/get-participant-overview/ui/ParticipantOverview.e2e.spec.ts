import type { Page } from '@playwright/test'
import { expect, test } from '@shared/tests/e2e/fixtures'
import { gotoParticipantsPage } from '@shared/tests/e2e/get-participant-overview'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

async function givenNameCells(page: Page) {
  return page.locator('tbody tr td:nth-child(1)')
}

test.describe('ParticipantOverview', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('shows loading state and then static participants in the desktop table', async ({
    page
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await gotoParticipantsPage(page)

    await expect(page.getByRole('cell', { name: 'Yuki', exact: true })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: 'Given name' })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: 'Gender' })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: 'Judo pass number' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Tanaka', exact: true })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Anna', exact: true })).toBeVisible()
  })

  test('sorts participants by given name', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await gotoParticipantsPage(page)

    await page.getByRole('columnheader', { name: 'Given name' }).click()

    const cells = await givenNameCells(page)
    await expect(cells.nth(0)).toHaveText('Anna')
    await expect(cells.nth(1)).toHaveText('Leo')
    await expect(cells.nth(2)).toHaveText('Yuki')
  })

  test('renders static participants on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await gotoParticipantsPage(page)

    await expect(page.getByText('Yuki')).toBeVisible()
    await expect(page.getByText('Anna')).toBeVisible()
    await expect(page.getByText('Weber')).toBeVisible()
    await expect(page.getByText('Leo')).toBeVisible()
    await expect(page.getByText('Martin')).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Show additional details' }).first()
    ).toBeVisible()
  })

  test('expands and collapses additional participant details on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await gotoParticipantsPage(page)

    const detailsToggle = page.getByRole('button', { name: 'Show additional details' }).first()

    await expect(page.getByText('Date of birth', { exact: true })).not.toBeVisible()
    await detailsToggle.click()
    await expect(page.getByText('Date of birth', { exact: true })).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Hide additional details' }).first()
    ).toBeVisible()

    await page.getByRole('button', { name: 'Hide additional details' }).first().click()
    await expect(page.getByText('Date of birth', { exact: true })).not.toBeVisible()
  })

  test('navigates to create and edit form pages', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await gotoParticipantsPage(page)

    const addButton = page.getByRole('button', { name: 'Add participant' })
    await expect(addButton).toBeVisible()
    await expect(addButton).toBeEnabled()

    await addButton.click()
    await expect(page).toHaveURL(/#\/participants\/new$/)
    await expect(page.getByRole('heading', { name: 'Add participant', exact: true })).toBeVisible()

    await page.goto('/#/participants')
    await gotoParticipantsPage(page)

    const editButton = page.getByRole('button', { name: 'Edit Yuki Tanaka' })
    await expect(editButton).toBeVisible()
    await expect(editButton).toBeEnabled()

    const deleteButton = page.getByRole('button', { name: 'Delete Anna Weber' })
    await expect(deleteButton).toBeVisible()
    await expect(deleteButton).toBeEnabled()

    await editButton.click()
    await expect(page).toHaveURL(/#\/participants\/participant-1\/edit$/)
    await expect(page.getByRole('heading', { name: 'Edit participant', exact: true })).toBeVisible()

    await page.goto('/#/participants')
    await gotoParticipantsPage(page)

    await page.getByRole('button', { name: 'Delete Anna Weber' }).click()

    await expect(page.getByRole('cell', { name: 'Yuki', exact: true })).toBeVisible()
  })
})
