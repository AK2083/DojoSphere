import { expect, type Page } from '@playwright/test'

/**
 * Opens the participants route and waits until static rows are rendered.
 *
 * @param page - Playwright page instance.
 */
export async function gotoParticipantsPage(page: Page): Promise<void> {
  await page.goto('/#/participants')

  await expect(page).toHaveURL(/#\/participants$/)
  await expect(page.getByRole('region', { name: 'Participants table' })).toBeVisible()
  await expect(page.getByText('Yuki')).toBeVisible({ timeout: 10_000 })
}
