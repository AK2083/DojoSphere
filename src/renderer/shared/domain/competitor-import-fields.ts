/**
 * Shared registry of participant import target fields and their header/value
 * synonyms.
 *
 * This module is imported by both the Electron main process (Excel parsing and
 * column matching) and the renderer (fine-mapping UI). It must stay free of
 * vue-i18n and browser-only APIs so it can run in the main process.
 */

/** Target fields an Excel column can be mapped to during import. */
export type ImportTargetFieldKey =
  | 'birthDate'
  | 'club'
  | 'clubContactEmail'
  | 'contactPerson'
  | 'contactPhone'
  | 'familyName'
  | 'gender'
  | 'givenName'
  | 'grade'
  | 'licenseNumber'
  | 'nationality'
  | 'passNumber'
  | 'registrationStatus'
  | 'remarks'
  | 'startEligible'
  | 'weightKg'

/** Inferable data type of a source column, used for the data-based fallback. */
export type ImportFieldDataType =
  | 'boolean'
  | 'date'
  | 'email'
  | 'gender'
  | 'grade'
  | 'nationality'
  | 'registrationStatus'
  | 'text'
  | 'weightKg'

/** Metadata for a single import target field. */
export type ImportTargetField = {
  key: ImportTargetFieldKey
  /** When true, the mapping step blocks import until this field is mapped. */
  required: boolean
  dataType: ImportFieldDataType
}

/** Canonical list of import target fields with matching metadata. */
export const COMPETITOR_IMPORT_FIELDS: readonly ImportTargetField[] = [
  { key: 'givenName', required: true, dataType: 'text' },
  { key: 'familyName', required: true, dataType: 'text' },
  { key: 'gender', required: false, dataType: 'gender' },
  { key: 'birthDate', required: false, dataType: 'date' },
  { key: 'club', required: false, dataType: 'text' },
  { key: 'nationality', required: false, dataType: 'nationality' },
  { key: 'weightKg', required: false, dataType: 'weightKg' },
  { key: 'passNumber', required: false, dataType: 'text' },
  { key: 'grade', required: false, dataType: 'grade' },
  { key: 'licenseNumber', required: false, dataType: 'text' },
  { key: 'contactPhone', required: false, dataType: 'text' },
  { key: 'contactPerson', required: false, dataType: 'text' },
  { key: 'clubContactEmail', required: false, dataType: 'email' },
  { key: 'registrationStatus', required: false, dataType: 'registrationStatus' },
  { key: 'remarks', required: false, dataType: 'text' },
  { key: 'startEligible', required: false, dataType: 'boolean' }
] as const

/** Keys of fields that block the mapping step when unmapped. */
export const REQUIRED_IMPORT_FIELD_KEYS: readonly ImportTargetFieldKey[] =
  COMPETITOR_IMPORT_FIELDS.filter((field) => field.required).map((field) => field.key)

/**
 * Import target fields that show the same required asterisk as the participant form.
 *
 * Matches the fields that use `RequiredFieldLabel` in `ParticipantForm.vue`.
 * Age class and weight class are omitted because they are derived from weight on import.
 */
export const PARTICIPANT_FORM_REQUIRED_IMPORT_FIELD_KEYS: readonly ImportTargetFieldKey[] = [
  'givenName',
  'familyName',
  'gender',
  'birthDate',
  'club',
  'nationality',
  'passNumber'
] as const

/**
 * Returns whether an import target field uses the participant form required marker.
 *
 * @param key - Import target field key.
 * @returns True when the field is required in the participant form import flow.
 */
export function isParticipantFormRequiredImportField(key: ImportTargetFieldKey): boolean {
  return PARTICIPANT_FORM_REQUIRED_IMPORT_FIELD_KEYS.includes(key)
}

/** Repository defaults applied when a form-required field stays unmapped in Excel. */
export const IMPORT_UNMAPPED_DEFAULTS = {
  gender: 'f',
  nationality: 'DE',
  birthDate: '2000-01-01',
  passNumber: '00000000'
} as const

/**
 * Returns whether an unmapped import field falls back to a repository default on import.
 *
 * @param key - Import target field key.
 * @returns True when unmapped values fall back to a repository default.
 */
export function usesImportDefaultWhenUnmapped(key: ImportTargetFieldKey): boolean {
  return isParticipantFormRequiredImportField(key) && key !== 'givenName' && key !== 'familyName'
}

function normalizeImportSourceLabel(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .trim()
}

/**
 * Returns whether a source column or form label belongs to tournament metadata
 * rather than per-participant data and must not be offered for import mapping.
 *
 * @param label - Column header or form field label from the workbook.
 * @returns True when the label belongs to tournament metadata.
 */
export function isExcludedImportSourceLabel(label: string): boolean {
  const normalized = normalizeImportSourceLabel(label)

  if (!normalized) {
    return false
  }

  return (
    normalized.includes('ausrichter') ||
    normalized.includes('veranstaltung') ||
    normalized === 'wettkampftag' ||
    normalized.includes('meldeschluss') ||
    normalized.includes('registrationdeadline') ||
    normalized.includes('eventhost') ||
    normalized.includes('eventname') ||
    normalized.includes('competitionday')
  )
}

/** Header synonyms per target field. */
export type ImportHeaderSynonyms = Record<ImportTargetFieldKey, readonly string[]>

