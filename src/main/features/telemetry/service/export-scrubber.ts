import { hashTelemetryUserId, resolveTelemetryExportHmacSecret } from './telemetry-user-id-hmac'

/** OTLP JSON attribute value shape (subset used by scrubber). */
type OtlpAttributeValue = {
  stringValue?: string
  intValue?: string | number
  boolValue?: boolean
  doubleValue?: number
}

/** OTLP JSON attribute entry. */
type OtlpAttribute = {
  key: string
  value?: OtlpAttributeValue
}

/** OTLP JSON span event. */
type OtlpSpanEvent = {
  name?: string
  attributes?: OtlpAttribute[]
}

/** OTLP JSON span. */
type OtlpSpan = {
  name?: string
  attributes?: OtlpAttribute[]
  events?: OtlpSpanEvent[]
  status?: { code?: number; message?: string }
}

/** OTLP JSON export request body. */
export type OtlpTraceExportPayload = {
  resourceSpans?: Array<{
    scopeSpans?: Array<{ spans?: OtlpSpan[] }>
  }>
}

const ALLOWED_ATTRIBUTE_KEYS = new Set([
  'service.name',
  'action',
  'error.code',
  'user.id_hmac',
  'deployment.environment',
  'category',
  'level',
  'errorCode',
  'reason',
  'name'
])

const DENIED_ATTRIBUTE_KEYS = new Set([
  'email',
  'mail',
  'token',
  'bearer',
  'authorization',
  'password',
  'session',
  'cookie',
  'otp',
  'user.id'
])

const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
const BEARER_PATTERN = /bearer\s+/i
const JWT_PATTERN = /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/

const OTLP_STATUS_ERROR = 2

function isDeniedKey(key: string): boolean {
  const normalized = key.toLowerCase()

  return (
    DENIED_ATTRIBUTE_KEYS.has(normalized) ||
    normalized.includes('token') ||
    normalized.includes('password') ||
    normalized.includes('email') ||
    normalized.includes('bearer')
  )
}

function isAllowedKey(key: string): boolean {
  return ALLOWED_ATTRIBUTE_KEYS.has(key)
}

function getStringValue(attribute: OtlpAttribute): string | null {
  const value = attribute.value?.stringValue

  return typeof value === 'string' ? value : null
}

function containsDeniedValue(value: string): boolean {
  return EMAIL_PATTERN.test(value) || BEARER_PATTERN.test(value) || JWT_PATTERN.test(value)
}

function scrubAttributeValue(attribute: OtlpAttribute): OtlpAttribute | null {
  const key = attribute.key

  if (isDeniedKey(key)) {
    return null
  }

  if (!isAllowedKey(key)) {
    return null
  }

  const stringValue = getStringValue(attribute)

  if (stringValue !== null && containsDeniedValue(stringValue)) {
    return null
  }

  return attribute
}

function scrubSpanAttributes(
  attributes: OtlpAttribute[] | undefined,
  hmacSecret: Buffer
): OtlpAttribute[] | null {
  if (!attributes) {
    return []
  }

  const scrubbed: OtlpAttribute[] = []
  let rawUserId: string | null = null

  for (const attribute of attributes) {
    if (attribute.key === 'user.id') {
      const userId = getStringValue(attribute)

      if (userId) {
        rawUserId = userId
      }

      continue
    }

    if (isDeniedKey(attribute.key)) {
      return null
    }

    const cleaned = scrubAttributeValue(attribute)

    if (!cleaned) {
      const attributeValue = getStringValue(attribute)

      if (attributeValue !== null && containsDeniedValue(attributeValue)) {
        return null
      }

      continue
    }

    scrubbed.push(cleaned)
  }

  if (rawUserId) {
    scrubbed.push({
      key: 'user.id_hmac',
      value: { stringValue: hashTelemetryUserId(rawUserId, hmacSecret) }
    })
  }

  return scrubbed
}

