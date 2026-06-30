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

import { gotoParticipantsPage } from './get-participant-overview'

function createPageDouble() {
  const goto = vi.fn().mockResolvedValue(undefined)

  const page = {
    goto,
    getByRole: vi.fn().mockReturnValue({}),
    getByText: vi.fn().mockReturnValue({})
  }

  return { page, goto }
}

describe('get-participant-overview e2e helpers', () => {
  it('opens participants route and waits for static rows', async () => {
    const { page, goto } = createPageDouble()

    await gotoParticipantsPage(page as never)

    expect(goto).toHaveBeenCalledWith('/#/participants')
    expect(page.getByRole).toHaveBeenCalledWith('region', { name: 'Participants table' })
    expect(page.getByText).toHaveBeenCalledWith('Yuki')
    expect(playwrightExpect).toHaveBeenCalledTimes(3)
  })
})
