import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useLoginRouting } from './use-login-routing'

const pushMock = vi.fn()
const routeQuery = { redirect: undefined as unknown }

vi.mock('vue-router', () => ({
  useRoute: () => ({ query: routeQuery }),
  useRouter: () => ({ push: pushMock })
}))

describe('useLoginRouting', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    routeQuery.redirect = undefined
  })

  describe('navigateAfterLoginSuccess', () => {
    it('navigates to redirect when it is a safe internal path', async () => {
      routeQuery.redirect = '/dashboard'
      const { navigateAfterLoginSuccess } = useLoginRouting()

      await navigateAfterLoginSuccess()

      expect(pushMock).toHaveBeenCalledWith('/dashboard')
    })

    it('falls back to root for invalid redirect values', async () => {
      routeQuery.redirect = '//evil.example'
      const { navigateAfterLoginSuccess } = useLoginRouting()

      await navigateAfterLoginSuccess()

      expect(pushMock).toHaveBeenCalledWith('/')
    })

    it('falls back to root when redirect is not a string', async () => {
      routeQuery.redirect = ['not-allowed']
      const { navigateAfterLoginSuccess } = useLoginRouting()

      await navigateAfterLoginSuccess()

      expect(pushMock).toHaveBeenCalledWith('/')
    })
  })

  describe('goToPasswordReset', () => {
    it('navigates to password reset without query if email is missing', async () => {
      const { goToPasswordReset } = useLoginRouting()

      await goToPasswordReset()

      expect(pushMock).toHaveBeenCalledWith({ name: 'passwordreset' })
    })

    it('navigates to password reset without query if email is empty', async () => {
      const { goToPasswordReset } = useLoginRouting()

      await goToPasswordReset('')

      expect(pushMock).toHaveBeenCalledWith({ name: 'passwordreset' })
    })

    it('navigates to password reset with email query when provided', async () => {
      const { goToPasswordReset } = useLoginRouting()

      await goToPasswordReset('user@mail.com')

      expect(pushMock).toHaveBeenCalledWith({
        name: 'passwordreset',
        query: { email: 'user@mail.com' }
      })
    })
  })
})
