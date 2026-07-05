import type { ImportRowResult } from '@shared/types/electron-api'

/** Fictional import result rows for stories (no real personal data). */
export const IMPORT_RESULT_FIXTURES: ImportRowResult[] = [
  {
    index: 0,
    givenName: 'Yuki',
    familyName: 'Tanaka',
    club: 'Dojo Nord',
    success: true
  },
  {
    index: 1,
    givenName: 'Anna',
    familyName: 'Weber',
    club: 'Dojo Süd',
    success: true
  },
  {
    index: 2,
    givenName: 'Max',
    familyName: 'Miller',
    club: 'JC West',
    success: false,
    errorCode: 'validation_failed'
  },
  {
    index: 3,
    givenName: 'Lisa',
    familyName: 'Chen',
    club: 'Dojo Nord',
    success: true
  },
  {
    index: 4,
    givenName: 'Tom',
    familyName: 'Berger',
    club: 'JC Ost',
    success: false,
    errorCode: 'validation_failed'
  }
]
