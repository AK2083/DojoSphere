import { expect, test } from '@shared/tests/e2e/fixtures'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('ParticipantFormPage', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
    await page.setViewportSize({ width: 1280, height: 800 })
  })

  test('renders create page shell with back link and form', async ({ page }) => {
    await page.goto('/#/participants/new')

    await expect(page).toHaveURL(/#\/participants\/new$/)
    await expect(page.getByRole('heading', { name: 'Add participant', exact: true })).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Back to participant list', exact: true })
    ).toBeVisible()
    await expect(page.getByRole('form', { name: 'Participant form' })).toBeVisible()
  })

  test('renders edit page shell with back link and form', async ({ page }) => {
    await page.goto('/#/participants/participant-1/edit')

    await expect(page).toHaveURL(/#\/participants\/participant-1\/edit$/)
    await expect(page.getByRole('heading', { name: 'Edit participant', exact: true })).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Back to participant list', exact: true })
    ).toBeVisible()
    await expect(page.getByRole('form', { name: 'Participant form' })).toBeVisible()
  })
})
