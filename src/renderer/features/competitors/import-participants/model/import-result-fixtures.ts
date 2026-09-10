import type { ImportRowResult } from '@shared/types/electron-api'

/** Fictional import result rows for stories (no real personal data). */
export const IMPORT_RESULT_FIXTURES: ImportRowResult[] = [
  {
    index: 0,
    givenName: 'Yuki',
    familyName: 'Tanaka',
    association: 'Dojo Nord',
    success: true
  },
  {
    index: 1,
    givenName: 'Anna',
    familyName: 'Weber',
    association: 'Dojo Süd',
    success: true
  },
  {
    index: 2,
    givenName: 'Max',
    familyName: 'Miller',
    association: 'JC West',
    success: false,
    errorCode: 'validation_failed'
  },
  {
    index: 3,
    givenName: 'Lisa',
    familyName: 'Chen',
    association: 'Dojo Nord',
    success: true
  },
  {
    index: 4,
    givenName: 'Tom',
    familyName: 'Berger',
    association: 'JC Ost',
    success: false,
    errorCode: 'validation_failed'
  }
]
