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
    await page.setViewportSize({ width: 1280, height: 800 })
    await gotoParticipantsPage(page)
  })

  test('loads static participants in the desktop table', async ({ page }) => {
    await expect(page.getByRole('cell', { name: 'Yuki', exact: true })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Tanaka', exact: true })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Anna', exact: true })).toBeVisible()
  })

  test('sorts participants by given name', async ({ page }) => {
    await page.getByRole('columnheader', { name: 'Given name' }).click()

    const cells = await givenNameCells(page)
    await expect(cells.nth(0)).toHaveText('Anna')
    await expect(cells.nth(1)).toHaveText('Leo')
    await expect(cells.nth(2)).toHaveText('Yuki')
  })

  test('navigates to create and edit form pages', async ({ page }) => {
    await page.getByRole('button', { name: 'Add participant' }).click()
    await expect(page).toHaveURL(/#\/participants\/new$/)
    await expect(page.getByRole('heading', { name: 'Add participant', exact: true })).toBeVisible()

    await page.goto('/#/participants')
    await gotoParticipantsPage(page)

    await page.getByRole('button', { name: 'Edit Yuki Tanaka' }).click()
    await expect(page).toHaveURL(/#\/participants\/participant-1\/edit$/)
    await expect(page.getByRole('heading', { name: 'Edit participant', exact: true })).toBeVisible()
  })
})
