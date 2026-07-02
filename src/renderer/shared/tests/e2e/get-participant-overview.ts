import { expect, type Page } from '@playwright/test'

import { seedPlaywrightParticipants } from './playwright-competitor-fixtures'

export type GotoParticipantsPageOptions = {
  /** Seeds fictional participants for tests that need table rows. */
  withParticipants?: boolean
}

async function remountParticipantsRoute(page: Page): Promise<void> {
  await page.evaluate(() => {
    window.location.hash = '#/settings'
  })
  await expect(page).toHaveURL(/#\/settings/)

  await page.evaluate(() => {
    window.location.hash = '#/participants'
  })
}

/**
 * Opens the participants route and waits until the overview is ready.
 *
 * @param page - Playwright page instance.
 * @param options - Optional seeding for tests that need sample rows.
 */
export async function gotoParticipantsPage(
  page: Page,
  options: GotoParticipantsPageOptions = {}
): Promise<void> {
  await page.goto('/#/participants')

  if (options.withParticipants) {
    await seedPlaywrightParticipants(page)
    await remountParticipantsRoute(page)
  }

  await expect(page).toHaveURL(/#\/participants$/)
  const participantsSection = page.getByRole('region', { name: 'Participants list' })
  await expect(participantsSection).toBeVisible()
  await expect(participantsSection).toHaveAttribute('aria-busy', 'false', { timeout: 10_000 })

  if (options.withParticipants) {
    await expect(page.getByText('Yuki Tanaka')).toBeVisible({ timeout: 10_000 })
  }
}
