import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const createClientMock = vi.fn(() => ({ mockClient: true }))

vi.mock('@supabase/supabase-js', () => ({
  createClient: createClientMock
}))

describe('supabase client', () => {
  beforeEach(() => {
    vi.resetModules()
    globalThis.localStorage.clear()

    vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co')
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', 'test-key')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('creates supabase client with configured app storage key', async () => {
    const { supabase } = await import('./client')

    expect(createClientMock).toHaveBeenCalledWith('https://test.supabase.co', 'test-key', {
      auth: {
        storageKey: 'dojosphere.auth.session',
        debug: false
      }
    })

    expect(supabase).toEqual({ mockClient: true })
  })
})
