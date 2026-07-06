import { describe, expect, it } from 'vitest'

import {
  importErrorLogMessage,
  importErrorTranslationKey,
  importRowErrorTranslationKey
} from './resolve-import-error'

describe('resolve-import-error', () => {
  it('maps sqlite schema errors to a restart hint key', () => {
    expect(importErrorTranslationKey(new Error('no such column: c.start_eligible'))).toBe(
      'competitors.importParticipants.steps.import.errors.databaseSchema'
    )
  })

  it('maps clone failures to a file transfer hint key', () => {
    expect(importErrorTranslationKey(new Error('An object could not be cloned.'))).toBe(
      'competitors.importParticipants.steps.import.errors.fileTransfer'
    )
  })

  it('returns technical messages for logging only', () => {
    const error = new Error('no such column: c.start_eligible')

    expect(importErrorLogMessage(error)).toContain('no such column')
  })

  it('maps known row error codes', () => {
    expect(importRowErrorTranslationKey('import_failed')).toBe(
      'competitors.importParticipants.steps.import.rowErrors.importFailed'
    )
    expect(importRowErrorTranslationKey('duplicate_competitor')).toBe(
      'competitors.importParticipants.steps.import.rowErrors.duplicateCompetitor'
    )
    expect(importRowErrorTranslationKey('duplicate_in_import')).toBe(
      'competitors.importParticipants.steps.import.rowErrors.duplicateInImport'
    )
  })

  it('returns undefined for missing row error codes', () => {
    expect(importRowErrorTranslationKey(undefined)).toBeUndefined()
  })

  it('stringifies non-error values for logging', () => {
    expect(importErrorLogMessage('plain failure')).toBe('plain failure')
  })

  it('uses the error stack when available', () => {
    const error = new Error('stack me')

    error.stack = 'stack trace'

    expect(importErrorLogMessage(error)).toBe('stack trace')
  })

  it('falls back to the message when the stack is missing', () => {
    const error = new Error('message only')

    error.stack = undefined

    expect(importErrorLogMessage(error)).toBe('message only')
  })
})
