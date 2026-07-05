import {
  COMPETITOR_IMPORT_FIELDS,
  COMPETITOR_IMPORT_SYNONYMS_DE,
  COMPETITOR_IMPORT_SYNONYMS_EN,
  type ImportFieldDataType,
  type ImportTargetFieldKey,
  REQUIRED_IMPORT_FIELD_KEYS
} from '@shared/domain/competitor-import-fields'
import Fuse from 'fuse.js'

import { inferColumnDataType } from './infer-data-type'
import { isCompatibleFieldMapping } from './match-field-data-type'
import { isEmailHeader } from './parse-email'
import {
  isAreaHeader,
  isClubHeader,
  isContactPersonHeader,
  isEventMetadataHeader,
  isLicenseNumberHeader,
  isNationalityHeader,
  isPassNumberHeader,
  isRegistrationStatusHeader
} from './parse-identifiers'
import { normalizeHeader } from './normalize-text'
import {
  isFormSourceId,
  type ParsedColumn,
  type ParsedWorkbook,
  sampleColumnValues
} from './parse-workbook'
import type { ParsedFormField } from './parse-form-fields'

/** Minimum header similarity (0..1) required for an automatic header match. */
const MIN_HEADER_SIMILARITY = 0.5

export /**
 *
 */
const headerMatchPolicy = {
  /**
   * Returns whether an adjusted header similarity is strong enough for auto-mapping.
   *
   * @param adjustedSimilarity - Similarity score after header specificity weighting.
   * @returns True when the score meets the automatic mapping threshold.
   */
  accepts(adjustedSimilarity: number): boolean {
    return adjustedSimilarity >= MIN_HEADER_SIMILARITY
  }
}

/**
 * Returns whether an adjusted header similarity is strong enough for auto-mapping.
 *
 * @param adjustedSimilarity - Similarity score after header specificity weighting.
 * @returns True when the score meets the automatic mapping threshold.
 */
export function acceptsAutomaticHeaderMatch(adjustedSimilarity: number): boolean {
  return headerMatchPolicy.accepts(adjustedSimilarity)
}

/**
 * Minimum normalized header length for a fuzzy match. Very short headers such as
 * `"Nr."` are too generic and must not fuzzy-grab specific fields (e.g. a running
 * number stealing the pass number). Exact synonym matches are exempt.
 */
const MIN_FUZZY_HEADER_LENGTH = 4

/** How a target field was mapped to a source column. */
export type ColumnMappingSource = 'data' | 'header' | 'manual'

/** Suggested mapping from target field key to a source column id. */
export type ColumnMapping = Partial<Record<ImportTargetFieldKey, string>>

/** Result of the automatic column matching step. */
export type MappingSuggestion = {
  mapping: ColumnMapping
  sources: Partial<Record<ImportTargetFieldKey, ColumnMappingSource>>
  mappingValid: boolean
  missingRequiredFields: ImportTargetFieldKey[]
}

type SynonymTerm = { field: ImportTargetFieldKey; term: string }

type Candidate = {
  field: ImportTargetFieldKey
  columnId: string
  similarity: number
  source: ColumnMappingSource
}

const SYNONYM_TERMS: SynonymTerm[] = buildSynonymTerms()

const EXACT_HEADER_INDEX: Map<string, ImportTargetFieldKey> = buildExactIndex()

const DATA_TYPE_TO_FIELD: Partial<Record<ImportFieldDataType, ImportTargetFieldKey>> = {
  gender: 'gender',
  date: 'birthDate',
  email: 'clubContactEmail',
  grade: 'grade',
  weightKg: 'weightKg',
  boolean: 'startEligible',
  registrationStatus: 'registrationStatus'
}

const fuse = new Fuse(SYNONYM_TERMS, {
  keys: ['term'],
  includeScore: true,
  threshold: 0.45,
  ignoreLocation: true,
  minMatchCharLength: 2
})

function buildSynonymTerms(): SynonymTerm[] {
  const terms: SynonymTerm[] = []

  for (const synonyms of [COMPETITOR_IMPORT_SYNONYMS_DE, COMPETITOR_IMPORT_SYNONYMS_EN]) {
    for (const field of Object.keys(synonyms) as ImportTargetFieldKey[]) {
      for (const term of synonyms[field]) {
        terms.push({ field, term })
      }
    }
  }

  return terms
}

function buildExactIndex(): Map<string, ImportTargetFieldKey> {
  const index = new Map<string, ImportTargetFieldKey>()

  for (const { field, term } of SYNONYM_TERMS) {
    const key = normalizeHeader(term)

    if (key && !index.has(key)) {
      index.set(key, field)
    }
  }

  return index
}

function fieldSynonymsNormalized(field: ImportTargetFieldKey): string[] {
  return [...COMPETITOR_IMPORT_SYNONYMS_DE[field], ...COMPETITOR_IMPORT_SYNONYMS_EN[field]]
    .map(normalizeHeader)
    .filter(Boolean)
}

