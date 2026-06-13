import type { AuthSession } from '@shared/types'
import { describe, expect, it, vi } from 'vitest'

import { notifyLocalAuthStateChanged, onLocalAuthStateChanged } from './local-auth-state'

describe('local-auth-state', () => {
  it('notifies subscribers and supports unsubscribe', () => {
    const session = { user: { id: 'local-user' } } as AuthSession
    const listener = vi.fn()
    const unsubscribe = onLocalAuthStateChanged(listener)

    notifyLocalAuthStateChanged(session)
    notifyLocalAuthStateChanged(null)

    expect(listener).toHaveBeenNthCalledWith(1, session)
    expect(listener).toHaveBeenNthCalledWith(2, null)

    unsubscribe()
    listener.mockClear()

    notifyLocalAuthStateChanged(session)

    expect(listener).not.toHaveBeenCalled()
  })
})
