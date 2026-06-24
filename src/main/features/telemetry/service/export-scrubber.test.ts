import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { scrubOtlpJsonLine, scrubOtlpTraceExportPayload } from './export-scrubber'

describe('export-scrubber', () => {
  let tempDir = ''

  afterEach(() => {
    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true })
      tempDir = ''
    }
  })

  it('keeps exception spans with error.code and pseudonymized user id', () => {
    tempDir = mkdtempSync(join(tmpdir(), 'dojosphere-scrub-'))
    const payload = {
      resourceSpans: [
        {
          scopeSpans: [
            {
              spans: [
                {
                  name: 'exception',
                  attributes: [
                    { key: 'service.name', value: { stringValue: 'auth' } },
                    { key: 'action', value: { stringValue: 'login' } },
                    { key: 'error.code', value: { stringValue: 'auth.invalid_credentials' } },
                    { key: 'user.id', value: { stringValue: 'user-123' } }
                  ],
                  status: { code: 2, message: 'raw message' }
                }
              ]
            }
          ]
        }
      ]
    }

    const scrubbed = scrubOtlpTraceExportPayload(payload, tempDir)
    const span = scrubbed?.resourceSpans?.[0]?.scopeSpans?.[0]?.spans?.[0]

    expect(span?.attributes?.some((attribute) => attribute.key === 'user.id')).toBe(false)
    expect(span?.attributes?.find((attribute) => attribute.key === 'user.id_hmac')?.value).toEqual({
      stringValue: expect.stringMatching(/^[a-f0-9]{64}$/)
    })
    expect(span?.status?.message).toBe('auth.invalid_credentials')
  })

  it('drops non-exception spans', () => {
    tempDir = mkdtempSync(join(tmpdir(), 'dojosphere-scrub-'))
    const payload = {
      resourceSpans: [
        {
          scopeSpans: [
            {
              spans: [
                {
                  name: 'breadcrumb',
                  attributes: [{ key: 'category', value: { stringValue: 'auth' } }],
                  status: { code: 1 }
                }
              ]
            }
          ]
        }
      ]
    }

    expect(scrubOtlpTraceExportPayload(payload, tempDir)).toBeNull()
  })

  it('rejects payloads containing email-like values', () => {
    tempDir = mkdtempSync(join(tmpdir(), 'dojosphere-scrub-'))
    const payload = {
      resourceSpans: [
        {
          scopeSpans: [
            {
              spans: [
                {
                  name: 'exception',
                  attributes: [{ key: 'error.code', value: { stringValue: 'user@example.com' } }],
                  status: { code: 2 }
                }
              ]
            }
          ]
        }
      ]
    }

    expect(scrubOtlpTraceExportPayload(payload, tempDir)).toBeNull()
  })

  it('returns null for invalid JSON lines', () => {
    tempDir = mkdtempSync(join(tmpdir(), 'dojosphere-scrub-'))
    expect(scrubOtlpJsonLine('not-json', tempDir)).toBeNull()
    expect(scrubOtlpJsonLine('   ', tempDir)).toBeNull()
  })

  it('drops spans without error.code and spans with denied attributes', () => {
    tempDir = mkdtempSync(join(tmpdir(), 'dojosphere-scrub-'))
    const withoutCode = {
      resourceSpans: [
        {
          scopeSpans: [
            {
              spans: [
                {
                  name: 'exception',
                  attributes: [{ key: 'service.name', value: { stringValue: 'auth' } }],
                  status: { code: 2 }
                }
              ]
            }
          ]
        }
      ]
    }

    expect(scrubOtlpTraceExportPayload(withoutCode, tempDir)).toBeNull()

    const deniedToken = {
      resourceSpans: [
        {
          scopeSpans: [
            {
              spans: [
                {
                  name: 'exception',
                  attributes: [
                    { key: 'error.code', value: { stringValue: 'auth.failed' } },
                    { key: 'token', value: { stringValue: 'secret-token' } }
                  ],
                  status: { code: 2 }
                }
              ]
            }
          ]
        }
      ]
    }

    expect(scrubOtlpTraceExportPayload(deniedToken, tempDir)).toBeNull()
  })

  it('keeps warning breadcrumb events and drops debug events', () => {
    tempDir = mkdtempSync(join(tmpdir(), 'dojosphere-scrub-'))
    const payload = {
      resourceSpans: [
        {
          scopeSpans: [
            {
              spans: [
                {
                  name: 'exception',
                  attributes: [{ key: 'error.code', value: { stringValue: 'shared.error.retry' } }],
                  events: [
                    {
                      name: 'auth.warning',
                      attributes: [
                        { key: 'level', value: { stringValue: 'warning' } },
                        { key: 'errorCode', value: { stringValue: 'shared.error.retry' } }
                      ]
                    },
                    {
                      name: 'auth.debug',
                      attributes: [{ key: 'level', value: { stringValue: 'debug' } }]
                    },
                    {
                      name: 'exception',
                      attributes: [{ key: 'exception.message', value: { stringValue: 'stack' } }]
                    }
                  ],
                  status: { code: 2 }
                }
              ]
            }
          ]
        }
      ]
    }

    const scrubbed = scrubOtlpTraceExportPayload(payload, tempDir)
    const events = scrubbed?.resourceSpans?.[0]?.scopeSpans?.[0]?.spans?.[0]?.events

    expect(events).toHaveLength(1)
    expect(events?.[0]?.name).toBe('auth.warning')
  })

  it('accepts error status spans without exception name', () => {
    tempDir = mkdtempSync(join(tmpdir(), 'dojosphere-scrub-'))
    const payload = {
      resourceSpans: [
        {
          scopeSpans: [
            {
              spans: [
                {
                  name: 'breadcrumb',
                  attributes: [{ key: 'error.code', value: { stringValue: 'network.failed' } }],
                  status: { code: 2 }
                }
              ]
            }
          ]
        }
      ]
    }

    expect(scrubOtlpTraceExportPayload(payload, tempDir)).not.toBeNull()
  })

  it('drops spans when disallowed attribute values contain email patterns', () => {
    tempDir = mkdtempSync(join(tmpdir(), 'dojosphere-scrub-'))
    const payload = {
      resourceSpans: [
        {
          scopeSpans: [
            {
              spans: [
                {
                  name: 'exception',
                  attributes: [
                    { key: 'error.code', value: { stringValue: 'auth.failed' } },
                    { key: 'note', value: { stringValue: 'user@example.com' } }
                  ],
                  status: { code: 2 }
                }
              ]
            }
          ]
        }
      ]
    }

    expect(scrubOtlpTraceExportPayload(payload, tempDir)).toBeNull()
  })

  it('ignores non-allowlisted attributes without denied values', () => {
    tempDir = mkdtempSync(join(tmpdir(), 'dojosphere-scrub-'))
    const payload = {
      resourceSpans: [
        {
          scopeSpans: [
            {
              spans: [
                {
                  name: 'exception',
                  attributes: [
                    { key: 'error.code', value: { stringValue: 'shared.error.retry' } },
                    { key: 'custom', value: { stringValue: 'ignored' } }
                  ],
                  status: { code: 2 }
                }
              ]
            }
          ]
        }
      ]
    }

    const attributes = scrubOtlpTraceExportPayload(payload, tempDir)?.resourceSpans?.[0]
      ?.scopeSpans?.[0]?.spans?.[0]?.attributes

    expect(attributes?.some((attribute) => attribute.key === 'custom')).toBe(false)
    expect(attributes?.some((attribute) => attribute.key === 'error.code')).toBe(true)
  })

  it('drops spans when attribute keys contain denied substrings', () => {
    tempDir = mkdtempSync(join(tmpdir(), 'dojosphere-scrub-'))
    const payload = {
      resourceSpans: [
        {
          scopeSpans: [
            {
              spans: [
                {
                  name: 'exception',
                  attributes: [
                    { key: 'error.code', value: { stringValue: 'auth.failed' } },
                    { key: 'session_token', value: { stringValue: 'abc' } }
                  ],
                  status: { code: 2 }
                }
              ]
            }
          ]
        }
      ]
    }

    expect(scrubOtlpTraceExportPayload(payload, tempDir)).toBeNull()
  })

  it('skips warning events without allowlisted attributes', () => {
    tempDir = mkdtempSync(join(tmpdir(), 'dojosphere-scrub-'))
    const payload = {
      resourceSpans: [
        {
          scopeSpans: [
            {
              spans: [
                {
                  name: 'exception',
                  attributes: [{ key: 'error.code', value: { stringValue: 'shared.error.retry' } }],
                  events: [
                    {
                      name: 'auth.warning',
                      attributes: [{ key: 'custom', value: { stringValue: 'ignored' } }]
                    }
                  ],
                  status: { code: 2 }
                }
              ]
            }
          ]
        }
      ]
    }

    const events = scrubOtlpTraceExportPayload(payload, tempDir)?.resourceSpans?.[0]
      ?.scopeSpans?.[0]?.spans?.[0]?.events

    expect(events).toEqual([])
  })

  it('skips non-allowlisted attributes that only use numeric values', () => {
    tempDir = mkdtempSync(join(tmpdir(), 'dojosphere-scrub-'))
    const payload = {
      resourceSpans: [
        {
          scopeSpans: [
            {
              spans: [
                {
                  name: 'exception',
                  attributes: [
                    { key: 'error.code', value: { stringValue: 'shared.error.retry' } },
                    { key: 'opaque', value: { intValue: 42 } }
                  ],
                  status: { code: 2 }
                }
              ]
            }
          ]
        }
      ]
    }

    const attributes = scrubOtlpTraceExportPayload(payload, tempDir)?.resourceSpans?.[0]
      ?.scopeSpans?.[0]?.spans?.[0]?.attributes

    expect(attributes?.some((attribute) => attribute.key === 'opaque')).toBe(false)
    expect(attributes?.some((attribute) => attribute.key === 'error.code')).toBe(true)
  })

  it('covers attribute scrub edge cases', () => {
    tempDir = mkdtempSync(join(tmpdir(), 'dojosphere-scrub-'))
    const payload = {
      resourceSpans: [
        {
          scopeSpans: [
            {
              spans: [
                {
                  name: 'breadcrumb',
                  attributes: undefined,
                  status: { code: 2 }
                },
                {
                  name: 'exception',
                  attributes: [{ key: 'error.code', value: { stringValue: 'shared.error.retry' } }],
                  events: [
                    {
                      name: 'auth.warning',
                      attributes: [{ key: 'email', value: { stringValue: 'hidden' } }]
                    }
                  ],
                  status: { code: 2 }
                }
              ]
            }
          ]
        }
      ]
    }

    const spans = scrubOtlpTraceExportPayload(payload, tempDir)?.resourceSpans?.[0]?.scopeSpans?.[0]
      ?.spans

    expect(spans).toHaveLength(1)
    expect(spans?.[0]?.events).toEqual([])
  })

  it('handles non-string attribute values and empty user ids', () => {
    tempDir = mkdtempSync(join(tmpdir(), 'dojosphere-scrub-'))
    const payload = {
      resourceSpans: [
        {
          scopeSpans: [
            {
              spans: [
                {
                  name: 'exception',
                  attributes: [
                    { key: 'error.code', value: { intValue: 1 } },
                    { key: 'user.id', value: { stringValue: '' } },
                    { key: 'reason', value: { intValue: 2 } }
                  ],
                  status: { code: 2 }
                }
              ]
            }
          ]
        }
      ]
    }

    expect(scrubOtlpTraceExportPayload(payload, tempDir)).toBeNull()
  })

  it('serializes scrubbed JSON lines', () => {
    tempDir = mkdtempSync(join(tmpdir(), 'dojosphere-scrub-'))
    const line = JSON.stringify({
      resourceSpans: [
        {
          scopeSpans: [
            {
              spans: [
                {
                  name: 'exception',
                  attributes: [{ key: 'error.code', value: { stringValue: 'shared.error.retry' } }],
                  status: { code: 2 }
                }
              ]
            }
          ]
        }
      ]
    })

    const scrubbed = scrubOtlpJsonLine(line, tempDir)

    expect(scrubbed).toContain('shared.error.retry')
  })
})
