import { describe, expect, it, vi } from 'vitest'

const { playwrightExpect } = vi.hoisted(() => ({
  playwrightExpect: vi.fn(() => ({
    toHaveURL: vi.fn().mockResolvedValue(undefined),
    toBeVisible: vi.fn().mockResolvedValue(undefined)
  }))
}))

vi.mock('@playwright/test', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@playwright/test')>()
  return {
    ...actual,
    expect: playwrightExpect
  }
})

import { gotoHashRoute } from './navigation'

function createPageDouble(options: { failUntilAttempt?: number } = {}) {
  let attempt = 0
  const goto = vi.fn().mockResolvedValue(undefined)
  const reload = vi.fn().mockResolvedValue(undefined)
  const first = vi.fn().mockReturnValue({})

  const page = {
    goto,
    reload,
    locator: vi.fn().mockReturnValue({ first }),
    url: () => 'http://127.0.0.1:4173/#/login'
  }

  playwrightExpect.mockImplementation(() => {
    attempt += 1
    const shouldFail = options.failUntilAttempt !== undefined && attempt < options.failUntilAttempt

    return {
      toHaveURL: vi.fn().mockImplementation(async () => {
        if (shouldFail) {
          throw new Error('route not ready')
        }
      }),
      toBeVisible: vi.fn().mockResolvedValue(undefined)
    }
  })

  return { page, goto, reload }
}

describe('gotoHashRoute', () => {
  it('navigates to the requested hash route', async () => {
    const { page, goto } = createPageDouble()

    await gotoHashRoute(page as never, '/#/login', 'input[autocomplete="email"]')

    expect(goto).toHaveBeenCalledWith('/#/login', { waitUntil: 'domcontentloaded' })
    expect(page.locator).toHaveBeenCalledWith('input[autocomplete="email"]')
  })

  it('retries navigation when the route is not ready yet', async () => {
    const { page, goto, reload } = createPageDouble({ failUntilAttempt: 2 })

    await gotoHashRoute(page as never, '/#/login')

    expect(goto).toHaveBeenCalledTimes(2)
    expect(reload).toHaveBeenCalledTimes(1)
  })

  it('throws after three failed navigation attempts', async () => {
    const { page } = createPageDouble({ failUntilAttempt: 4 })

    await expect(gotoHashRoute(page as never, '/#/login')).rejects.toThrow('route not ready')
  })
})
