import { expect, type Page } from '@playwright/test'

/** Returns the participant form landmark used in save-participant e2e tests. */
export function getParticipantForm(page: Page) {
  return page.getByRole('form', { name: 'Participant form' })
}

/**
 * Opens a Vuetify `v-select` by its combobox label.
 *
 * Clicks the field container instead of the hidden combobox input so Playwright
 * does not fail when `v-field__input` intercepts pointer events.
 *
 * @param page - Playwright page instance.
 * @param fieldLabel - Accessible combobox label, e.g. `Age class`.
 */
export async function openParticipantSelect(page: Page, fieldLabel: string): Promise<void> {
  await page
    .locator('.v-select')
    .filter({ has: page.getByRole('combobox', { name: fieldLabel }) })
    .click()
}

/**
 * Selects an option from the currently open Vuetify select menu.
 *
 * @param page - Playwright page instance.
 * @param optionLabel - Visible option text.
 */
export async function chooseParticipantSelectOption(
  page: Page,
  optionLabel: string,
  options: { exact?: boolean } = {}
): Promise<void> {
  await page
    .getByRole('option', { name: optionLabel, exact: options.exact ?? true })
    .click()
}

/**
 * Navigates to the create-participant route and waits for the form shell.
 *
 * @param page - Playwright page instance.
 */
export async function gotoParticipantCreateForm(page: Page): Promise<void> {
  await page.goto('/#/participants/new')
  await expect(page).toHaveURL(/#\/participants\/new$/)
  await expect(getParticipantForm(page)).toBeVisible()
}
