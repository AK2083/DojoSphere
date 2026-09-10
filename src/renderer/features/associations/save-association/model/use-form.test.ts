import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ASSOCIATION_MOCK_DATA } from '../../get-association-overview/model/association-mock-data'
import { createEmptyAssociationForm } from './association-form-state'
import { useAssociationForm } from './use-form'

const pushMock = vi.fn()
const createAssociationMock = vi.fn()
const updateAssociationMock = vi.fn()
const loadAssociationMock = vi.fn()
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

vi.mock('../service/save-association', () => ({
  createAssociation: (...args: unknown[]) => createAssociationMock(...args),
  updateAssociation: (...args: unknown[]) => updateAssociationMock(...args),
  loadAssociation: (...args: unknown[]) => loadAssociationMock(...args)
}))

beforeEach(() => {
  onMountedHandler = undefined
  pushMock.mockReset()
  routerValue = { push: pushMock }
  createAssociationMock.mockReset()
  createAssociationMock.mockResolvedValue(undefined)
  updateAssociationMock.mockReset()
  updateAssociationMock.mockResolvedValue(undefined)
  loadAssociationMock.mockReset()
  loadAssociationMock.mockResolvedValue(ASSOCIATION_MOCK_DATA[0])
  logErrorMock.mockReset()
})

describe('useAssociationForm', () => {
  it('starts with empty fields for create mode', () => {
    const { fields } = useAssociationForm()

    expect(fields.value).toEqual(createEmptyAssociationForm())
  })

  it('skips loading when create mode has no association id', async () => {
    const form = useAssociationForm()

    await onMountedHandler?.()
    await flushPromises()

    expect(loadAssociationMock).not.toHaveBeenCalled()
    expect(form.fields.value).toEqual(createEmptyAssociationForm())
  })

  it('copies headquarters into linked address blocks', async () => {
    const form = useAssociationForm()

    form.fields.value.headquarters = {
      street: 'Dojostraße',
      houseNumber: '12',
      postalCode: '20095',
      city: 'Hamburg'
    }
    form.fields.value.trainingVenueSameAsHeadquarters = true
    form.fields.value.billingAddressSameAsHeadquarters = true
    await flushPromises()

    expect(form.fields.value.trainingVenue).toEqual(form.fields.value.headquarters)
    expect(form.fields.value.billingAddress).toEqual(form.fields.value.headquarters)

    form.fields.value.headquarters.street = 'Neue Straße'
    await flushPromises()

    expect(form.fields.value.trainingVenue.street).toBe('Neue Straße')
    expect(form.fields.value.billingAddress.street).toBe('Neue Straße')
  })

  it('disables submit while saving or loading', async () => {
    const form = useAssociationForm({ associationId: () => ASSOCIATION_MOCK_DATA[0]!.id })

    form.isFormValid.value = true
    expect(form.isSubmitDisabled.value).toBe(false)

    form.isSaving.value = true
    expect(form.isSubmitDisabled.value).toBe(true)

    form.isSaving.value = false
    form.isLoading.value = true
    expect(form.isSubmitDisabled.value).toBe(true)

    form.isLoading.value = false
    form.isFormValid.value = false
    expect(form.isSubmitDisabled.value).toBe(true)
  })

  it('loads association fields in edit mode', async () => {
    const form = useAssociationForm({ associationId: () => ASSOCIATION_MOCK_DATA[0]!.id })

    await onMountedHandler?.()
    await flushPromises()

    expect(loadAssociationMock).toHaveBeenCalledWith(ASSOCIATION_MOCK_DATA[0]!.id)
    expect(form.fields.value.name).toBe('Judoclub Nord e.V.')
    expect(form.isLoading.value).toBe(false)
  })

  it('shows a load error when edit data cannot be fetched', async () => {
    loadAssociationMock.mockRejectedValueOnce(new Error('boom'))
    const form = useAssociationForm({ associationId: () => 'missing' })

    await onMountedHandler?.()
    await flushPromises()

    expect(form.loadErrorMessage.value).toBe('associations.saveAssociation.form.loadError')
    expect(form.isSubmitDisabled.value).toBe(true)
    expect(logErrorMock).toHaveBeenCalled()
  })

  it('creates a association and navigates to the overview', async () => {
    const form = useAssociationForm()
    form.fields.value.name = 'New Association'
    form.fields.value.districtName = 'Berlin'
    form.isFormValid.value = true
    form.setFormRef({
      validate: vi.fn().mockResolvedValue({ valid: true }),
      resetValidation: vi.fn()
    })

    await form.submit()

    expect(createAssociationMock).toHaveBeenCalled()
    expect(pushMock).toHaveBeenCalledWith({ name: 'associations' })
  })

  it('updates a association in edit mode', async () => {
    const form = useAssociationForm({ associationId: () => ASSOCIATION_MOCK_DATA[0]!.id })

    await onMountedHandler?.()
    await flushPromises()

    form.isFormValid.value = true
    form.setFormRef({
      validate: vi.fn().mockResolvedValue({ valid: true }),
      resetValidation: vi.fn()
    })
    form.fields.value.name = 'Renamed Association'

    await form.submit()

    expect(updateAssociationMock).toHaveBeenCalledWith(
      ASSOCIATION_MOCK_DATA[0]!.id,
      expect.objectContaining({
        name: 'Renamed Association'
      })
    )
    expect(pushMock).toHaveBeenCalledWith({ name: 'associations' })
  })

  it('records a save error when persistence fails', async () => {
    createAssociationMock.mockRejectedValueOnce(new Error('boom'))
    const form = useAssociationForm()
    form.isFormValid.value = true
    form.setFormRef({
      validate: vi.fn().mockResolvedValue({ valid: true }),
      resetValidation: vi.fn()
    })

    await form.submit()

    expect(form.saveErrorMessage.value).toBe('associations.saveAssociation.form.saveError')
    expect(pushMock).not.toHaveBeenCalled()
  })

  it('does not save when validation fails', async () => {
    const form = useAssociationForm()
    form.setFormRef({
      validate: vi.fn().mockResolvedValue({ valid: false }),
      resetValidation: vi.fn()
    })

    await form.submit()

    expect(createAssociationMock).not.toHaveBeenCalled()
  })

  it('resets to initial fields in edit mode', async () => {
    const form = useAssociationForm({ associationId: () => ASSOCIATION_MOCK_DATA[0]!.id })

    await onMountedHandler?.()
    await flushPromises()

    form.fields.value.name = 'Changed'
    await form.reset()

    expect(form.fields.value.name).toBe('Judoclub Nord e.V.')
  })

  it('resets to an empty form in create mode', async () => {
    const form = useAssociationForm()
    form.fields.value.name = 'Draft'
    form.setFormRef({
      validate: vi.fn(),
      resetValidation: vi.fn()
    })

    await form.reset()

    expect(form.fields.value).toEqual(createEmptyAssociationForm())
  })
})
