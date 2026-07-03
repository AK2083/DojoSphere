/**
 * Fictional import preview rows for the import UI (no real personal data).
 */
export type ImportPreviewParticipant = {
  id: string
  givenName: string
  familyName: string
  club: string
  success: boolean
}

export /**
 *
 */
const IMPORT_PREVIEW_PARTICIPANTS: ImportPreviewParticipant[] = [
  {
    id: 'import-preview-1',
    givenName: 'Yuki',
    familyName: 'Tanaka',
    club: 'Dojo Nord',
    success: true
  },
  {
    id: 'import-preview-2',
    givenName: 'Anna',
    familyName: 'Weber',
    club: 'Dojo Süd',
    success: true
  },
  {
    id: 'import-preview-3',
    givenName: 'Max',
    familyName: 'Miller',
    club: 'JC West',
    success: false
  },
  {
    id: 'import-preview-4',
    givenName: 'Lisa',
    familyName: 'Chen',
    club: 'Dojo Nord',
    success: true
  },
  {
    id: 'import-preview-5',
    givenName: 'Tom',
    familyName: 'Berger',
    club: 'JC Ost',
    success: false
  }
]