function scrubSpanEvents(events: OtlpSpanEvent[] | undefined): OtlpSpanEvent[] {
  if (!events) {
    return []
  }

  const scrubbed: OtlpSpanEvent[] = []

  for (const event of events) {
    if (event.name === 'exception') {
      continue
    }

    const level = event.attributes?.find((attribute) => attribute.key === 'level')
    const levelValue = level ? getStringValue(level) : null

    if (levelValue === 'debug' || levelValue === 'info') {
      continue
    }

    const cleanedAttributes = event.attributes
      ?.map((attribute) => scrubAttributeValue(attribute))
      .filter((attribute): attribute is OtlpAttribute => attribute !== null)

    if (!cleanedAttributes || cleanedAttributes.length === 0) {
      continue
    }

    scrubbed.push({ ...event, attributes: cleanedAttributes })
  }

  return scrubbed
}

function isExceptionSpan(span: OtlpSpan): boolean {
  if (span.name === 'exception') {
    return true
  }

  return span.status?.code === OTLP_STATUS_ERROR
}

function scrubSpan(span: OtlpSpan, hmacSecret: Buffer): OtlpSpan | null {
  if (!isExceptionSpan(span)) {
    return null
  }

  const attributes = scrubSpanAttributes(span.attributes, hmacSecret)

  if (attributes === null) {
    return null
  }

  const errorCodeAttribute = attributes.find(
    (attribute) => attribute.key === 'error.code' && Boolean(getStringValue(attribute))
  )

  if (!errorCodeAttribute) {
    return null
  }

  const events = scrubSpanEvents(span.events)

  return {
    ...span,
    attributes,
    events,
    status: {
      code: OTLP_STATUS_ERROR,
      message: getStringValue(errorCodeAttribute)!
    }
  }
}

/**
 * Scrubs an OTLP JSON trace export payload for GDPR-safe Grafana upload.
 *
 * @param payload Parsed OTLP JSON body.
 * @param userDataPath Electron userData path for HMAC secret resolution.
 * @returns Scrubbed payload or null when nothing should be uploaded.
 */
export function scrubOtlpTraceExportPayload(
  payload: OtlpTraceExportPayload,
  userDataPath: string
): OtlpTraceExportPayload | null {
  const hmacSecret = resolveTelemetryExportHmacSecret(userDataPath)
  const resourceSpans = payload.resourceSpans
    ?.map((resourceSpan) => {
      const scopeSpans = resourceSpan.scopeSpans
        ?.map((scopeSpan) => {
          const spans = scopeSpan.spans
            ?.map((span) => scrubSpan(span, hmacSecret))
            .filter((span): span is OtlpSpan => span !== null)

          if (!spans || spans.length === 0) {
            return null
          }

          return { ...scopeSpan, spans }
        })
        .filter((scopeSpan): scopeSpan is NonNullable<typeof scopeSpan> => scopeSpan !== null)

      if (!scopeSpans || scopeSpans.length === 0) {
        return null
      }

      return { ...resourceSpan, scopeSpans }
    })
    .filter(
      (resourceSpan): resourceSpan is NonNullable<typeof resourceSpan> => resourceSpan !== null
    )

  if (!resourceSpans || resourceSpans.length === 0) {
    return null
  }

  return { resourceSpans }
}

/**
 * Parses and scrubs a raw OTLP JSONL line for Grafana export.
 *
 * @param line Raw JSONL line from the local collector.
 * @param userDataPath Electron userData path for HMAC secret resolution.
 * @returns Serialized scrubbed JSON or null when the line must not be uploaded.
 */
export function scrubOtlpJsonLine(line: string, userDataPath: string): string | null {
  const trimmed = line.trim()

  if (!trimmed) {
    return null
  }

  let payload: OtlpTraceExportPayload

  try {
    payload = JSON.parse(trimmed) as OtlpTraceExportPayload
  } catch {
    return null
  }

  const scrubbed = scrubOtlpTraceExportPayload(payload, userDataPath)

  if (!scrubbed) {
    return null
  }

  return JSON.stringify(scrubbed)
}
