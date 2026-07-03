import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getCurrentSession } from '../service/get-current-session'
import { hasUserPermission } from '../service/has-user-permission'
import { onLocalAuthStateChanged } from '../service/local-auth-state'
import { useParticipantsOverviewAccess } from './use-participants-overview-access'

let onMountedHandler: (() => void) | undefined
let onUnmountedHandler: (() => void) | undefined

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')

  return {
    ...actual,
    onMounted: (callback: () => void) => {
      onMountedHandler = callback
    },
    onUnmounted: (callback: () => void) => {
      onUnmountedHandler = callback
    }
  }
})

vi.mock('../service/has-user-permission', () => ({
  hasUserPermission: vi.fn()
}))

vi.mock('../service/get-current-session', () => ({
  getCurrentSession: vi.fn()
}))

vi.mock('../service/local-auth-state', () => ({
  onLocalAuthStateChanged: vi.fn(() => () => undefined)
}))

describe('useParticipantsOverviewAccess', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    onMountedHandler = undefined
    onUnmountedHandler = undefined
  })

  it('loads access on mount and refreshes on local auth changes', async () => {
    const unsubscribe = vi.fn()
    let localAuthCallback: ((session: null) => void) | undefined

    vi.mocked(getCurrentSession).mockResolvedValue({
      user: { id: 'user-1' }
    } as never)
    vi.mocked(hasUserPermission).mockResolvedValue(true)
    vi.mocked(onLocalAuthStateChanged).mockImplementation((callback) => {
      localAuthCallback = callback
      return unsubscribe
    })

    const { canReadParticipantsOverview } = useParticipantsOverviewAccess()

    expect(canReadParticipantsOverview.value).toBe(false)
    expect(onMountedHandler).toBeDefined()

    onMountedHandler?.()
    await vi.waitFor(() => {
      expect(hasUserPermission).toHaveBeenCalledWith('participants-overview', 'read')
    })
    expect(canReadParticipantsOverview.value).toBe(true)

    vi.mocked(hasUserPermission).mockResolvedValue(false)
    localAuthCallback?.(null)
    await vi.waitFor(() => {
      expect(hasUserPermission).toHaveBeenCalledTimes(2)
    })
    expect(canReadParticipantsOverview.value).toBe(false)

    expect(onUnmountedHandler).toBeDefined()
    onUnmountedHandler?.()

    expect(unsubscribe).toHaveBeenCalledTimes(1)
  })

  it('skips permission checks when no session is active', async () => {
    vi.mocked(getCurrentSession).mockResolvedValue(null)

    const { canReadParticipantsOverview } = useParticipantsOverviewAccess()

    onMountedHandler?.()
    await Promise.resolve()

    expect(hasUserPermission).not.toHaveBeenCalled()
    expect(canReadParticipantsOverview.value).toBe(false)
  })

  it('does not fail on unmount when no local auth subscription exists yet', () => {
    useParticipantsOverviewAccess()

    expect(onUnmountedHandler).toBeDefined()
    onUnmountedHandler?.()
  })
})
