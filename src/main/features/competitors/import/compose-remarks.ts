import { COMPETITOR_REMARKS_MAX_LENGTH } from '@shared/domain/competitor-field-limits'

import type { TransformedParticipant } from './transform-row'

/**
 * Returns trimmed participant remarks capped at the database limit.
 *
 * @param participant - Transformed participant including optional remarks text.
 * @returns Remarks text or null when empty.
 */
export function composeParticipantRemarks(participant: TransformedParticipant): string | null {
  const trimmed = participant.remarks?.trim()

  if (!trimmed) {
    return null
  }

  return trimmed.slice(0, COMPETITOR_REMARKS_MAX_LENGTH)
}
