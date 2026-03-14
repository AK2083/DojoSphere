import { registerUser } from '@shared/api/supabase/user'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'
import { register } from './user-access'

vi.mock('@shared/api/supabase/user', () => ({
  registerUser: vi.fn()
}))

vi.mock('../monitoring/monitoring', () => ({
  monitorInformation: vi.fn(),
  MONITORING_EVENTS: {
    AUTH_REGISTER_SUBMITTED: 'AUTH_REGISTER_SUBMITTED'
  }
}))

describe('register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('logs monitoring event and calls registerUser', async () => {
    const mockResult = {
      user: null,
      session: null
    }

    vi.mocked(registerUser).mockResolvedValue(mockResult)

    const result = await register('test@test.com', 'password')

    expect(monitorInformation).toHaveBeenCalledWith(MONITORING_EVENTS.AUTH_REGISTER_SUBMITTED)

    expect(registerUser).toHaveBeenCalledWith('test@test.com', 'password')

    expect(result).toEqual(mockResult)
  })
})
