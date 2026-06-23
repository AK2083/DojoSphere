import { beforeEach, describe, expect, it, vi } from 'vitest'

const { setEnglishLanguage } = vi.hoisted(() => ({
  setEnglishLanguage: vi.fn()
}))

const { mockHeartbeatSuccess } = vi.hoisted(() => ({
  mockHeartbeatSuccess: vi.fn()
}))

type PageFixture = (
  args: { page: { route: ReturnType<typeof vi.fn> } },
  use: (page: { route: ReturnType<typeof vi.fn> }) => Promise<void>
) => Promise<void>

const { capturedPageFixture } = vi.hoisted(() => ({
  capturedPageFixture: { current: undefined as PageFixture | undefined }
}))

vi.mock('./setup-language', () => ({
  setEnglishLanguage
}))

vi.mock('./setup-login-available', () => ({
  mockHeartbeatSuccess
}))

vi.mock('@playwright/test', () => ({
  expect: vi.fn(),
  test: {
    extend: vi.fn((fixtures: { page: PageFixture }) => {
      capturedPageFixture.current = fixtures.page

      return {
        extend: vi.fn()
      }
    })
  }
}))

describe('e2e fixtures', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules()
    capturedPageFixture.current = undefined
    await import('./fixtures')
  })

  it('registers page defaults for language and heartbeat reachability', async () => {
    expect(capturedPageFixture.current).toBeTypeOf('function')

    const use = vi.fn()
    const page = { route: vi.fn() }

    await capturedPageFixture.current!({ page }, use)

    expect(setEnglishLanguage).toHaveBeenCalledWith(page)
    expect(mockHeartbeatSuccess).toHaveBeenCalledWith(page)
    expect(use).toHaveBeenCalledWith(page)
  })
})
