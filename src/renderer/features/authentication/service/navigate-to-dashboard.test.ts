import { describe, expect, it, vi } from 'vitest'

import { navigateToDashboard } from './navigate-to-dashboard'

describe('navigateToDashboard', () => {
  it('navigates to dashboard by default', async () => {
    const push = vi.fn()

    await navigateToDashboard({ push } as never)

    expect(push).toHaveBeenCalledWith({ name: 'dashboard' })
  })

  it('navigates to a safe redirect path when provided', async () => {
    const push = vi.fn()

    await navigateToDashboard({ push } as never, { query: { redirect: '/settings' } })

    expect(push).toHaveBeenCalledWith('/settings')
  })

  it('falls back to dashboard for unsafe redirect values', async () => {
    const push = vi.fn()

    await navigateToDashboard({ push } as never, { query: { redirect: '//evil.example' } })

    expect(push).toHaveBeenCalledWith({ name: 'dashboard' })
  })
})
