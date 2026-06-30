import { expect, test } from '@shared/tests/e2e/fixtures'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('participant form page', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('renders empty form for create', async ({ page }) => {
    await page.goto('/#/participants/new')

    await expect(page).toHaveURL(/#\/participants\/new$/)
    await expect(page.getByRole('heading', { name: 'Add participant', exact: true })).toBeVisible()
    await expect(page.getByRole('form', { name: 'Participant form' })).toBeVisible()
    await expect(
      page.getByText(
        'Please complete all tournament registration details. You can still edit the data later.'
      )
    ).toBeVisible()
    await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible()
    await expect(page.getByText('Placeholder for field help text.').first()).toBeVisible()
    await expect(page.getByLabel('Given name')).toHaveValue('')
    await expect(page.getByLabel('Family name')).toHaveValue('')
  })

  test('renders empty form for edit', async ({ page }) => {
    await page.goto('/#/participants/participant-1/edit')

    await expect(page).toHaveURL(/#\/participants\/participant-1\/edit$/)
    await expect(page.getByRole('heading', { name: 'Edit participant', exact: true })).toBeVisible()
    await expect(page.getByRole('form', { name: 'Participant form' })).toBeVisible()
    await expect(
      page.getByText(
        'Please complete all tournament registration details. You can still edit the data later.'
      )
    ).toBeVisible()
    await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible()
    await expect(page.getByText('Placeholder for field help text.').first()).toBeVisible()
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
