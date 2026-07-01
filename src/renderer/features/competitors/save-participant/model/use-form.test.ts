import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import { createEmptyParticipantForm } from './participant-form-state'
import { useParticipantForm } from './use-form'

vi.mock('@shared/lib', () => ({
  useTranslation: () => ({ t: (key: string) => key })
}))

describe('useParticipantForm', () => {
  it('starts with empty fields', () => {
    const { fields } = useParticipantForm()

    expect(fields.value).toEqual(createEmptyParticipantForm())
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

  it('completes submit when validation succeeds', async () => {
    const validateMock = vi.fn().mockResolvedValue({ valid: true })
    const participantForm = useParticipantForm()
    participantForm.setFormRef({ validate: validateMock })

    await participantForm.submit()

    expect(validateMock).toHaveBeenCalled()
  })

  it('normalizes cleared grade selection to an empty string', async () => {
    const { fields } = useParticipantForm()

    fields.value.gradeId = 'a1000000-0000-4000-8000-000000000001'
    fields.value.gradeId = null as unknown as string
    await nextTick()

    expect(fields.value.gradeId).toBe('')
  })

  it('resets all fields and validation state', () => {
    const resetValidation = vi.fn()
    const participantForm = useParticipantForm()
    participantForm.setFormRef({ resetValidation })
    participantForm.fields.value.givenName = 'Yuki'

    participantForm.reset()

    expect(participantForm.fields.value.givenName).toBe('')
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
