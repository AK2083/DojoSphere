import { beforeEach, describe, expect, it, vi } from 'vitest'

const createClientMock = vi.fn(() => ({ mockClient: true }))

vi.mock('@supabase/supabase-js', () => ({
  createClient: createClientMock
}))

describe('supabase client', () => {
  beforeEach(() => {
    vi.resetModules()

    import.meta.env.VITE_SUPABASE_URL = 'https://test.supabase.co'
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY = 'test-key'
  })

  it('creates supabase client with correct env variables', async () => {
    const { supabase } = await import('./client')

    expect(createClientMock).toHaveBeenCalledWith('https://test.supabase.co', 'test-key')

    expect(supabase).toEqual({ mockClient: true })
  })
})