/**
 * Scores how specifically a header matches a target field's synonyms.
 *
 * Longer, more distinctive matches (e.g. `Pass.-Nr.` for pass number) score
 * higher than short generic fragments (e.g. `Nr.` embedded in a longer synonym).
 * @param header
 * @param field
 * @returns Specificity score between 0 and 1.
 */
export function headerFieldSpecificity(header: string, field: ImportTargetFieldKey): number {
  const normalized = normalizeHeader(header)

  if (!normalized) {
    return 0
  }

  let best = 0

  for (const term of fieldSynonymsNormalized(field)) {
    if (normalized === term) {
      return 1
    }

    if (term.length >= MIN_FUZZY_HEADER_LENGTH && normalized.includes(term)) {
      best = Math.max(best, term.length / normalized.length)
    }

    if (
      normalized.length >= MIN_FUZZY_HEADER_LENGTH &&
      term.includes(normalized) &&
      normalized.length < term.length
    ) {
      best = Math.max(best, (normalized.length / term.length) * 0.5)
    }
  }

  return best
}

function effectiveSimilarity(
  header: string,
  field: ImportTargetFieldKey,
  baseSimilarity: number
): number {
  const specificity = headerFieldSpecificity(header, field)

  if (specificity === 1) {
    return 1
  }

  return baseSimilarity + specificity * (1 - baseSimilarity)
}

function bestHeaderSimilarities(header: string): Map<ImportTargetFieldKey, number> {
  const similarities = new Map<ImportTargetFieldKey, number>()
  const normalized = normalizeHeader(header)

  if (!normalized) {
    return similarities
  }

  const exactField = EXACT_HEADER_INDEX.get(normalized)

  if (exactField) {
    similarities.set(exactField, 1)
  }

  if (normalized.length < MIN_FUZZY_HEADER_LENGTH) {
    return similarities
  }

  for (const result of fuse.search(header)) {
    const similarity = 1 - (result.score ?? 1)
    const field = result.item.field
    const current = similarities.get(field) ?? 0

    if (similarity > current) {
      similarities.set(field, similarity)
    }
  }

  return similarities
}

/** Boosted similarity for unambiguous identifier headers such as Pass-Nr. */
const DEDICATED_HEADER_SIMILARITY = 1.25

/** Prefer participant table columns over registration form header fields. */
const TABLE_COLUMN_PREFERENCE_BOOST = 0.2

function rankedCandidateSimilarity(candidate: Candidate): number {
  const tableBoost = isFormSourceId(candidate.columnId) ? 0 : TABLE_COLUMN_PREFERENCE_BOOST

  return candidate.similarity + tableBoost
}

function collectDedicatedIdentifierCandidates(columns: ParsedColumn[]): Candidate[] {
  const candidates: Candidate[] = []

  for (const column of columns) {
    if (isEventMetadataHeader(column.header)) {
      continue
    }

    const samples = sampleColumnValues(column)

    if (
      isPassNumberHeader(column.header) &&
      isCompatibleFieldMapping('passNumber', column.header, samples)
    ) {
      candidates.push({
        field: 'passNumber',
        columnId: column.id,
        similarity: DEDICATED_HEADER_SIMILARITY,
        source: 'header'
      })
      continue
    }

    if (
      isLicenseNumberHeader(column.header) &&
      isCompatibleFieldMapping('licenseNumber', column.header, samples)
    ) {
      candidates.push({
        field: 'licenseNumber',
        columnId: column.id,
        similarity: DEDICATED_HEADER_SIMILARITY,
        source: 'header'
      })
      continue
    }

    if (isClubHeader(column.header) && isCompatibleFieldMapping('club', column.header, samples)) {
      candidates.push({
        field: 'club',
        columnId: column.id,
        similarity: DEDICATED_HEADER_SIMILARITY,
        source: 'header'
      })
      continue
    }

    if (
      isContactPersonHeader(column.header) &&
      isCompatibleFieldMapping('contactPerson', column.header, samples)
    ) {
      candidates.push({
        field: 'contactPerson',
        columnId: column.id,
        similarity: DEDICATED_HEADER_SIMILARITY,
        source: 'header'
      })
    }
  }

  return candidates
}

/**
 * Rejects fuzzy header matches that conflict with a header's unambiguous meaning.
 *
 * Prevents generic short synonyms (e.g. `Nat` for nationality) from grabbing a
 * clearly different column such as `Status`, and vice versa.
 * @param header
 * @param field
 * @returns True when the fuzzy match should be rejected.
 */
export function isConflictingHeaderMatch(header: string, field: ImportTargetFieldKey): boolean {
  if (isEventMetadataHeader(header)) {
    return true
  }

  if (field === 'remarks' && isEmailHeader(header)) {
    return true
  }

  if (field === 'licenseNumber' && isPassNumberHeader(header)) {
    return true
  }

  if (field === 'passNumber' && isLicenseNumberHeader(header)) {
    return true
  }

  if (field === 'nationality' && isRegistrationStatusHeader(header)) {
    return true
  }

  if (field === 'registrationStatus' && isNationalityHeader(header)) {
    return true
  }

  if (field === 'club' && isAreaHeader(header)) {
    return true
  }

  if (field === 'contactPerson' && isEmailHeader(header)) {
    return true
  }

  if (field === 'clubContactEmail' && isContactPersonHeader(header)) {
    return true
  }

  return false
}

