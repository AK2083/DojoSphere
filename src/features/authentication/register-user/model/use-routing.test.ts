import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useRegisterRouting } from './use-routing'

const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock })
}))

describe('useRegisterRouting', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('navigates to email verification with email query', async () => {
    const { navigateAfterRegisterSuccess } = useRegisterRouting()

    await navigateAfterRegisterSuccess('user@mail.com')

    expect(pushMock).toHaveBeenCalledWith({
      name: 'emailverification',
      query: { email: 'user@mail.com' }
    })
  })
})
