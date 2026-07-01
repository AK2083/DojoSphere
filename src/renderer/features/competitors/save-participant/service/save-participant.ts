import { getLocalSessionToken } from '@features/authentication/service/local-session-storage'
import type {
  Competitor,
  CompetitorGender,
  CreateCompetitorInput
} from '@shared/types/electron-api'

import type { ParticipantFormState } from '../model/participant-form-state'

function toOptional(value: string): string | null {
  const trimmed = value.trim()

  return trimmed ? trimmed : null
}

/**
 * Maps participant form state to the IPC create/update input shape.
 *
 * @param fields - Current participant form values.
 * @returns Competitor input payload for the main process.
 */
export function mapFormStateToInput(fields: ParticipantFormState): CreateCompetitorInput {
  return {
    givenName: fields.givenName.trim(),
    familyName: fields.familyName.trim(),
    gender: (fields.gender || undefined) as CompetitorGender | undefined,
    birthDate: fields.birthDate || undefined,
    nationality: fields.nationality || undefined,
    passNumber: fields.passNumber.trim() || undefined,
    clubId: fields.clubId || undefined,
    ageClassId: fields.ageClassId || undefined,
    weightClassId: fields.weightClassId || undefined,
    gradeId: toOptional(fields.gradeId),
    licenseNumber: toOptional(fields.licenseNumber),
    contactPhone: toOptional(fields.contactPhone),
    coach: toOptional(fields.coach)
  }
}

function requireApi() {
  const api = globalThis.window.api

  if (!api) {
    throw new Error('Electron API is not available')
  }

  const token = getLocalSessionToken()

  if (!token) {
    throw new Error('No local session')
  }

  return { api, token }
}

/**
 * Loads a single participant via IPC using the current local session.
 *
 * @param id - Competitor identifier to load.
 * @returns The competitor record from the main process.
 */
export async function loadParticipant(id: string): Promise<Competitor> {
  const { api, token } = requireApi()

  return api.getCompetitor(token, id)
}

/**
 * Persists a new participant via IPC using the current local session.
 *
 * @param fields - Validated participant form values.
 * @returns The created competitor record from the main process.
 */
export async function createParticipant(fields: ParticipantFormState): Promise<Competitor> {
  const { api, token } = requireApi()

  return api.addCompetitor(token, mapFormStateToInput(fields))
}

/**
 * Updates an existing participant via IPC using the current local session.
 *
 * @param id - Competitor identifier to update.
 * @param fields - Validated participant form values.
 * @returns The updated competitor record from the main process.
 */
export async function updateParticipant(
  id: string,
  fields: ParticipantFormState
): Promise<Competitor> {
  const { api, token } = requireApi()

  return api.updateCompetitor(token, id, mapFormStateToInput(fields))
}
