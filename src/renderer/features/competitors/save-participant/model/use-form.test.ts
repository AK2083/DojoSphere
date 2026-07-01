import { nextTick } from 'vue'
import type { Competitor } from '@shared/types/electron-api'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createEmptyParticipantForm } from './participant-form-state'
import { useParticipantForm } from './use-form'

const pushMock = vi.fn()
const createParticipantMock = vi.fn()
const updateParticipantMock = vi.fn()
const loadParticipantMock = vi.fn()
const logErrorMock = vi.fn()
let routerValue: { push: typeof pushMock } | undefined

function createCompetitor(overrides: Partial<Competitor> = {}): Competitor {
  return {
    id: 'competitor-1',
    givenName: 'Yuki',
    familyName: 'Tanaka',
    gender: 'm',
    birthDate: '2011-04-12',
    nationality: 'DE',
    passNumber: 'JP-000142',
    club: 'Dojo Nord',
    weightClass: '-60',
    licenseNumber: 'WL-2024-001',
    contactPhone: '+49 555 010201',
    coach: 'S. Fischer',
    clubId: '00000000-0000-0000-0000-000000000000',
    weightClassId: 'b3000000-0000-4000-8000-000000000008',
    ageClassId: 'c2000000-0000-4000-8000-000000000003',
    gradeId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: null,
    ...overrides
  }
}

vi.mock('vue-router', () => ({
  useRouter: () => routerValue
}))

vi.mock('@shared/lib', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  logError: (...args: unknown[]) => logErrorMock(...args)
}))

vi.mock('../service/save-participant', () => ({
  createParticipant: (...args: unknown[]) => createParticipantMock(...args),
  updateParticipant: (...args: unknown[]) => updateParticipantMock(...args),
  loadParticipant: (...args: unknown[]) => loadParticipantMock(...args)
}))

beforeEach(() => {
  pushMock.mockReset()
  routerValue = { push: pushMock }
  createParticipantMock.mockReset()
  createParticipantMock.mockResolvedValue({ id: 'competitor-1' })
  updateParticipantMock.mockReset()
  updateParticipantMock.mockResolvedValue({ id: 'competitor-1' })
  loadParticipantMock.mockReset()
  loadParticipantMock.mockResolvedValue(createCompetitor())
  logErrorMock.mockReset()
})

