import { beforeEach, describe, expect, it, vi } from 'vitest'

import translationKeys from '../i18n/keys'
import { ensureLocalSessionForUsername } from '../service/ensure-local-session-for-username'
import { updateDisplayName } from '../service/update-display-name'
import { useUsernameForm } from './use-username-form'

let onMountedHandler: (() => void) | undefined

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')

  return {
    ...actual,
    onMounted: (callback: () => void) => {
      onMountedHandler = callback
    }
  }
})

vi.mock('@features/authentication/service/local-session-storage', () => ({
  getLocalSessionToken: vi.fn()
}))

vi.mock('@features/authentication/service/resolve-local-auth-session', () => ({
  resolveLocalAuthSession: vi.fn()
}))

vi.mock('../service/ensure-local-session-for-username', () => ({
  ensureLocalSessionForUsername: vi.fn()
}))

vi.mock('../service/update-display-name', () => ({
  updateDisplayName: vi.fn()
}))

describe('useUsernameForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    onMountedHandler = undefined
  })

  async function mountForm() {
    const form = useUsernameForm()
    await onMountedHandler?.()
    return form
  }

  it('loads the display name from user metadata on mount', async () => {
    const { getLocalSessionToken } =
      await import('@features/authentication/service/local-session-storage')
    const { resolveLocalAuthSession } =
      await import('@features/authentication/service/resolve-local-auth-session')

    vi.mocked(getLocalSessionToken).mockReturnValue('token-1')
    vi.mocked(resolveLocalAuthSession).mockResolvedValue({
      user: {
        user_metadata: { full_name: 'Ada Lovelace' }
      }
    } as never)

    const { username, canSave } = await mountForm()

    expect(ensureLocalSessionForUsername).not.toHaveBeenCalled()
    expect(username.value).toBe('Ada Lovelace')
    expect(canSave.value).toBe(false)
  })

  it('falls back to the name metadata field when full_name is missing', async () => {
    const { getLocalSessionToken } =
      await import('@features/authentication/service/local-session-storage')
    const { resolveLocalAuthSession } =
      await import('@features/authentication/service/resolve-local-auth-session')

    vi.mocked(getLocalSessionToken).mockReturnValue('token-1')
    vi.mocked(resolveLocalAuthSession).mockResolvedValue({
      user: { user_metadata: { name: 'Grace Hopper' } }
    } as never)

    const { username } = await mountForm()

    expect(username.value).toBe('Grace Hopper')
  })

  it('falls back to the email prefix when metadata is missing', async () => {
    const { getLocalSessionToken } =
      await import('@features/authentication/service/local-session-storage')
    const { resolveLocalAuthSession } =
      await import('@features/authentication/service/resolve-local-auth-session')

    vi.mocked(getLocalSessionToken).mockReturnValue('token-1')
    vi.mocked(resolveLocalAuthSession).mockResolvedValue({
      user: { email: 'ada@example.com' }
    } as never)

    const { username } = await mountForm()

    expect(username.value).toBe('ada')
  })

  it('returns an empty username when no display fields are available', async () => {
    const { getLocalSessionToken } =
      await import('@features/authentication/service/local-session-storage')
    const { resolveLocalAuthSession } =
      await import('@features/authentication/service/resolve-local-auth-session')

    vi.mocked(getLocalSessionToken).mockReturnValue('token-1')
    vi.mocked(resolveLocalAuthSession).mockResolvedValue({
      user: { user_metadata: {} }
    } as never)

    const { username } = await mountForm()

    expect(username.value).toBe('')
  })

  it('bootstraps a local session when no token exists', async () => {
    const { getLocalSessionToken } =
      await import('@features/authentication/service/local-session-storage')
    const { resolveLocalAuthSession } =
      await import('@features/authentication/service/resolve-local-auth-session')

    vi.mocked(getLocalSessionToken).mockReturnValue(null)
    vi.mocked(ensureLocalSessionForUsername).mockResolvedValue(true)
    vi.mocked(resolveLocalAuthSession).mockResolvedValue(null)

    const { username } = await mountForm()

    expect(ensureLocalSessionForUsername).toHaveBeenCalled()
    expect(username.value).toBe('')
  })

  it('saves an updated display name', async () => {
    const { getLocalSessionToken } =
      await import('@features/authentication/service/local-session-storage')
    const { resolveLocalAuthSession } =
      await import('@features/authentication/service/resolve-local-auth-session')

    vi.mocked(getLocalSessionToken).mockReturnValue('token-1')
    vi.mocked(resolveLocalAuthSession).mockResolvedValue({
      user: { user_metadata: { full_name: 'Ada Lovelace' } }
    } as never)
    vi.mocked(updateDisplayName).mockResolvedValue({
      id: 'user-1',
      displayName: 'Grace Hopper',
      email: null,
      userType: 'local',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-02T00:00:00.000Z'
    })

    const form = await mountForm()
    form.username.value = 'Grace Hopper'

    await form.save()

    expect(updateDisplayName).toHaveBeenCalledWith('Grace Hopper')
    expect(form.username.value).toBe('Grace Hopper')
    expect(form.success.value).toBe(true)
    expect(form.errorCode.value).toBeNull()
    expect(form.loading.value).toBe(false)
  })

  it('sets a save error when persistence fails', async () => {
    const { getLocalSessionToken } =
      await import('@features/authentication/service/local-session-storage')
    const { resolveLocalAuthSession } =
      await import('@features/authentication/service/resolve-local-auth-session')

    vi.mocked(getLocalSessionToken).mockReturnValue('token-1')
    vi.mocked(resolveLocalAuthSession).mockResolvedValue({
      user: { user_metadata: { full_name: 'Ada Lovelace' } }
    } as never)
    vi.mocked(updateDisplayName).mockRejectedValue(new Error('save failed'))

    const form = await mountForm()
    form.username.value = 'Grace Hopper'

    await form.save()

    expect(form.errorCode.value).toBe(translationKeys.error.save)
    expect(form.success.value).toBe(false)
    expect(form.loading.value).toBe(false)
  })

  it('rejects saving an empty username', async () => {
    const { getLocalSessionToken } =
      await import('@features/authentication/service/local-session-storage')
    const { resolveLocalAuthSession } =
      await import('@features/authentication/service/resolve-local-auth-session')

    vi.mocked(getLocalSessionToken).mockReturnValue('token-1')
    vi.mocked(resolveLocalAuthSession).mockResolvedValue({
      user: { user_metadata: { full_name: 'Ada Lovelace' } }
    } as never)

    const form = await mountForm()
    form.username.value = '   '

    await form.save()

    expect(updateDisplayName).not.toHaveBeenCalled()
    expect(form.errorCode.value).toBe(translationKeys.error.empty)
  })

  it('does nothing when saving without changes', async () => {
    const { getLocalSessionToken } =
      await import('@features/authentication/service/local-session-storage')
    const { resolveLocalAuthSession } =
      await import('@features/authentication/service/resolve-local-auth-session')

    vi.mocked(getLocalSessionToken).mockReturnValue('token-1')
    vi.mocked(resolveLocalAuthSession).mockResolvedValue({
      user: { user_metadata: { full_name: 'Ada Lovelace' } }
    } as never)

    const form = await mountForm()

    await form.save()

    expect(updateDisplayName).not.toHaveBeenCalled()
    expect(form.errorCode.value).toBeNull()
  })
})
