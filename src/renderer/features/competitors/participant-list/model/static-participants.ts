/** Participant gender code for i18n lookup. */
export type ParticipantGender = 'female' | 'male'

/** Static participant row for UI prototyping without backend integration. */
export interface ParticipantRow {
  id: string
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
  licenseNumber: string
  clubContactEmail: string
  contactPhone: string
  coach: string
}

/** Fictional sample data for layout and accessibility testing. */
export const STATIC_PARTICIPANTS: ParticipantRow[] = [
  {
    id: 'participant-1',
    givenName: 'Yuki',
    familyName: 'Tanaka',
    gender: 'male',
    birthDate: '2011-04-12',
    club: 'Dojo Nord',
    nationality: 'DE',
    weightClass: '-60 kg',
    ageClass: 'U15',
    passNumber: 'JP-000142',
    grade: '3. Kyu',
    licenseNumber: 'WL-2024-001',
    clubContactEmail: 'kontakt@example-dojo.invalid',
    contactPhone: '+49 555 010201',
    coach: 'S. Fischer'
  },
  {
    id: 'participant-2',
    givenName: 'Anna',
    familyName: 'Weber',
    gender: 'female',
    birthDate: '2013-08-03',
    club: 'JC West',
    nationality: 'DE',
    weightClass: '-52 kg',
    ageClass: 'U13',
    passNumber: 'JP-000287',
    grade: '5. Kyu',
    licenseNumber: 'WL-2024-014',
    clubContactEmail: 'anmeldung@example-jc.invalid',
    contactPhone: '+49 555 010202',
    coach: 'M. Keller'
  },
  {
    id: 'participant-3',
    givenName: 'Leo',
    familyName: 'Martin',
    gender: 'male',
    birthDate: '2009-11-21',
    club: 'SV Süd',
    nationality: 'AT',
    weightClass: '-73 kg',
    ageClass: 'U18',
    passNumber: 'JP-000391',
    grade: '1. Dan',
    licenseNumber: 'WL-2024-028',
    clubContactEmail: 'sport@example-sv.invalid',
    contactPhone: '+43 555 010203',
    coach: 'T. Brandt'
  }
]
