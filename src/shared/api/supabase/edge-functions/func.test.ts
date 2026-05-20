import { beforeEach, describe, expect, it, vi } from 'vitest'

import { supabase } from '../client'
import { heartbeat } from './func'

vi.mock('../client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn()
    }
  }
}))

describe('heartbeat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('invokes heartbeat function with expected payload', async () => {
    const response = {
      data: { status: 'ok', timestamp: '2026-05-20T13:00:00.000Z' },
      error: null
    }

    vi.mocked(supabase.functions.invoke).mockResolvedValue(response as never)

    const result = await heartbeat()

    expect(supabase.functions.invoke).toHaveBeenCalledWith('heartbeat', {
      body: { name: 'Functions' }
    })
    expect(result).toStrictEqual(response)
  })
})
