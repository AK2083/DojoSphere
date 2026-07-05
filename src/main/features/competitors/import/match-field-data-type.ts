import {
  COMPETITOR_IMPORT_FIELDS,
  type ImportFieldDataType,
  type ImportTargetFieldKey
} from '@shared/domain/competitor-import-fields'

import { inferColumnDataType } from './infer-data-type'
import {
  isEventMetadataHeader,
  isLicenseNumberHeader,
  isPassNumberHeader
} from './parse-identifiers'

const FIELD_DATA_TYPE = new Map<ImportTargetFieldKey, ImportFieldDataType>(
  COMPETITOR_IMPORT_FIELDS.map((field) => [field.key, field.dataType])
)

/**
 * Returns whether sample values and header are compatible with a target field.
 *
 * Prevents mapping date columns to number fields and similar type mismatches.
 *
 * @param field - Import target field key.
 * @param header - Source column or form label.
 * @param samples - Sample cell values from the source column.
 * @returns True when sample values and header match the target field type.
 */
export function isCompatibleFieldMapping(
  field: ImportTargetFieldKey,
  header: string,
  samples: string[]
): boolean {
  if (isEventMetadataHeader(header)) {
    return false
  }

  const inferred = inferColumnDataType(samples, header)
  const expected = FIELD_DATA_TYPE.get(field) ?? 'text'

  if (field === 'licenseNumber' || field === 'passNumber') {
    return inferred !== 'date' && inferred !== 'email' && inferred !== 'gender'
  }

  if (field === 'birthDate') {
    if (isLicenseNumberHeader(header) || isPassNumberHeader(header)) {
      return false
    }

    return inferred === 'date' || inferred === 'text'
  }

  if (expected === 'gender') {
    return inferred === 'gender' || inferred === 'text'
  }

  if (expected === 'email') {
    return inferred === 'email' || inferred === 'text'
  }

  if (expected === 'grade') {
    return inferred === 'grade' || inferred === 'text'
  }

  if (expected === 'weightKg') {
    return inferred === 'weightKg' || inferred === 'text'
  }

  if (expected === 'registrationStatus') {
    return inferred === 'registrationStatus' || inferred === 'text'
  }

  if (expected === 'boolean') {
    return inferred === 'boolean' || inferred === 'text'
  }

  return true
}
