import type { Competitor } from '@shared/types/electron-api'

import type { ParticipantFormState } from './participant-form-state'

/**
 * Maps a persisted competitor record to editable participant form state.
 *
 * @param competitor - Competitor record loaded from the main process.
 * @returns Form state for the save-participant UI.
 */
export function mapCompetitorToFormState(competitor: Competitor): ParticipantFormState {
  return {
    givenName: competitor.givenName,
    familyName: competitor.familyName,
    gender: competitor.gender,
    birthDate: competitor.birthDate,
    clubId: competitor.clubId,
    nationality: competitor.nationality,
    ageClassId: competitor.ageClassId,
    weightClassId: competitor.weightClassId,
    passNumber: competitor.passNumber,
    gradeId: competitor.gradeId ?? '',
    licenseNumber: competitor.licenseNumber ?? '',
    contactPhone: competitor.contactPhone ?? '',
    coach: competitor.coach ?? ''
  }
}
