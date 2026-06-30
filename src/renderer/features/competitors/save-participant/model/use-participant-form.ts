import { ref } from 'vue'

/** Gender options available in the participant form. */
export type ParticipantFormGender = '' | 'diverse' | 'female' | 'male'

/** Editable participant fields for the save form prototype. */
export type ParticipantFormState = {
  givenName: string
  familyName: string
  gender: ParticipantFormGender
  birthDate: string
  club: string
  nationality: string
  weightClass: string
  ageClass: string
  passNumber: string
  grade: string
  licenseNumber: string
  clubContactEmail: string
  contactPhone: string
  coach: string
}

function createEmptyForm(): ParticipantFormState {
  return {
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
  }
}

/**
 * Local form state for creating or editing a participant.
 *
 * @returns Reactive form fields and placeholder submit/reset handlers.
 */
export function useParticipantForm() {
  const form = ref(createEmptyForm())

  function submit(): void {
    // Placeholder until participant save flow is implemented.
  }

  function reset(): void {
    form.value = createEmptyForm()
  }

  return {
    form,
    submit,
    reset
  }
}
