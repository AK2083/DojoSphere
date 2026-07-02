import type { Competitor } from '@shared/types/electron-api'

import { findGradeSeed } from '../../save-participant/model/grade-reference-data'
import { AGE_CLASS_SEEDS } from '../../save-participant/model/static-reference-data'
import overviewKeys from '../i18n/keys'
import type { ParticipantRow } from './participant-row'

type Translate = (key: string, params?: Record<string, unknown>) => string

function resolveReferenceLabelKey(labelKey: string): string {
  return `competitors.saveParticipant.reference.${labelKey}`
}

function resolveAgeClassLabel(t: Translate, ageClassId: string): string {
  const seed = AGE_CLASS_SEEDS.find((ageClass) => ageClass.id === ageClassId)

  return seed ? t(resolveReferenceLabelKey(seed.labelKey)) : ''
}

function resolveGradePresentation(t: Translate, gradeId: string | null) {
  if (!gradeId) {
    return {
      label: t(overviewKeys.emptyGrade),
      beltColorToken: null
    }
  }

  const seed = findGradeSeed(gradeId)

  if (!seed) {
    return {
      label: t(overviewKeys.emptyGrade),
      beltColorToken: null
    }
  }

  return {
    label: t(resolveReferenceLabelKey(seed.labelKey)),
    beltColorToken: seed.beltColorToken
  }
}

/**
 * Maps a persisted competitor record to a translated participant table row.
 *
 * @param competitor - Competitor record loaded from the main process.
 * @param t - Translation function for reference labels and gender.
 * @returns Row shape consumed by the participant overview table.
 */
export function mapCompetitorToRow(competitor: Competitor, t: Translate): ParticipantRow {
  const grade = resolveGradePresentation(t, competitor.gradeId)

  return {
    id: competitor.id,
    createdAt: competitor.createdAt,
    givenName: competitor.givenName,
    familyName: competitor.familyName,
    gender: competitor.gender,
    birthDate: competitor.birthDate,
    club: competitor.club ?? '',
    nationality: competitor.nationality,
    weightClass: competitor.weightClass ?? '',
    ageClass: resolveAgeClassLabel(t, competitor.ageClassId),
    passNumber: competitor.passNumber,
    grade: grade.label,
    gradeBeltColorToken: grade.beltColorToken,
    licenseNumber: competitor.licenseNumber ?? '',
    clubContactEmail: '',
    contactPhone: competitor.contactPhone ?? '',
    coach: competitor.coach ?? ''
  }
}
