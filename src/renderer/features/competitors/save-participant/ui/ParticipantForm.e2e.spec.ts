import { expect, test } from '@shared/tests/e2e/fixtures'
import {
  chooseParticipantSelectOption,
  getParticipantForm,
  gotoParticipantCreateForm,
  openParticipantSelect
} from '@shared/tests/e2e/participant-form'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('ParticipantForm', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
    await page.setViewportSize({ width: 1280, height: 800 })
    await gotoParticipantCreateForm(page)
  })

  test('renders form fields and desktop action labels', async ({ page }) => {
    const form = getParticipantForm(page)

    await expect(form).toBeVisible()
    await expect(
      page.getByText(
        'Please complete all required tournament registration details. You can still edit the data later.'
      )
    ).toBeVisible()
    await expect(page.getByText('Fields marked with * are required.')).toBeVisible()
    await expect(page.getByLabel('Given name')).toBeVisible()
    await expect(page.getByLabel('Family name')).toBeVisible()
    await expect(page.getByLabel('Gender')).toBeVisible()
    await expect(page.getByLabel('Date of birth')).toBeVisible()
    await expect(page.getByLabel('Club')).toBeVisible()
    await expect(page.getByLabel('Nationality')).toBeVisible()
    await expect(page.getByLabel('Age class')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Save' })).toContainText('Save')
    await expect(page.getByRole('button', { name: 'Reset' })).toContainText('Reset')
    await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled()
  })

  test('includes diverse as a gender option', async ({ page }) => {
    await openParticipantSelect(page, 'Gender')
    await expect(page.getByRole('option', { name: 'Diverse' })).toBeVisible()
  })

  test('shows weight classes after selecting a fixed age class', async ({ page }) => {
    await openParticipantSelect(page, 'Age class')
    await chooseParticipantSelectOption(page, 'Boys U15')

    await expect(page.getByLabel('Weight class')).toBeVisible()
    await openParticipantSelect(page, 'Weight class')
    await expect(page.getByRole('option', { name: 'Up to 60 kg' })).toBeVisible()
  })

  test('shows flexible weight hint for flexible age classes', async ({ page }) => {
    await openParticipantSelect(page, 'Age class')
    await chooseParticipantSelectOption(page, 'Boys U10 (flexible weights)')

    await expect(
      page.getByText(
        'This age class uses flexible weights. Weight class selection is not required for registration.'
      )
    ).toBeVisible()
    await expect(page.getByLabel('Weight class')).not.toBeVisible()
  })

  test('resets entered values', async ({ page }) => {
    await page.getByLabel('Given name').fill('Yuki')
    await page.getByLabel('Family name').fill('Tanaka')
    await page.getByRole('button', { name: 'Reset' }).click()

    await expect(page.getByLabel('Given name')).toHaveValue('')
    await expect(page.getByLabel('Family name')).toHaveValue('')
  })

  test('shows icon-only action buttons with accessible labels on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await gotoParticipantCreateForm(page)

    const form = getParticipantForm(page)
    const saveButton = form.getByRole('button', { name: 'Save' })
    const resetButton = form.getByRole('button', { name: 'Reset' })

    await expect(saveButton).toBeVisible()
    await expect(resetButton).toBeVisible()
    await expect(saveButton).toHaveAttribute('aria-label', 'Save')
    await expect(resetButton).toHaveAttribute('aria-label', 'Reset')
    await expect(saveButton).not.toContainText('Save')
    await expect(resetButton).not.toContainText('Reset')
  })
})
