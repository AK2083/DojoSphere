import { expect, test } from '@shared/tests/e2e/fixtures'

test.describe('AudienceOverview', () => {
  test('loads without authentication and does not call audit IPC', async ({ page }) => {
    await page.addInitScript(() => {
      const api = globalThis.window.api

      if (!api) {
        return
      }

      const originalAuditRecord = api.auditRecord.bind(api)
      api.auditRecord = async (...args) => {
        ;(globalThis as { __auditCallCount?: number }).__auditCallCount =
          ((globalThis as { __auditCallCount?: number }).__auditCallCount ?? 0) + 1
        return originalAuditRecord(...args)
      }
    })

    await page.goto('/#/audience')

    await expect(page).toHaveURL(/#\/audience$/)
    await expect(page.getByText('Tournament overview')).toBeVisible()

    const auditCallCount = await page.evaluate(
      () => (globalThis as { __auditCallCount?: number }).__auditCallCount ?? 0
    )

    expect(auditCallCount).toBe(0)
  })
})
