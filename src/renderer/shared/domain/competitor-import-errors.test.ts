import {
  buildImportIpcErrorMessage,
  classifyImportError,
  parsePrefixedImportError,
  toImportIpcError
} from '@shared/domain/competitor-import-errors'
import { describe, expect, it } from 'vitest'

describe('competitor-import-errors', () => {
  it('classifies common sqlite schema failures', () => {
    expect(classifyImportError(new Error('no such column: c.start_eligible'))).toBe(
      'database_schema'
    )
  })

  it('classifies ipc clone failures', () => {
    expect(classifyImportError(new Error('An object could not be cloned.'))).toBe('file_transfer')
  })

  it('round-trips structured ipc error messages', () => {
    const message = buildImportIpcErrorMessage(
      'database_schema',
      'no such column: c.start_eligible'
    )

    expect(parsePrefixedImportError(message)).toEqual({
      code: 'database_schema',
      originalMessage: 'no such column: c.start_eligible'
    })
    expect(classifyImportError(new Error(message))).toBe('database_schema')
  })

  it('wraps errors for ipc handlers', () => {
    const wrapped = toImportIpcError(new Error('no such column: c.start_eligible'))

    expect(wrapped.message).toBe('IMPORT:database_schema|no such column: c.start_eligible')
  })

  it('classifies session, authorization, database, parse and empty workbook failures', () => {
    expect(classifyImportError(new Error('No local session'))).toBe('no_session')
    expect(classifyImportError(new Error('Unauthorized access'))).toBe('unauthorized')
    expect(classifyImportError(new Error('no such table: competitors'))).toBe('database_schema')
    expect(classifyImportError(new Error('SQLITE_CONSTRAINT: err_sqlite'))).toBe('database_error')
    expect(classifyImportError(new Error('empty_workbook'))).toBe('empty_workbook')
    expect(classifyImportError(new Error('invalid file format'))).toBe('parse_failed')
    expect(classifyImportError('unexpected')).toBe('generic')
  })

  it('rejects malformed prefixed import error payloads', () => {
    expect(parsePrefixedImportError('IMPORT:unknown|message')).toBeUndefined()
    expect(parsePrefixedImportError('IMPORT:database_schema')).toBeUndefined()
    expect(parsePrefixedImportError('not-prefixed')).toBeUndefined()
  })

  it('wraps non-error values for ipc handlers', () => {
    expect(toImportIpcError('plain failure').message).toBe('IMPORT:generic|plain failure')
  })
})
