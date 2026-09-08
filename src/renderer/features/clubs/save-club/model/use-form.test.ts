import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CLUB_MOCK_DATA } from '../../get-club-overview/model/club-mock-data'
import { createEmptyClubForm } from './club-form-state'
import { useClubForm } from './use-form'

const pushMock = vi.fn()
const createClubMock = vi.fn()
const updateClubMock = vi.fn()
const loadClubMock = vi.fn()
const logErrorMock = vi.fn()
let routerValue: { push: typeof pushMock } | undefined
let onMountedHandler: (() => void | Promise<void>) | undefined

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')

  return {
    ...actual,
    onMounted: (callback: () => void | Promise<void>) => {
      onMountedHandler = callback
    }
  }
})

vi.mock('vue-router', () => ({
  useRouter: () => routerValue
}))

vi.mock('@shared/lib', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  logError: (...args: unknown[]) => logErrorMock(...args)
}))

vi.mock('../service/save-club', () => ({
  createClub: (...args: unknown[]) => createClubMock(...args),
  updateClub: (...args: unknown[]) => updateClubMock(...args),
  loadClub: (...args: unknown[]) => loadClubMock(...args)
}))

beforeEach(() => {
  onMountedHandler = undefined
  pushMock.mockReset()
  routerValue = { push: pushMock }
  createClubMock.mockReset()
  createClubMock.mockResolvedValue(undefined)
  updateClubMock.mockReset()
  updateClubMock.mockResolvedValue(undefined)
  loadClubMock.mockReset()
  loadClubMock.mockResolvedValue(CLUB_MOCK_DATA[0])
  logErrorMock.mockReset()
})

describe('useClubForm', () => {
  it('starts with empty fields for create mode', () => {
    const { fields } = useClubForm()

    expect(fields.value).toEqual(createEmptyClubForm())
  })

  it('loads club fields in edit mode', async () => {
    const form = useClubForm({ clubId: () => CLUB_MOCK_DATA[0]!.id })

    await onMountedHandler?.()
    await flushPromises()

    expect(loadClubMock).toHaveBeenCalledWith(CLUB_MOCK_DATA[0]!.id)
    expect(form.fields.value.name).toBe('Judoclub Nord e.V.')
    expect(form.isLoading.value).toBe(false)
  })

  it('shows a load error when edit data cannot be fetched', async () => {
    loadClubMock.mockRejectedValueOnce(new Error('boom'))
    const form = useClubForm({ clubId: () => 'missing' })

    await onMountedHandler?.()
    await flushPromises()

    expect(form.loadErrorMessage.value).toBe('clubs.saveClub.form.loadError')
    expect(form.isSubmitDisabled.value).toBe(true)
    expect(logErrorMock).toHaveBeenCalled()
  })

  it('creates a club and navigates to the overview', async () => {
    const form = useClubForm()
    form.fields.value.name = 'New Club'
    form.fields.value.districtName = 'Berlin'
    form.isFormValid.value = true
    form.setFormRef({
      validate: vi.fn().mockResolvedValue({ valid: true }),
      resetValidation: vi.fn()
    })

    await form.submit()

    expect(createClubMock).toHaveBeenCalled()
    expect(pushMock).toHaveBeenCalledWith({ name: 'clubs' })
  })

  it('updates a club in edit mode', async () => {
    const form = useClubForm({ clubId: () => CLUB_MOCK_DATA[0]!.id })

    await onMountedHandler?.()
    await flushPromises()

    form.isFormValid.value = true
    form.setFormRef({
      validate: vi.fn().mockResolvedValue({ valid: true }),
      resetValidation: vi.fn()
    })
    form.fields.value.name = 'Renamed Club'

    await form.submit()

    expect(updateClubMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: CLUB_MOCK_DATA[0]!.id,
        name: 'Renamed Club'
      })
    )
    expect(pushMock).toHaveBeenCalledWith({ name: 'clubs' })
  })

  it('records a save error when persistence fails', async () => {
    createClubMock.mockRejectedValueOnce(new Error('boom'))
    const form = useClubForm()
    form.isFormValid.value = true
    form.setFormRef({
      validate: vi.fn().mockResolvedValue({ valid: true }),
      resetValidation: vi.fn()
    })

    await form.submit()

    expect(form.saveErrorMessage.value).toBe('clubs.saveClub.form.saveError')
    expect(pushMock).not.toHaveBeenCalled()
  })

  it('does not save when validation fails', async () => {
    const form = useClubForm()
    form.setFormRef({
      validate: vi.fn().mockResolvedValue({ valid: false }),
      resetValidation: vi.fn()
    })

    await form.submit()

    expect(createClubMock).not.toHaveBeenCalled()
  })

  it('resets to initial fields in edit mode', async () => {
    const form = useClubForm({ clubId: () => CLUB_MOCK_DATA[0]!.id })

    await onMountedHandler?.()
    await flushPromises()

    form.fields.value.name = 'Changed'
    await form.reset()

    expect(form.fields.value.name).toBe('Judoclub Nord e.V.')
  })

  it('resets to an empty form in create mode', async () => {
    const form = useClubForm()
    form.fields.value.name = 'Draft'
    form.setFormRef({
      validate: vi.fn(),
      resetValidation: vi.fn()
    })

    await form.reset()

    expect(form.fields.value).toEqual(createEmptyClubForm())
  })
})
