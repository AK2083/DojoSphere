import { expect, test } from '@shared/tests/e2e/fixtures'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('AssociationFormPage', { tag: '@regression' }, () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
    await page.setViewportSize({ width: 1280, height: 800 })
  })

  test(
    'renders create page shell with back link and form',
    { tag: ['@smoke', '@critical'] },
    async ({ page }) => {
      await page.goto('/#/associations/new')

      await expect(page).toHaveURL(/#\/associations\/new$/)
      await expect(
        page.getByRole('heading', { name: 'Add association', exact: true })
      ).toBeVisible()
      await expect(
        page.getByRole('link', { name: 'Back to association list', exact: true })
      ).toBeVisible()
      await expect(page.getByRole('form', { name: 'Association form' })).toBeVisible()
    }
  )
})
