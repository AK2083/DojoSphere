import type { CreateCompetitorInput } from '@shared/types/electron-api'
import type { Page } from '@playwright/test'

/** Local session token key — must match `local-session-storage.ts`. */
export const LOCAL_SESSION_STORAGE_KEY = 'dojosphere.auth.local.session'

/**
 * Fictional competitor inputs for Playwright browser-only tests.
 * Not used in production or the default e2e API stub.
 */
export const PLAYWRIGHT_PARTICIPANT_INPUTS: CreateCompetitorInput[] = [
  {
    givenName: 'Yuki',
    familyName: 'Tanaka',
    gender: 'm',
    birthDate: '2011-04-12',
    nationality: 'DE',
    passNumber: 'JP-000142',
    club: 'Dojo Nord',
    weightClass: '-60',
    licenseNumber: 'WL-2024-001',
    contactPhone: '+49 555 010201',
    coach: 'S. Fischer',
    clubId: '00000000-0000-0000-0000-000000000000',
    weightClassId: 'b3000000-0000-4000-8000-000000000001',
    ageClassId: 'c2000000-0000-4000-8000-000000000003'
  },
  {
    givenName: 'Anna',
    familyName: 'Weber',
    gender: 'f',
    birthDate: '2013-08-03',
    nationality: 'DE',
    passNumber: 'JP-000287',
    club: 'JC West',
    weightClass: '-52',
    licenseNumber: 'WL-2024-014',
    contactPhone: '+49 555 010202',
    coach: 'M. Keller',
    clubId: '00000000-0000-0000-0000-000000000000',
    weightClassId: 'b3000000-0000-4000-8000-000000000001',
    ageClassId: 'c2000000-0000-4000-8000-000000000003'
  },
  {
    givenName: 'Leo',
    familyName: 'Martin',
    gender: 'm',
    birthDate: '2009-11-21',
    nationality: 'AT',
    passNumber: 'JP-000391',
    club: 'SV Süd',
    weightClass: '-73',
    licenseNumber: 'WL-2024-028',
    contactPhone: '+43 555 010203',
    coach: 'T. Brandt',
    clubId: '00000000-0000-0000-0000-000000000000',
    weightClassId: 'b3000000-0000-4000-8000-000000000001',
    ageClassId: 'c2000000-0000-4000-8000-000000000003'
  }
]

/**
 * Seeds fictional participants into the Playwright browser-only API stub.
 *
 * @param page - Playwright page with an established local session.
 */
export async function seedPlaywrightParticipants(page: Page): Promise<void> {
  await page.waitForFunction(
    (key) => localStorage.getItem(key) != null,
    LOCAL_SESSION_STORAGE_KEY,
    { timeout: 10_000 }
  )

  const alreadySeeded = await page.evaluate(async (key) => {
    const token = localStorage.getItem(key)

    if (!token) {
      return false
    }

    const existing = await window.api.getCompetitors(token)

    return existing.length > 0
  }, LOCAL_SESSION_STORAGE_KEY)

  if (alreadySeeded) {
    return
  }

  await page.evaluate(
    async ({ key, inputs }) => {
      const token = localStorage.getItem(key)

      if (!token) {
        throw new Error('Missing local session token')
      }

      for (const input of inputs) {
        await window.api.addCompetitor(token, input)
      }
    },
    { key: LOCAL_SESSION_STORAGE_KEY, inputs: PLAYWRIGHT_PARTICIPANT_INPUTS }
  )
}

/**
 * Resolves a seeded Playwright participant id by given name.
 *
 * @param page - Playwright page with seeded participants.
 * @param givenName - Competitor given name to look up.
 * @returns Competitor id from the browser-only API stub.
 */
export async function getPlaywrightParticipantId(page: Page, givenName: string): Promise<string> {
  const id = await page.evaluate(
    async ({ key, name }) => {
      const token = localStorage.getItem(key)

      if (!token) {
        return null
      }

      const competitors = await window.api.getCompetitors(token)

      return competitors.find((competitor) => competitor.givenName === name)?.id ?? null
    },
    { key: LOCAL_SESSION_STORAGE_KEY, name: givenName }
  )

  if (!id) {
    throw new Error(`Playwright participant not found: ${givenName}`)
  }

  return id
}