describe('useParticipantForm', () => {
  it('starts with empty fields', () => {
    const { fields } = useParticipantForm()

    expect(fields.value).toEqual(createEmptyParticipantForm())
  })

  it('loads participant fields in edit mode', async () => {
    const participantForm = useParticipantForm({ participantId: () => 'competitor-1' })

    await flushPromises()

    expect(loadParticipantMock).toHaveBeenCalledWith('competitor-1')
    expect(participantForm.isEditMode.value).toBe(true)
    expect(participantForm.fields.value.givenName).toBe('Yuki')
    expect(participantForm.fields.value.weightClassId).toBe('b3000000-0000-4000-8000-000000000008')
    expect(participantForm.isLoading.value).toBe(false)
  })

  it('shows a load error when edit data cannot be fetched', async () => {
    loadParticipantMock.mockRejectedValueOnce(new Error('boom'))
    const participantForm = useParticipantForm({ participantId: () => 'competitor-1' })

    await flushPromises()

    expect(participantForm.loadErrorMessage.value).toBe(
      'competitors.saveParticipant.form.loadError'
    )
    expect(participantForm.isSubmitDisabled.value).toBe(true)
    expect(logErrorMock).toHaveBeenCalled()
  })

  it('clears weight class when age class changes', async () => {
    const { fields } = useParticipantForm()

    fields.value.ageClassId = 'c2000000-0000-4000-8000-000000000003'
    fields.value.weightClassId = 'b3000000-0000-4000-8000-000000000008'
    fields.value.ageClassId = 'c2000000-0000-4000-8000-000000000005'
    await nextTick()

    expect(fields.value.weightClassId).toBe('')
  })

  it('stops submit when form validation fails', async () => {
    const validateMock = vi.fn().mockResolvedValue({ valid: false })
    const participantForm = useParticipantForm()
    participantForm.setFormRef({ validate: validateMock })

    await participantForm.submit()

    expect(validateMock).toHaveBeenCalled()
  })

  it('saves the participant and navigates to the list when validation succeeds', async () => {
    const validateMock = vi.fn().mockResolvedValue({ valid: true })
    const participantForm = useParticipantForm()
    participantForm.setFormRef({ validate: validateMock })

    await participantForm.submit()

    expect(validateMock).toHaveBeenCalled()
    expect(createParticipantMock).toHaveBeenCalledWith(participantForm.fields.value)
    expect(pushMock).toHaveBeenCalledWith({ name: 'participants' })
    expect(participantForm.isSaving.value).toBe(false)
  })

  it('updates the participant in edit mode', async () => {
    const validateMock = vi.fn().mockResolvedValue({ valid: true })
    const participantForm = useParticipantForm({ participantId: () => 'competitor-1' })

    await flushPromises()
    participantForm.setFormRef({ validate: validateMock })
    participantForm.fields.value.givenName = 'Hana'

    await participantForm.submit()

    expect(updateParticipantMock).toHaveBeenCalledWith('competitor-1', participantForm.fields.value)
    expect(createParticipantMock).not.toHaveBeenCalled()
    expect(pushMock).toHaveBeenCalledWith({ name: 'participants' })
  })

  it('saves without navigating when no router is available', async () => {
    routerValue = undefined
    const validateMock = vi.fn().mockResolvedValue({ valid: true })
    const participantForm = useParticipantForm()
    participantForm.setFormRef({ validate: validateMock })

    await participantForm.submit()

    expect(createParticipantMock).toHaveBeenCalled()
    expect(pushMock).not.toHaveBeenCalled()
    expect(participantForm.saveErrorMessage.value).toBe('')
  })

  it('shows a save error and logs when persisting fails', async () => {
    createParticipantMock.mockRejectedValueOnce(new Error('boom'))
    const validateMock = vi.fn().mockResolvedValue({ valid: true })
    const participantForm = useParticipantForm()
    participantForm.setFormRef({ validate: validateMock })

    await participantForm.submit()

    expect(participantForm.saveErrorMessage.value).toBe(
      'competitors.saveParticipant.form.saveError'
    )
    expect(pushMock).not.toHaveBeenCalled()
    expect(logErrorMock).toHaveBeenCalled()
    expect(participantForm.isSaving.value).toBe(false)
  })

  it('ignores concurrent submits while saving', async () => {
    let resolveCreate: (() => void) | undefined
    createParticipantMock.mockImplementationOnce(
      () =>
        new Promise<{ id: string }>((resolve) => {
          resolveCreate = () => resolve({ id: 'competitor-1' })
        })
    )
    const validateMock = vi.fn().mockResolvedValue({ valid: true })
    const participantForm = useParticipantForm()
    participantForm.setFormRef({ validate: validateMock })

    const first = participantForm.submit()
    await participantForm.submit()

    expect(createParticipantMock).toHaveBeenCalledTimes(1)

    resolveCreate?.()
    await first
  })

  it('keeps submit disabled while loading or after a load error', async () => {
    let resolveLoad: (() => void) | undefined
    loadParticipantMock.mockImplementationOnce(
      () =>
        new Promise<Competitor>((resolve) => {
          resolveLoad = () => resolve(createCompetitor())
        })
    )
    const participantForm = useParticipantForm({ participantId: () => 'competitor-1' })

    participantForm.isFormValid.value = true
    expect(participantForm.isSubmitDisabled.value).toBe(true)

    resolveLoad?.()
    await flushPromises()

    expect(participantForm.isSubmitDisabled.value).toBe(false)

    loadParticipantMock.mockRejectedValueOnce(new Error('boom'))
    const failedForm = useParticipantForm({ participantId: () => 'missing' })
    failedForm.isFormValid.value = true
    await flushPromises()

    expect(failedForm.isSubmitDisabled.value).toBe(true)
  })

  it('keeps submit enabled only when the form is valid and not saving', () => {
    const participantForm = useParticipantForm()

    participantForm.isFormValid.value = true

    expect(participantForm.isSubmitDisabled.value).toBe(false)

    participantForm.isSaving.value = true

    expect(participantForm.isSubmitDisabled.value).toBe(true)
  })

  it('normalizes cleared grade selection to an empty string', async () => {
    const { fields } = useParticipantForm()

    fields.value.gradeId = 'a1000000-0000-4000-8000-000000000001'
    fields.value.gradeId = null as unknown as string
    await nextTick()

    expect(fields.value.gradeId).toBe('')
  })

  it('resets all fields and validation state', async () => {
    const resetValidation = vi.fn()
    const participantForm = useParticipantForm()
    participantForm.setFormRef({ resetValidation })
    participantForm.fields.value.givenName = 'Yuki'

    await participantForm.reset()

    expect(participantForm.fields.value.givenName).toBe('')
    expect(resetValidation).toHaveBeenCalled()
  })

  it('restores loaded fields when reset in edit mode', async () => {
    const resetValidation = vi.fn()
    const participantForm = useParticipantForm({ participantId: () => 'competitor-1' })

    await flushPromises()
    participantForm.setFormRef({ resetValidation })
    participantForm.fields.value.givenName = 'Changed'

    await participantForm.reset()

    expect(participantForm.fields.value.givenName).toBe('Yuki')
    expect(resetValidation).toHaveBeenCalled()
  })

  it('stops submit when form ref is missing', async () => {
    const participantForm = useParticipantForm()

    await participantForm.submit()

    expect(participantForm.isSubmitDisabled.value).toBe(true)
  })

  it('exposes reference options for selects', () => {
    const participantForm = useParticipantForm()

    expect(participantForm.genderOptions.value).toHaveLength(3)
    expect(participantForm.clubOptions.value.length).toBeGreaterThan(0)
    expect(participantForm.ageClassOptions.value).toHaveLength(18)
    expect(participantForm.gradeOptions.value.length).toBeGreaterThan(1)
  })

  it('exposes translated validation rules for all fields', () => {
    const participantForm = useParticipantForm()
    participantForm.fields.value.ageClassId = 'c2000000-0000-4000-8000-000000000003'

    expect(participantForm.givenNameRules[0]?.('Yuki')).toBe(true)
    expect(participantForm.weightClassRules.value[0]?.('')).not.toBe(true)
    expect(participantForm.selectedAgeClass.value?.weightMode).toBe('fixed')
  })

  it('validates weight class rules without a selected age class', () => {
    const participantForm = useParticipantForm()

    expect(participantForm.weightClassRules.value[0]?.('weight-id')).not.toBe(true)
  })

  it('validates weight class rules for a selected age class', () => {
    const participantForm = useParticipantForm()
    participantForm.fields.value.ageClassId = 'c2000000-0000-4000-8000-000000000003'
    participantForm.fields.value.weightClassId = 'b3000000-0000-4000-8000-000000000008'

    expect(
      participantForm.weightClassRules.value[0]?.('b3000000-0000-4000-8000-000000000008')
    ).toBe(true)
  })
})
