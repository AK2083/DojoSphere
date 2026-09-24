import { expect, test } from '@shared/tests/e2e/fixtures'
import { gotoAssociationsPage } from '@shared/tests/e2e/get-association-overview'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('AssociationsPage', { tag: '@regression' }, () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test(
    'renders page heading and associations list region',
    { tag: ['@smoke', '@critical'] },
    async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 })
      await gotoAssociationsPage(page)

      await expect(page.getByRole('heading', { name: 'Associations', exact: true })).toBeVisible()
      await expect(page.getByRole('region', { name: 'Associations list' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Add association' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Update' })).toBeVisible()
    }
  )

  test('renders associations toolbar on narrow viewports', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await gotoAssociationsPage(page)

    await expect(page.getByRole('heading', { name: 'Associations', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Add association' })).toBeVisible()
  })

  test(
    'navigates to the create form when add is clicked',
    { tag: '@critical' },
    async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 })
      await gotoAssociationsPage(page)

      await page.getByRole('button', { name: 'Add association' }).click()
      await expect(page).toHaveURL(/#\/associations\/new$/, { timeout: 10_000 })
      await expect(
        page.getByRole('heading', { name: 'Add association', exact: true })
      ).toBeVisible()
    }
  )
})
