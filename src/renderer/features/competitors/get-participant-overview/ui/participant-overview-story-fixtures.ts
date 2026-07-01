import type { ParticipantGender } from '../model/participant-row'
import type {
  ParticipantOverviewHeader,
  ParticipantTableRow,
  ParticipantTableSortItem
} from '../model/use-participant-overview'

/** Default sort state for participant overview stories. */
export const storySortBy: ParticipantTableSortItem[] = [{ key: 'familyName', order: 'asc' }]

/** Column headers for participant overview stories. */
export const storyHeaders: ParticipantOverviewHeader[] = [
  { title: 'Given name', key: 'givenName', sortable: true, minWidth: '7rem' },
  { title: 'Family name', key: 'familyName', sortable: true, minWidth: '7rem' },
  { title: 'Gender', key: 'gender', sortable: true, minWidth: '6rem' },
  { title: 'Date of birth', key: 'birthDate', sortable: true, minWidth: '8rem' },
  { title: 'Club', key: 'club', sortable: true, minWidth: '8rem' },
  { title: 'Nationality', key: 'nationality', sortable: true, minWidth: '5rem' },
  { title: 'Weight class', key: 'weightClass', sortable: true, minWidth: '7rem' },
  { title: 'Age class', key: 'ageClass', sortable: true, minWidth: '6rem' },
  { title: 'Judo pass number', key: 'passNumber', sortable: true, minWidth: '8rem' },
  { title: 'Grade (kyu/dan)', key: 'grade', sortable: true, minWidth: '6rem' },
  {
    title: 'Competition licence number',
    key: 'licenseNumber',
    sortable: true,
    minWidth: '9rem'
  },
  {
    title: 'Club contact email',
    key: 'clubContactEmail',
    sortable: true,
    minWidth: '12rem'
  },
  { title: 'Contact phone', key: 'contactPhone', sortable: true, minWidth: '9rem' },
  { title: 'Coach / guardian', key: 'coach', sortable: true, minWidth: '8rem' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end', minWidth: '6rem' }
]

const storyParticipantRows: Array<{
  gender: ParticipantGender
  givenName: string
  familyName: string
}> = [
  { gender: 'm', givenName: 'Alex', familyName: 'Example' },
  { gender: 'f', givenName: 'Sam', familyName: 'Sample' }
]

const genderLabels: Record<ParticipantGender, string> = {
  f: 'Female',
  m: 'Male',
  d: 'Diverse'
}

/** Storybook table rows with fictional placeholder data. */
export const storyItems: ParticipantTableRow[] = storyParticipantRows.map((participant, index) => ({
  id: `story-participant-${index + 1}`,
  givenName: participant.givenName,
  familyName: participant.familyName,
  gender: genderLabels[participant.gender],
  birthDate: '2011-04-12',
  club: 'Example Club',
  nationality: 'DE',
  weightClass: '-60',
  ageClass: 'U15',
  passNumber: 'EX-000001',
  grade: '3. Kyu',
  licenseNumber: 'WL-000001',
  clubContactEmail: 'contact@example.invalid',
  contactPhone: '+49 555 010201',
  coach: 'C. Example'
}))
