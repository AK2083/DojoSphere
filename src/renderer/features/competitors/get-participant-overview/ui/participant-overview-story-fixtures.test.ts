import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  installStorybookParticipantApi,
  installStorybookParticipantApiError,
  installStorybookParticipantApiLoading,
  resetStorybookParticipantApi,
  storyCompetitors,
  storyFieldHeaders,
  storyParticipants
} from './participant-overview-story-fixtures'

const STORYBOOK_SESSION_TOKEN = 'storybook-local-session'

describe('participant-overview-story-fixtures', () => {
  beforeEach(() => {
    globalThis.localStorage.clear()
    globalThis.window.api = {} as typeof globalThis.window.api
  })

  afterEach(() => {
    vi.useRealTimers()
    resetStorybookParticipantApi()
  })

  it('exports unique participant ids for card stories', () => {
    const ids = storyParticipants.map((participant) => participant.id)

    expect(ids).toHaveLength(3)
    expect(new Set(ids).size).toBe(3)
  })

  it('exports competitors aligned with card story ids', () => {
    expect(storyCompetitors.map((competitor) => competitor.id)).toEqual(
      storyParticipants.map((participant) => participant.id)
    )
  })

  it('includes headers required by participant entry summaries', () => {
    const keys = storyFieldHeaders.map((header) => header.key)

    expect(keys).toEqual(
      expect.arrayContaining(['weightClass', 'ageClass', 'gender', 'grade', 'passNumber', 'club'])
    )
  })

  it('installs storybook participant api stubs', async () => {
    installStorybookParticipantApi()

    await expect(globalThis.window.api.getCompetitors(STORYBOOK_SESSION_TOKEN)).resolves.toEqual(
      storyCompetitors
    )
    await expect(globalThis.window.api.getCompetitors('other-token')).resolves.toEqual([])
    await expect(globalThis.window.api.deleteCompetitor()).resolves.toBeUndefined()
  })

  it('installs custom competitors in storybook api stub', async () => {
    const competitors = [storyCompetitors[0]!]

    installStorybookParticipantApi(competitors)

    await expect(globalThis.window.api.getCompetitors(STORYBOOK_SESSION_TOKEN)).resolves.toEqual(
      competitors
    )
  })

  it('installs storybook participant api error stub', async () => {
    installStorybookParticipantApiError()

    await expect(globalThis.window.api.getCompetitors(STORYBOOK_SESSION_TOKEN)).rejects.toThrow(
      'Participants could not be loaded.'
    )
  })

  it('installs storybook participant api loading stub', async () => {
    vi.useFakeTimers()
    installStorybookParticipantApiLoading(25)

    const pending = globalThis.window.api.getCompetitors(STORYBOOK_SESSION_TOKEN)

    vi.advanceTimersByTime(25)

    await expect(pending).resolves.toEqual([])
  })

  it('clears storybook session state', () => {
    globalThis.localStorage.setItem('dojosphere.auth.local.session', STORYBOOK_SESSION_TOKEN)

    resetStorybookParticipantApi()

    expect(globalThis.localStorage.getItem('dojosphere.auth.local.session')).toBeNull()
  })
})
