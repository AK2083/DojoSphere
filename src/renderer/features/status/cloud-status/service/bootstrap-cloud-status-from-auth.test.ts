import { watchAuthState } from '@features/authentication/api/watch-auth-state'
import { isLocalAuthSession } from '@features/authentication/service/is-local-auth-session'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCloudStatusStore } from '../store/use-cloud-status-store'
import {
  bootstrapCloudStatusFromAuth,
  syncCloudUsageFromAuthSession
} from './bootstrap-cloud-status-from-auth'
import { hasSupabaseAuthSessionInStorage } from './cloud-status-storage'

vi.mock('@features/authentication/service/is-local-auth-session', () => ({
  isLocalAuthSession: vi.fn(() => false)
}))

vi.mock('@features/authentication/api/watch-auth-state', () => ({
  watchAuthState: vi.fn()
}))

vi.mock('./cloud-status-storage', () => ({
  hasSupabaseAuthSessionInStorage: vi.fn(() => false)
}))

describe('syncCloudUsageFromAuthSession', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('marks cloud usage active for supabase sessions', () => {
    syncCloudUsageFromAuthSession({
      user: { id: 'user-1', app_metadata: { provider: 'email' } }
    } as never)

    expect(useCloudStatusStore().isCloudUsed).toBe(true)
  })

  it('marks cloud usage inactive for local sessions', () => {
    vi.mocked(isLocalAuthSession).mockReturnValue(true)

    syncCloudUsageFromAuthSession({
      user: { id: 'user-1', app_metadata: { provider: 'local' } }
    } as never)

    expect(useCloudStatusStore().isCloudUsed).toBe(false)
  })

  it('marks cloud usage inactive when session is null and storage is empty', () => {
    useCloudStatusStore().setCloudUsed(true)

    syncCloudUsageFromAuthSession(null)

    expect(useCloudStatusStore().isCloudUsed).toBe(false)
  })

  it('keeps cloud usage active when session is null but supabase storage has a token', () => {
    vi.mocked(hasSupabaseAuthSessionInStorage).mockReturnValue(true)
    useCloudStatusStore().setCloudUsed(false)

    syncCloudUsageFromAuthSession(null)

    expect(useCloudStatusStore().isCloudUsed).toBe(true)
  })
})

describe('bootstrapCloudStatusFromAuth', () => {
  beforeEach(() => {
    vi.mocked(hasSupabaseAuthSessionInStorage).mockReturnValue(false)
    setActivePinia(createPinia())
  })

  it('subscribes to auth state changes and returns unsubscribe', () => {
    const unsubscribe = vi.fn()
    let authCallback: ((state: { session: null }) => void) | undefined

    vi.mocked(watchAuthState).mockImplementation((callback) => {
      authCallback = callback as (state: { session: null }) => void
      return { unsubscribe } as never
    })

    const stop = bootstrapCloudStatusFromAuth()

    authCallback?.({ session: null })
    expect(useCloudStatusStore().isCloudUsed).toBe(false)

    stop()
    expect(unsubscribe).toHaveBeenCalledTimes(1)
  })
})
