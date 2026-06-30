import type { Page } from '@playwright/test'
import { expect, test } from '@shared/tests/e2e/fixtures'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

function getParticipantForm(page: Page) {
  return page.getByRole('form', { name: 'Participant form' })
}

async function openGenderSelect(page: Page): Promise<void> {
  await page
    .locator('.v-select')
    .filter({ has: page.getByRole('combobox', { name: 'Gender' }) })
    .click()
}

test.describe('ParticipantForm', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/#/participants/new')
  })

  test('renders form fields, hints, and desktop action labels', async ({ page }) => {
    const form = getParticipantForm(page)

    await expect(form).toBeVisible()
    await expect(
      page.getByText(
        'Please complete all tournament registration details. You can still edit the data later.'
      )
    ).toBeVisible()
    await expect(page.getByText('Placeholder for field help text.').first()).toBeVisible()
    await expect(page.getByLabel('Given name')).toBeVisible()
    await expect(page.getByLabel('Family name')).toBeVisible()
    await expect(page.getByLabel('Gender')).toBeVisible()
    await expect(page.getByLabel('Date of birth')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Save' })).toContainText('Save')
    await expect(page.getByRole('button', { name: 'Reset' })).toContainText('Reset')
  })

  test('shows gender clear control only after a selection', async ({ page }) => {
    await expect(page.getByRole('combobox', { name: 'Gender' })).toBeVisible()
    await openGenderSelect(page)
    await page.getByRole('option', { name: 'Female' }).click()
    await expect(page.getByRole('button', { name: 'Clear Gender' })).toBeVisible()

    await page.getByRole('button', { name: 'Clear Gender' }).click()
    await expect(page.getByRole('button', { name: 'Clear Gender' })).not.toBeVisible()
  })

  test('includes diverse as a gender option', async ({ page }) => {
    await openGenderSelect(page)
    await expect(page.getByRole('option', { name: 'Diverse' })).toBeVisible()
  })

  test('resets entered values', async ({ page }) => {
    await page.getByLabel('Given name').fill('Yuki')
    await page.getByLabel('Family name').fill('Tanaka')
    await page.getByRole('button', { name: 'Reset' }).click()

    await expect(page.getByLabel('Given name')).toHaveValue('')
    await expect(page.getByLabel('Family name')).toHaveValue('')
  })

  test('shows icon-only action buttons with tooltips on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/#/participants/new')

    const saveButton = page.getByRole('button', { name: 'Save' })
    const resetButton = page.getByRole('button', { name: 'Reset' })

    await expect(saveButton).toBeVisible()
    await expect(resetButton).toBeVisible()
    await expect(saveButton).not.toContainText('Save')
    await expect(resetButton).not.toContainText('Reset')

    await saveButton.hover()
    await expect(page.getByRole('tooltip', { name: 'Save' })).toBeVisible({ timeout: 2_000 })

    await resetButton.hover()
    await expect(page.getByRole('tooltip', { name: 'Reset' })).toBeVisible({ timeout: 2_000 })
  })
})
