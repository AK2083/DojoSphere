/** Gender codes stored in `competitors.gender` (`f` | `m` | `d`). */
export type ParticipantGender = '' | 'd' | 'f' | 'm'

/** Editable participant fields for the save form. */
export type ParticipantFormState = {
  givenName: string
  familyName: string
  gender: ParticipantGender
  birthDate: string
  clubId: string
  nationality: string
  ageClassId: string
  weightClassId: string
  passNumber: string
  gradeId: string
  licenseNumber: string
  contactPhone: string
  coach: string
}

/**
 *
 */
/**
 * Creates an empty participant form state.
 *
 * @returns Initial form values for a new participant.
 */
export function createEmptyParticipantForm(): ParticipantFormState {
  return {
    givenName: '',
    familyName: '',
    gender: '',
    birthDate: '',
    clubId: '',
    nationality: '',
    ageClassId: '',
    weightClassId: '',
    passNumber: '',
    gradeId: '',
    licenseNumber: '',
    contactPhone: '',
    coach: ''
  }
}
