import { expect, test } from '@shared/tests/e2e/fixtures'
import { gotoAssociationsPage } from '@shared/tests/e2e/get-association-overview'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('AssociationOverviewActions', { tag: '@regression' }, () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test(
    'renders desktop toolbar with add and update actions',
    { tag: ['@smoke', '@critical'] },
    async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 })
      await gotoAssociationsPage(page)

      const section = page.getByRole('region', { name: 'Associations list' })
      const addButton = section.getByRole('button', { name: 'Add association' })
      const updateButton = section.getByRole('button', { name: 'Update' })

      await expect(addButton).toBeVisible()
      await expect(addButton).toContainText('Add association')
      await expect(updateButton).toBeVisible()
      await expect(updateButton).toContainText('Update')
      await expect(
        section.getByRole('button', { name: 'Filter (not available yet)' })
      ).toBeVisible()
    }
  )

  test('renders mobile toolbar with icon-only add button', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await gotoAssociationsPage(page)

    const section = page.getByRole('region', { name: 'Associations list' })
    const addButton = section.getByRole('button', { name: 'Add association' })

    await expect(addButton).toBeVisible()
    await expect(addButton).toHaveAttribute('aria-label', 'Add association')
    await expect(addButton).not.toContainText('Add association')
  })

  test(
    'navigates to the create form when add is clicked',
    { tag: '@critical' },
    async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 })
      await gotoAssociationsPage(page)

      await page.getByRole('button', { name: 'Add association' }).click()
      await expect(page).toHaveURL(/#\/associations\/new$/, { timeout: 10_000 })
    }
  )
})
