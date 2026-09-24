import { expect, test } from '@shared/tests/e2e/fixtures'
import {
  getAssociationForm,
  gotoAssociationCreateForm
} from '@shared/tests/e2e/get-association-overview'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('AssociationForm', { tag: '@regression' }, () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
    await page.setViewportSize({ width: 1280, height: 800 })
    await gotoAssociationCreateForm(page)
  })

  test(
    'renders form fields and desktop action labels',
    { tag: ['@smoke', '@critical'] },
    async ({ page }) => {
      const form = getAssociationForm(page)

      await expect(form).toBeVisible()
      await expect(
        page.getByText(
          'Please fill in the association details. Fields marked with * are required; you can still edit the data later.'
        )
      ).toBeVisible()
      await expect(form.getByLabel('Name')).toBeVisible()
      await expect(form.getByLabel('Registry number')).toBeVisible()
      await expect(form.getByLabel('Email address')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Save' })).toContainText('Save')
      await expect(page.getByRole('button', { name: 'Reset' })).toContainText('Reset')
    }
  )

  test('shows icon-only action buttons with accessible labels on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await gotoAssociationCreateForm(page)

    const form = getAssociationForm(page)
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