/** German header synonyms used for column auto-mapping. */
export const COMPETITOR_IMPORT_SYNONYMS_DE: ImportHeaderSynonyms = {
  givenName: ['Vorname', 'Rufname', 'Vor-Name'],
  familyName: ['Nachname', 'Name', 'Familienname', 'Nach-Name', 'Zuname'],
  gender: ['Geschlecht', 'Geschl', 'Sex', 'm/w', 'm/w/d'],
  birthDate: ['Geburtsdatum', 'Geburtstag', 'Geburtsjahr', 'Jahrgang', 'Jg', 'geb', 'geb.'],
  club: [
    'Verein',
    'Club',
    'Verein/Club',
    'Verein / Club',
    'Meldender Verein',
    'Dojo',
    'Vereinsname',
    'Mannschaft'
  ],
  nationality: ['Nationalität', 'Nation', 'Land', 'Staatsangehörigkeit', 'Nat'],
  weightKg: ['Gewicht', 'Körpergewicht', 'kg', 'Waage', 'Wiegegewicht'],
  passNumber: [
    'Passnummer',
    'Pass-Nr.',
    'Pass-Nr',
    'Pass.-Nr.',
    'Pass Nr',
    'Passnr',
    'Judopass',
    'Ausweisnummer'
  ],
  grade: ['Kyu', 'Dan', 'Grad', 'Gürtel', 'Gurt', 'Gürtelgrad', 'Gürtelfarbe', 'DAN'],
  licenseNumber: ['Lizenznummer', 'Lizenz-Nr', 'Lizenz-Nr.', 'Wettkampflizenznummer'],
  contactPerson: [
    'Kontaktperson',
    'Coach / Kontakt am Wettkampftag',
    'Kontakt am Wettkampftag',
    'Trainer',
    'Betreuer',
    'Coach',
    'Ansprechpartner'
  ],
  clubContactEmail: [
    'E-Mail Vereinsverantwortlicher',
    'Email Vereinsverantwortlicher',
    'Vereinsverantwortlicher E-Mail',
    'E-Mail',
    'Email',
    'Mail',
    'Kontakt E-Mail'
  ],
  contactPhone: [
    'Telefon',
    'Tel',
    'Handy',
    'Mobil',
    'Rufnummer',
    'Kontakttelefon',
    'Telefonnummer'
  ],
  startEligible: ['Startberechtigt', 'Startberechtigung', 'Startklar', 'startet'],
  registrationStatus: ['Status', 'Meldestatus', 'Meldung', 'Anmeldung'],
  remarks: ['Bemerkung', 'Bemerkungen', 'Anmerkung', 'Notiz', 'Notizen', 'Kommentar', 'Hinweis']
}

/** English header synonyms used for column auto-mapping. */
export const COMPETITOR_IMPORT_SYNONYMS_EN: ImportHeaderSynonyms = {
  givenName: ['Given name', 'First name', 'Forename', 'Firstname'],
  familyName: ['Family name', 'Last name', 'Surname', 'Lastname', 'Name'],
  gender: ['Gender', 'Sex', 'm/f', 'm/f/d'],
  birthDate: [
    'Date of birth',
    'Birth date',
    'Birthday',
    'Birth year',
    'Year of birth',
    'DOB',
    'Born'
  ],
  club: ['Club', 'Team', 'Dojo', 'Club name', 'Organisation', 'Organization'],
  nationality: ['Nationality', 'Nation', 'Country', 'Citizenship', 'Nat'],
  weightKg: ['Weight', 'Body weight', 'kg', 'Bodyweight'],
  passNumber: [
    'Pass number',
    'Pass no',
    'Pass-Nr.',
    'Pass-Nr',
    'Judo pass',
    'License pass',
    'ID number'
  ],
  grade: ['Grade', 'Belt', 'Kyu', 'Dan', 'Rank', 'Belt rank'],
  licenseNumber: ['License number', 'Licence number', 'License', 'Licence', 'License no'],
  contactPerson: [
    'Contact person',
    'Coach',
    'Trainer',
    'Supervisor',
    'Guardian',
    'Contact on competition day'
  ],
  clubContactEmail: [
    'Club contact email',
    'Contact email',
    'E-mail',
    'Email',
    'Mail',
    'Supervisor email'
  ],
  contactPhone: ['Phone', 'Telephone', 'Mobile', 'Cell', 'Phone number', 'Contact phone', 'Tel'],
  startEligible: ['Eligible', 'Eligible to compete', 'Start eligible', 'Can compete'],
  registrationStatus: ['Status', 'Registration status', 'Registration', 'Entry status'],
  remarks: ['Remarks', 'Remark', 'Note', 'Notes', 'Comment', 'Comments', 'Info']
}

/** Cell value synonyms for gender codes (lowercased comparison). */
export const GENDER_VALUE_SYNONYMS: Record<'d' | 'f' | 'm', readonly string[]> = {
  m: ['m', 'male', 'männlich', 'maennlich', 'mann', 'boy', 'junge', 'herr'],
  f: ['f', 'w', 'female', 'weiblich', 'frau', 'girl', 'mädchen', 'maedchen', 'dame'],
  d: ['d', 'x', 'divers', 'diverse', 'nonbinary', 'non-binary', 'inter']
}

/** Cell value synonyms for registration status codes (lowercased comparison). */
export const REGISTRATION_STATUS_VALUE_SYNONYMS: Record<
  'late_registration' | 'registered',
  readonly string[]
> = {
  registered: ['gemeldet', 'registered', 'meldung', 'angemeldet', 'registration'],
  late_registration: ['nachmeldung', 'late', 'late registration', 'nachgemeldet', 'nachträglich']
}

/** Cell values interpreted as boolean true (lowercased comparison). */
export const BOOLEAN_TRUE_SYNONYMS: readonly string[] = [
  'ja',
  'j',
  'yes',
  'y',
  'true',
  'wahr',
  'x',
  '1',
  'ok',
  'startberechtigt'
]

/** Cell values interpreted as boolean false (lowercased comparison). */
export const BOOLEAN_FALSE_SYNONYMS: readonly string[] = [
  'nein',
  'n',
  'no',
  'false',
  'falsch',
  '0',
  'nicht'
]
