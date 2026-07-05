import {
  BOOLEAN_FALSE_SYNONYMS,
  BOOLEAN_TRUE_SYNONYMS,
  COMPETITOR_IMPORT_SYNONYMS_DE,
  COMPETITOR_IMPORT_SYNONYMS_EN,
  GENDER_VALUE_SYNONYMS,
  IMPORT_UNMAPPED_DEFAULTS,
  type ImportTargetFieldKey,
  REGISTRATION_STATUS_VALUE_SYNONYMS
} from '@shared/domain/competitor-import-fields'

import type {
  CompetitorGender,
  CompetitorRegistrationStatus
} from '../repository/competitors.repository'
import type { ColumnMapping } from './match-columns'
import { normalizeHeader, normalizeValue } from './normalize-text'
import type { ParsedColumn, ParsedWorkbook } from './parse-workbook'
import { isFormSourceId } from './parse-workbook'
import type { ParsedFormField } from './parse-form-fields'

/** A participant transformed from one source row, before persistence. */
export type TransformedParticipant = {
  givenName: string
  familyName: string
  gender?: CompetitorGender
  birthDate?: string
  club?: string
  nationality?: string
  weightKg?: number
  passNumber?: string
  grade?: string
  licenseNumber?: string
  contactPerson?: string
  contactPhone?: string
  clubContactEmail?: string
  startEligible: boolean
  registrationStatus?: CompetitorRegistrationStatus | null
  remarks?: string
}

const GENDER_LOOKUP = buildValueLookup<CompetitorGender>(GENDER_VALUE_SYNONYMS)

const STATUS_LOOKUP = buildValueLookup<CompetitorRegistrationStatus>(
  REGISTRATION_STATUS_VALUE_SYNONYMS
)

const BOOLEAN_TRUE = new Set(BOOLEAN_TRUE_SYNONYMS.map(normalizeValue))
const BOOLEAN_FALSE = new Set(BOOLEAN_FALSE_SYNONYMS.map(normalizeValue))

const CLUB_HEADER_KEYS: ReadonlySet<string> = new Set(
  [...COMPETITOR_IMPORT_SYNONYMS_DE.club, ...COMPETITOR_IMPORT_SYNONYMS_EN.club].map(
    normalizeHeader
  )
)

function buildValueLookup<T extends string>(
  synonyms: Record<T, readonly string[]>
): Map<string, T> {
  const lookup = new Map<string, T>()

  for (const code of Object.keys(synonyms) as T[]) {
    for (const term of synonyms[code]) {
      lookup.set(normalizeValue(term), code)
    }
  }

  return lookup
}

function parseGender(value: string): CompetitorGender | undefined {
  return GENDER_LOOKUP.get(normalizeValue(value))
}

function parseRegistrationStatus(value: string): CompetitorRegistrationStatus | null {
  const mapped = STATUS_LOOKUP.get(normalizeValue(value))

  if (mapped === undefined) {
    return null
  }

  return mapped
}

function parseStartEligible(value: string): boolean {
  const normalized = normalizeValue(value)

  if (BOOLEAN_FALSE.has(normalized)) {
    return false
  }

  if (BOOLEAN_TRUE.has(normalized)) {
    return true
  }

  return true
}

function parseBirthDate(value: string): string | undefined {
  const trimmed = value.trim()

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed
  }

  const yearMatch = /^(19|20)\d{2}$/.exec(trimmed)

  if (yearMatch) {
    return `${trimmed}-01-01`
  }

  const dmy = /^(\d{1,2})[./](\d{1,2})[./](\d{2,4})$/.exec(trimmed)

  if (dmy) {
    const day = dmy[1]!.padStart(2, '0')
    const month = dmy[2]!.padStart(2, '0')
    const rawYear = dmy[3]!
    const year = rawYear.length === 2 ? `20${rawYear}` : rawYear.padStart(4, '0')

    return `${year}-${month}-${day}`
  }

  return undefined
}

function parseWeightKg(value: string): number | undefined {
  const numeric = Number(value.replace(',', '.').replace(/[^0-9.]/g, ''))

  if (!Number.isFinite(numeric) || numeric < 20 || numeric > 250) {
    return undefined
  }

  return numeric
}