function collectFormFieldCandidates(formFields: ParsedFormField[]): Candidate[] {
  const candidates: Candidate[] = []

  for (const field of formFields) {
    if (isEventMetadataHeader(field.label)) {
      continue
    }

    const samples = field.value ? [field.value] : []
    const similarities = bestHeaderSimilarities(field.label)

    for (const [targetField, similarity] of similarities) {
      if (isConflictingHeaderMatch(field.label, targetField)) {
        continue
      }

      if (!isCompatibleFieldMapping(targetField, field.label, samples)) {
        continue
      }

      const adjusted = effectiveSimilarity(field.label, targetField, similarity)

      if (headerMatchPolicy.accepts(adjusted)) {
        candidates.push({
          field: targetField,
          columnId: field.id,
          similarity: adjusted,
          source: 'header'
        })
      }
    }
  }

  return candidates
}

function collectHeaderCandidates(columns: ParsedColumn[]): Candidate[] {
  const candidates: Candidate[] = []

  for (const column of columns) {
    if (isEventMetadataHeader(column.header)) {
      continue
    }

    const samples = sampleColumnValues(column)
    const similarities = bestHeaderSimilarities(column.header)

    for (const [field, similarity] of similarities) {
      if (isConflictingHeaderMatch(column.header, field)) {
        continue
      }

      if (!isCompatibleFieldMapping(field, column.header, samples)) {
        continue
      }

      const adjusted = effectiveSimilarity(column.header, field, similarity)

      if (headerMatchPolicy.accepts(adjusted)) {
        candidates.push({ field, columnId: column.id, similarity: adjusted, source: 'header' })
      }
    }
  }

  return candidates
}

function assignGreedily(
  candidates: Candidate[],
  mapping: ColumnMapping,
  sources: Partial<Record<ImportTargetFieldKey, ColumnMappingSource>>,
  usedColumns: Set<string>
): void {
  const ordered = [...candidates].sort(
    (left, right) => rankedCandidateSimilarity(right) - rankedCandidateSimilarity(left)
  )

  for (const candidate of ordered) {
    if (mapping[candidate.field] || usedColumns.has(candidate.columnId)) {
      continue
    }

    mapping[candidate.field] = candidate.columnId
    sources[candidate.field] = candidate.source
    usedColumns.add(candidate.columnId)
  }
}

function applyDataTypeFallback(
  columns: ParsedColumn[],
  mapping: ColumnMapping,
  sources: Partial<Record<ImportTargetFieldKey, ColumnMappingSource>>,
  usedColumns: Set<string>
): void {
  for (const column of columns) {
    if (usedColumns.has(column.id) || isEventMetadataHeader(column.header)) {
      continue
    }

    const samples = sampleColumnValues(column)
    const dataType = inferColumnDataType(samples, column.header)
    const field = DATA_TYPE_TO_FIELD[dataType]

    if (!field || mapping[field]) {
      continue
    }

    if (!isCompatibleFieldMapping(field, column.header, samples)) {
      continue
    }

    mapping[field] = column.id
    sources[field] = 'data'
    usedColumns.add(column.id)
  }
}

/**
 * Builds an automatic column-to-field mapping suggestion for a workbook.
 *
 * Runs exact/synonym matching, fuzzy matching (fuse.js), then a data-type
 * fallback for still-unmapped fields. Assignment is greedy by similarity across
 * all sheets so the highest-confidence column wins per field.
 *
 * @param workbook - Parsed workbook columns.
 * @returns Suggested mapping, per-field source, and required-field validity.
 */
export function matchColumns(workbook: ParsedWorkbook): MappingSuggestion {
  const mapping: ColumnMapping = {}
  const sources: Partial<Record<ImportTargetFieldKey, ColumnMappingSource>> = {}
  const usedColumns = new Set<string>()

  const headerCandidates = [
    ...collectDedicatedIdentifierCandidates(workbook.columns),
    ...collectHeaderCandidates(workbook.columns),
    ...collectFormFieldCandidates(workbook.formFields)
  ]

  assignGreedily(headerCandidates, mapping, sources, usedColumns)
  applyDataTypeFallback(workbook.columns, mapping, sources, usedColumns)

  const missingRequiredFields = REQUIRED_IMPORT_FIELD_KEYS.filter((field) => !mapping[field])

  return {
    mapping,
    sources,
    mappingValid: missingRequiredFields.length === 0,
    missingRequiredFields: [...missingRequiredFields]
  }
}

/** Target field keys ordered as defined in the shared registry. */
export const IMPORT_FIELD_KEYS: readonly ImportTargetFieldKey[] = COMPETITOR_IMPORT_FIELDS.map(
  (field) => field.key
)
