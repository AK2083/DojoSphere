import { expect, test } from '@shared/tests/e2e/fixtures'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

async function uploadStubWorkbookAndOpenMapping(page: Parameters<typeof setEnglishLanguage>[0]) {
  await page.getByLabel('Select Excel file for import').setInputFiles({
    name: 'participants.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer: globalThis.Buffer.from('stub')
  })

  // File select auto-advances to mapping after preview; wait so "Next" starts the import.
  await expect(
    page.locator('.import-step-section').getByText('Map columns', { exact: true })
  ).toBeVisible({
    timeout: 10_000
  })
  await expect(page.getByRole('button', { name: 'Next step' })).toBeEnabled()
}

async function startImportFromMapping(page: Parameters<typeof setEnglishLanguage>[0]) {
  await page.getByRole('button', { name: 'Next step' }).click()
  await expect(page.getByRole('button', { name: 'Finish import' })).toBeVisible({
    timeout: 10_000
  })
}

test.describe('ImportProgressStep', { tag: '@regression' }, () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
    await page.goto('/#/participants/import')
    await expect(page.getByRole('heading', { name: 'Import participants' })).toBeVisible()
    await uploadStubWorkbookAndOpenMapping(page)
    await startImportFromMapping(page)
  })

  test(
    'renders imported participant results and a completion message',
    { tag: '@smoke' },
    async ({ page }) => {
      await expect(page.getByText('Yuki Tanaka')).toBeVisible()
      await expect(page.getByLabel('Yuki Tanaka imported successfully')).toBeVisible()
      await expect(page.getByText('Import complete.')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Finish import' })).toBeVisible()
    }
  )

  test(
    'returns to participant list when finish is clicked',
    { tag: '@critical' },
    async ({ page }) => {
      await page.getByRole('button', { name: 'Finish import' }).click()
      await expect(page).toHaveURL(/#\/participants$/, { timeout: 10_000 })
    }
  )
})
