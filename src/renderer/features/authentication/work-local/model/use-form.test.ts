import { nextTick } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useLocalWorkForm } from './use-form'

const signInLocallyMock = vi.fn()
const navigateToDashboardMock = vi.fn()
const pushMock = vi.fn()

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

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock })
}))

vi.mock('@shared/lib', () => ({
  useTranslation: () => ({ t: (key: string) => key })
}))

vi.mock('@features/authentication/service/navigate-to-dashboard', () => ({
  navigateToDashboard: (...args: unknown[]) => navigateToDashboardMock(...args)
}))

vi.mock('../service/sign-in-locally', () => ({
  signInLocally: (...args: unknown[]) => signInLocallyMock(...args)
}))

describe('useLocalWorkForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    onMountedHandler = undefined
    globalThis.window.api = {
      getUsers: vi.fn(),
      addUser: vi.fn(),
      getLocalSession: vi.fn(),
      revokeLocalSession: vi.fn(),
      dbHealthcheck: vi.fn(),
      getOsUsername: vi.fn().mockResolvedValue('TestUser')
    }
  })

  it('prefills the display name from the operating system on mount', async () => {
    const form = useLocalWorkForm()

    onMountedHandler?.()
    await nextTick()

    expect(globalThis.window.api.getOsUsername).toHaveBeenCalled()
    expect(form.displayName.value).toBe('TestUser')
  })

  it('clears the display name when os username lookup fails', async () => {
    vi.mocked(globalThis.window.api.getOsUsername).mockRejectedValue(new Error('boom'))

    const form = useLocalWorkForm()
    onMountedHandler?.()
    await nextTick()

    expect(form.displayName.value).toBe('')
  })

  it('does not submit when already loading or form ref is missing', async () => {
    const form = useLocalWorkForm()
    form.loading.value = true

    await form.submit()
    expect(signInLocallyMock).not.toHaveBeenCalled()

    form.loading.value = false
    await form.submit()
    expect(signInLocallyMock).not.toHaveBeenCalled()
  })

  it('stops submit when validation fails', async () => {
    const form = useLocalWorkForm()
    form.setFormRef({
      validate: vi.fn().mockResolvedValue({ valid: false })
    })

    await form.submit()

    expect(signInLocallyMock).not.toHaveBeenCalled()
    expect(navigateToDashboardMock).not.toHaveBeenCalled()
  })

  it('navigates to dashboard after successful local sign-in', async () => {
    signInLocallyMock.mockResolvedValue(true)

    const form = useLocalWorkForm()
    form.displayName.value = 'Ada Lovelace'
    form.setFormRef({
      validate: vi.fn().mockResolvedValue({ valid: true })
    })

    await form.submit()

    expect(signInLocallyMock).toHaveBeenCalledWith('Ada Lovelace')
    expect(navigateToDashboardMock).toHaveBeenCalled()
    expect(form.loading.value).toBe(false)
  })

  it('does not navigate when local sign-in fails', async () => {
    signInLocallyMock.mockResolvedValue(false)

    const form = useLocalWorkForm()
    form.displayName.value = 'Ada Lovelace'
    form.setFormRef({
      validate: vi.fn().mockResolvedValue({ valid: true })
    })

    await form.submit()

    expect(navigateToDashboardMock).not.toHaveBeenCalled()
    expect(form.loading.value).toBe(false)
  })

  it('translates validation rules for non-string values', () => {
    const form = useLocalWorkForm()
    const requiredRule = form.translatedDisplayNameRules[0]!
    const minLettersRule = form.translatedDisplayNameRules[1]!

    expect(requiredRule(123)).toBe(false)
    expect(requiredRule('Ada')).toBe(true)
    expect(minLettersRule('ab')).toBe('auth.workLocal.displayName.validation.minLetters')
  })

  it('computes submit disabled state from loading, validity, and display name', async () => {
    const form = useLocalWorkForm()

    form.loading.value = true
    expect(form.isSubmitDisabled.value).toBe(true)

    form.loading.value = false
    form.isFormValid.value = false
    form.displayName.value = ''
    expect(form.isSubmitDisabled.value).toBe(true)

    form.displayName.value = 'Ada'
    expect(form.isSubmitDisabled.value).toBe(false)

    form.displayName.value = ''
    form.isFormValid.value = true
    expect(form.isSubmitDisabled.value).toBe(false)
  })
})
