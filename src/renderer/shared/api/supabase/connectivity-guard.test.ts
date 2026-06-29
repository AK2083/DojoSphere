import { ref } from 'vue'
import { bindConnectivityState } from '@shared/model/connectivity-state'
import { afterEach, describe, expect, it } from 'vitest'

import { createSupabaseUnreachableAuthError, isSupabaseRequestAllowed } from './connectivity-guard'

describe('connectivity-guard', () => {
  afterEach(() => {
    bindConnectivityState({
      isOnline: ref(true),
      isCloudUsed: ref(true),
      isSupabaseReachable: ref(true)
    })
  })

  it('blocks requests when Supabase is unreachable', () => {
    bindConnectivityState({
      isOnline: ref(false),
      isCloudUsed: ref(true),
      isSupabaseReachable: ref(false)
    })

    expect(isSupabaseRequestAllowed()).toBe(false)
  })

  it('creates a retryable auth error for blocked requests', () => {
    const error = createSupabaseUnreachableAuthError()

    expect(error.status).toBe(0)
    expect(error.code).toBe('network_error')
    expect(error.message).toContain('Failed to fetch')
    expect(error.toJSON()).toEqual({})
  })
})