function optionalText(value: string): string | undefined {
  const trimmed = value.trim()

  return trimmed ? trimmed : undefined
}

function applyImportDefaultsWhenUnmapped(
  participant: TransformedParticipant,
  mapping: ColumnMapping
): void {
  if (!mapping.nationality && !participant.nationality) {
    participant.nationality = IMPORT_UNMAPPED_DEFAULTS.nationality
  }

  if (!mapping.gender && !participant.gender) {
    participant.gender = IMPORT_UNMAPPED_DEFAULTS.gender
  }

  if (!mapping.birthDate && !participant.birthDate) {
    participant.birthDate = IMPORT_UNMAPPED_DEFAULTS.birthDate
  }

  if (!mapping.passNumber && !participant.passNumber) {
    participant.passNumber = IMPORT_UNMAPPED_DEFAULTS.passNumber
  }
}

function columnsBySheet(columns: ParsedColumn[]): Map<string, ParsedColumn[]> {
  const bySheet = new Map<string, ParsedColumn[]>()

  for (const column of columns) {
    const list = bySheet.get(column.sheetName) ?? []
    list.push(column)
    bySheet.set(column.sheetName, list)
  }

  return bySheet
}

/**
 * Returns parsed columns for the primary import sheet.
 *
 * @param bySheet - Parsed columns grouped by sheet name.
 * @param primarySheet - Sheet name selected for row import.
 * @returns Columns for the primary sheet, or an empty array when missing.
 * @internal Exported for unit tests.
 */
export function primarySheetColumns(
  bySheet: Map<string, ParsedColumn[]>,
  primarySheet: string
): ParsedColumn[] {
  const columns = bySheet.get(primarySheet)

  if (columns === undefined) {
    return []
  }

  return columns
}

function findColumn(
  columns: ParsedColumn[],
  columnId: string | undefined
): ParsedColumn | undefined {
  return columnId ? columns.find((column) => column.id === columnId) : undefined
}

function resolvePrimarySheet(columns: ParsedColumn[], mapping: ColumnMapping): string | undefined {
  const anchor =
    findColumn(columns, mapping.familyName) ??
    findColumn(columns, mapping.givenName) ??
    findColumn(columns, mapping.gender)

  return anchor?.sheetName
}

function findClubColumnInSheet(
  columns: ParsedColumn[],
  sheetName: string
): ParsedColumn | undefined {
  return columns.find(
    (column) =>
      column.sheetName === sheetName && CLUB_HEADER_KEYS.has(normalizeHeader(column.header))
  )
}

type ClubContact = { contactPerson?: string; contactPhone?: string }

function buildClubEnrichment(
  columns: ParsedColumn[],
  mapping: ColumnMapping,
  primarySheet: string
): Map<string, ClubContact> {
  const lookup = new Map<string, ClubContact>()
  const contactPersonColumn = findColumn(columns, mapping.contactPerson)
  const phoneColumn = findColumn(columns, mapping.contactPhone)

  const externalColumns = [contactPersonColumn, phoneColumn].filter(
    (column): column is ParsedColumn => Boolean(column) && column!.sheetName !== primarySheet
  )

  if (externalColumns.length === 0) {
    return lookup
  }

  const externalSheet = externalColumns[0]!.sheetName
  const clubColumn =
    findColumn(columns, mapping.club)?.sheetName === externalSheet
      ? findColumn(columns, mapping.club)
      : findClubColumnInSheet(columns, externalSheet)

  if (!clubColumn) {
    return lookup
  }

  const sheetContactPerson =
    contactPersonColumn?.sheetName === externalSheet ? contactPersonColumn : undefined
  const sheetPhone = phoneColumn?.sheetName === externalSheet ? phoneColumn : undefined
  const rowCount = clubColumn.values.length

  for (let index = 0; index < rowCount; index += 1) {
    const clubName = normalizeValue(clubColumn.values[index] ?? '')

    if (!clubName) {
      continue
    }

    lookup.set(clubName, {
      contactPerson: optionalText(sheetContactPerson?.values[index] ?? ''),
      contactPhone: optionalText(sheetPhone?.values[index] ?? '')
    })
  }

  return lookup
}

