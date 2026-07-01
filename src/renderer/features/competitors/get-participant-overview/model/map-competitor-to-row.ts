import type { Competitor } from '@shared/types/electron-api'

import { AGE_CLASS_SEEDS, GRADE_SEEDS } from '../../save-participant/model/static-reference-data'
import overviewKeys from '../i18n/keys'
import type { ParticipantRow } from './static-participants'

type Translate = (key: string, params?: Record<string, unknown>) => string

function resolveReferenceLabelKey(labelKey: string): string {
  return `competitors.saveParticipant.reference.${labelKey}`
}

function resolveAgeClassLabel(t: Translate, ageClassId: string): string {
  const seed = AGE_CLASS_SEEDS.find((ageClass) => ageClass.id === ageClassId)

  return seed ? t(resolveReferenceLabelKey(seed.labelKey)) : ''
}

function resolveGradeLabel(t: Translate, gradeId: string | null): string {
  if (!gradeId) {
    return t(overviewKeys.emptyGrade)
  }

  const seed = GRADE_SEEDS.find((grade) => grade.id === gradeId)

  return seed ? t(resolveReferenceLabelKey(seed.labelKey)) : t(overviewKeys.emptyGrade)
}

/**
 * Maps a persisted competitor record to a translated participant table row.
 *
 * @param competitor - Competitor record loaded from the main process.
 * @param t - Translation function for reference labels and gender.
 * @returns Row shape consumed by the participant overview table.
 */
export function mapCompetitorToRow(competitor: Competitor, t: Translate): ParticipantRow {
  return {
    id: competitor.id,
    givenName: competitor.givenName,
    familyName: competitor.familyName,
    gender: competitor.gender,
    birthDate: competitor.birthDate,
    club: competitor.club ?? '',
    nationality: competitor.nationality,
    weightClass: competitor.weightClass ?? '',
    ageClass: resolveAgeClassLabel(t, competitor.ageClassId),
    passNumber: competitor.passNumber,
    grade: resolveGradeLabel(t, competitor.gradeId),
    licenseNumber: competitor.licenseNumber ?? '',
    clubContactEmail: '',
    contactPhone: competitor.contactPhone ?? '',
    coach: competitor.coach ?? ''
  }
}
