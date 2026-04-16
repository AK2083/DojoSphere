import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const createClientMock = vi.fn(() => ({ mockClient: true }))

vi.mock('@supabase/supabase-js', () => ({
  createClient: createClientMock
}))

describe('supabase client', () => {
  beforeEach(() => {
    vi.resetModules()

    vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co')
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', 'test-key')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('creates supabase client with correct env variables', async () => {
    const { supabase } = await import('./client')

    expect(createClientMock).toHaveBeenCalledWith('https://test.supabase.co', 'test-key')

    expect(supabase).toEqual({ mockClient: true })
  })
})
