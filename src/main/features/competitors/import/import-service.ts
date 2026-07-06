import { COMPETITOR_IMPORT_FIELDS } from '@shared/domain/competitor-import-fields'
import type {
  ImportExecuteResult,
  ImportPreviewResult,
  ImportRowResult
} from '@shared/types/electron-api'

import { getDatabase } from '@main/shared/database'
import { DEFAULT_AGE_CLASS_ID } from '@main/shared/database/reference-seed-ids'

import {
  type CreateCompetitorInput,
  importCompetitors,
  resolveGradeIdFromText,
  resolveWeightClassIdFromKg,
  upsertClubContactEmail
} from '../repository/competitors.repository'
import {
  buildCompetitorDuplicateKeys,
  DUPLICATE_IN_IMPORT_ERROR,
  serializeCompetitorDuplicateKey
} from '../repository/competitor-duplicate'
import { type ColumnMapping, matchColumns } from './match-columns'
import { composeParticipantRemarks } from './compose-remarks'
import {
  hasImportWeight,
  importResultRowLabel,
  isImportRowSuccessful,
  toImportNullable
} from './import-service-helpers'
import { parseWorkbook, type ParsedWorkbook, sampleColumnValues } from './parse-workbook'
import { countParticipantRows, transformRows } from './transform-row'

/** Progress callback invoked after each processed import row. */
export type ImportProgressListener = (processed: number, total: number) => void

function toPreview(workbook: ParsedWorkbook): ImportPreviewResult {
  const suggestion = matchColumns(workbook)
  const rowCount = countParticipantRows(workbook, suggestion.mapping)

  return {
    columns: [
      ...workbook.columns.map((column) => ({
        id: column.id,
        sheetName: column.sheetName,
        header: column.header,
        sampleValues: sampleColumnValues(column),
        sourceKind: 'column' as const
      })),
      ...workbook.formFields.map((field) => ({
        id: field.id,
        sheetName: field.sheetName,
        header: field.label,
        sampleValues: [field.value],
        sourceKind: 'form' as const
      }))
    ],
    fields: COMPETITOR_IMPORT_FIELDS.map((field) => ({
      key: field.key,
      required: field.required
    })),
    suggestedMapping: suggestion.mapping as Record<string, string>,
    sources: suggestion.sources as Record<string, 'data' | 'header' | 'manual'>,
    mappingValid: suggestion.mappingValid,
    missingRequiredFields: suggestion.missingRequiredFields,
    rowCount
  }
}

/**
 * Parses a workbook and builds an auto-mapping suggestion for the mapping step.
 *
 * @param buffer - Raw uploaded workbook contents.
 * @returns Detected columns, target fields, and the suggested mapping.
 */
export function previewImport(buffer: ArrayBuffer | Uint8Array): ImportPreviewResult {
  return toPreview(parseWorkbook(buffer))
}

/**
 * Executes a participant import for a confirmed column mapping.
 *
 * Each row is transformed and validated, then persisted atomically per row. A
 * failing row never writes a partial record and does not stop other rows.
 *
 * @param actorUserId - User performing the import.
 * @param buffer - Raw uploaded workbook contents.
 * @param mapping - Confirmed field-to-column mapping.
 * @param onProgress - Optional per-row progress callback.
 * @returns Per-row results and aggregate counts.
 */
export function executeImport(
  actorUserId: string,
  buffer: ArrayBuffer | Uint8Array,
  mapping: ColumnMapping,
  onProgress?: ImportProgressListener
): ImportExecuteResult {
  const workbook = parseWorkbook(buffer)
  const participants = transformRows(workbook, mapping)

  if (participants.length === 0) {
    throw new Error('empty_workbook')
  }

  const db = getDatabase()
  const gradeHeader = mapping.grade
    ? workbook.columns.find((column) => column.id === mapping.grade)?.header
    : undefined

  const inputs: CreateCompetitorInput[] = participants.map((participant) => {
    const input: CreateCompetitorInput = {
      givenName: participant.givenName,
      familyName: participant.familyName,
      gender: toImportNullable(participant.gender),
      birthDate: toImportNullable(participant.birthDate),
      club: toImportNullable(participant.club),
      nationality: toImportNullable(participant.nationality),
      passNumber: toImportNullable(participant.passNumber),
      licenseNumber: toImportNullable(participant.licenseNumber),
      contactPerson: toImportNullable(participant.contactPerson),
      contactPhone: toImportNullable(participant.contactPhone),
      startEligible: participant.startEligible,
      registrationStatus: toImportNullable(participant.registrationStatus),
      remarks: composeParticipantRemarks(participant),
      ageClassId: DEFAULT_AGE_CLASS_ID
    }

    if (mapping.grade && participant.grade) {
      input.gradeId = resolveGradeIdFromText(db, participant.grade, gradeHeader) ?? undefined
    }

    if (hasImportWeight(participant.weightKg)) {
      input.weightClassId =
        resolveWeightClassIdFromKg(db, participant.weightKg!, DEFAULT_AGE_CLASS_ID) ?? undefined
    }

    return input
  })

  const total = inputs.length
  const results: ImportRowResult[] = []
  let importedCount = 0
  let failedCount = 0
  const seenDuplicateKeys = new Set<string>()

  inputs.forEach((input, index) => {
    const duplicateKeys = buildCompetitorDuplicateKeys(input)
    const duplicateInImport = duplicateKeys.some((key) =>
      seenDuplicateKeys.has(serializeCompetitorDuplicateKey(key))
    )

    if (duplicateInImport) {
      failedCount += 1
      results.push({
        index,
        givenName: importResultRowLabel(participants[index], 'givenName'),
        familyName: importResultRowLabel(participants[index], 'familyName'),
        club: importResultRowLabel(participants[index], 'club'),
        success: false,
        errorCode: DUPLICATE_IN_IMPORT_ERROR
      })
      onProgress?.(index + 1, total)
      return
    }

    duplicateKeys.forEach((key) => seenDuplicateKeys.add(serializeCompetitorDuplicateKey(key)))

    const [rowResult] = importCompetitors(actorUserId, [input])
    const success = isImportRowSuccessful(rowResult)

    if (success) {
      importedCount += 1

      const clubContactEmail = participants[index]?.clubContactEmail
      const clubId = rowResult?.competitor?.clubId

      if (clubContactEmail && clubId) {
        upsertClubContactEmail(db, clubId, clubContactEmail)
      }
    } else {
      failedCount += 1
    }

    results.push({
      index,
      givenName: importResultRowLabel(participants[index], 'givenName'),
      familyName: importResultRowLabel(participants[index], 'familyName'),
      club: importResultRowLabel(participants[index], 'club'),
      success,
      errorCode: rowResult?.errorCode
    })

    onProgress?.(index + 1, total)
  })

  return { results, importedCount, failedCount }
}
