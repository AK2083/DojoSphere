import { expect, type Page } from '@playwright/test'

/**
 * Opens the associations route and waits until the overview is ready.
 *
 * @param page - Playwright page instance.
 */
export async function gotoAssociationsPage(page: Page): Promise<void> {
  await page.goto('/#/associations')
  await expect(page).toHaveURL(/#\/associations$/)

  const associationsSection = page.getByRole('region', { name: 'Associations list' })
  await expect(associationsSection).toBeVisible()
  await expect(associationsSection).toHaveAttribute('aria-busy', 'false', { timeout: 10_000 })
}

/** Returns the association form landmark used in save-association e2e tests. */
export function getAssociationForm(page: Page) {
  return page.getByRole('form', { name: 'Association form' })
}

/**
 * Navigates to the create-association route and waits for the form shell.
 *
 * @param page - Playwright page instance.
 */
export async function gotoAssociationCreateForm(page: Page): Promise<void> {
  await page.goto('/#/associations/new')
  await expect(page).toHaveURL(/#\/associations\/new$/)
  await expect(getAssociationForm(page)).toBeVisible()
}
