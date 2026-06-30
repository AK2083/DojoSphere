import { describe, expect, it } from 'vitest'

import { useParticipantForm } from './use-participant-form'

describe('useParticipantForm', () => {
  it('starts with empty fields', () => {
    const { form } = useParticipantForm()

    expect(form.value).toEqual({
      givenName: '',
      familyName: '',
      gender: '',
      birthDate: '',
      club: '',
      nationality: '',
      weightClass: '',
      ageClass: '',
      passNumber: '',
      grade: '',
      licenseNumber: '',
      clubContactEmail: '',
      contactPhone: '',
      coach: ''
    })
  })

  it('exposes a no-op submit handler for the UI prototype', () => {
    const { submit } = useParticipantForm()

    expect(() => submit()).not.toThrow()
  })

  it('resets all fields to their initial empty state', () => {
    const { form, reset } = useParticipantForm()

    form.value.givenName = 'Yuki'
    form.value.familyName = 'Tanaka'
    form.value.gender = 'male'
    form.value.birthDate = '2011-04-12'

    reset()

    expect(form.value.givenName).toBe('')
    expect(form.value.familyName).toBe('')
    expect(form.value.gender).toBe('')
    expect(form.value.birthDate).toBe('')
  })
})
