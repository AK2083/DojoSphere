import type { CompetitorGender } from '@shared/types/electron-api'

/** Participant gender code stored in `competitors.gender`. */
export type ParticipantGender = CompetitorGender

/** Participant row displayed in the card list. */
export interface ParticipantRow {
  id: string
  createdAt: string
  givenName: string
  familyName: string
  gender: ParticipantGender
  birthDate: string
  club: string
  nationality: string
  weightClass: string
  ageClass: string
  passNumber: string
  grade: string
  gradeBeltColorToken: string | null
  licenseNumber: string
  clubContactEmail: string
  contactPhone: string
  coach: string
}
