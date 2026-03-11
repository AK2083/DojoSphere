import { describe, it, expect, vi } from 'vitest'
import { register } from './register-service'
import { registerUser } from '@shared/api'
import type { AuthSession, AuthUser } from '@shared/types/auth'

vi.mock('@shared/api', () => ({
  registerUser: vi.fn()
}))

describe('register', () => {
  it('calls registerUser with email and password', async () => {
    const mockResponse: { user: AuthUser | null; session: AuthSession | null } =
      {
        user: { id: '123' } as AuthUser,
        session: null
      }

    vi.mocked(registerUser).mockResolvedValue(mockResponse)

    const result = await register('test@test.de', 'password123')

    expect(registerUser).toHaveBeenCalledWith('test@test.de', 'password123')

    expect(result).toEqual(mockResponse)
  })

  it('throws error when registerUser fails', async () => {
    const error = new Error('User already exists')

    vi.mocked(registerUser).mockRejectedValue(error)

    await expect(register('test@test.de', 'password123')).rejects.toThrow(
      'User already exists'
    )
  })
})