function findFormField(
  formFields: ParsedFormField[],
  sourceId: string | undefined
): ParsedFormField | undefined {
  return sourceId && isFormSourceId(sourceId)
    ? formFields.find((field) => field.id === sourceId)
    : undefined
}

function readMappedValue(
  columns: ParsedColumn[],
  formFields: ParsedFormField[],
  sourceId: string | undefined,
  primarySheet: string,
  rowIndex: number
): string {
  const formField = findFormField(formFields, sourceId)

  if (formField) {
    return formField.value
  }

  return readPrimaryCell(columns, sourceId, primarySheet, rowIndex)
}

function readPrimaryCell(
  columns: ParsedColumn[],
  columnId: string | undefined,
  primarySheet: string,
  rowIndex: number
): string {
  const column = findColumn(columns, columnId)

  if (!column || column.sheetName !== primarySheet) {
    return ''
  }

  return column.values[rowIndex] ?? ''
}

/**
 * Transforms parsed workbook rows into participant candidates using the mapping.
 *
 * Reads participant fields from the primary sheet (the sheet holding the name
 * columns) and enriches contact person/phone from a separate club sheet by
 * matching the normalized club name.
 *
 * @param workbook - Parsed workbook columns.
 * @param mapping - Confirmed field-to-column mapping.
 * @returns One transformed participant per non-empty primary-sheet data row.
 */
export function transformRows(
  workbook: ParsedWorkbook,
  mapping: ColumnMapping
): TransformedParticipant[] {
  const columns = workbook.columns
  const formFields = workbook.formFields
  const primarySheet = resolvePrimarySheet(columns, mapping)

  if (!primarySheet) {
    return []
  }

  const bySheet = columnsBySheet(columns)
  const primaryColumns = primarySheetColumns(bySheet, primarySheet)
  const rowCount = primaryColumns.reduce((max, column) => Math.max(max, column.values.length), 0)
  const clubEnrichment = buildClubEnrichment(columns, mapping, primarySheet)

  const cell = (field: keyof ColumnMapping, rowIndex: number): string =>
    readMappedValue(
      columns,
      formFields,
      mapping[field as ImportTargetFieldKey],
      primarySheet,
      rowIndex
    )

  const participants: TransformedParticipant[] = []

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const givenName = cell('givenName', rowIndex).trim()
    const familyName = cell('familyName', rowIndex).trim()

    if (!givenName && !familyName) {
      continue
    }

    const club = optionalText(cell('club', rowIndex))
    const enrichment = club ? clubEnrichment.get(normalizeValue(club)) : undefined

    const participant: TransformedParticipant = {
      givenName,
      familyName,
      gender: parseGender(cell('gender', rowIndex)),
      birthDate: parseBirthDate(cell('birthDate', rowIndex)),
      club,
      nationality: optionalText(cell('nationality', rowIndex)),
      weightKg: parseWeightKg(cell('weightKg', rowIndex)),
      passNumber: optionalText(cell('passNumber', rowIndex)),
      grade: optionalText(cell('grade', rowIndex)),
      licenseNumber: optionalText(cell('licenseNumber', rowIndex)),
      contactPerson: optionalText(cell('contactPerson', rowIndex)) ?? enrichment?.contactPerson,
      contactPhone: optionalText(cell('contactPhone', rowIndex)) ?? enrichment?.contactPhone,
      clubContactEmail: optionalText(cell('clubContactEmail', rowIndex)),
      startEligible: mapping.startEligible
        ? parseStartEligible(cell('startEligible', rowIndex))
        : true,
      registrationStatus: mapping.registrationStatus
        ? parseRegistrationStatus(cell('registrationStatus', rowIndex))
        : null,
      remarks: optionalText(cell('remarks', rowIndex))
    }

    applyImportDefaultsWhenUnmapped(participant, mapping)
    participants.push(participant)
  }

  return participants
}

/**
 * Counts participant rows on the primary sheet using the same rules as {@link transformRows}.
 *
 * @param workbook - Parsed workbook columns.
 * @param mapping - Field-to-column mapping used to locate the primary sheet and name columns.
 * @returns Number of participant rows on the primary sheet.
 */
export function countParticipantRows(workbook: ParsedWorkbook, mapping: ColumnMapping): number {
  return transformRows(workbook, mapping).length
}
