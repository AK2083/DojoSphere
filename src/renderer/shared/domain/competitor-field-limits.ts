/**
 * Field length limits for `competitors` text columns.
 *
 * Keep in sync with `V008__competitors_create_table.sql` CHECK constraints.
 * SQLite has no `VARCHAR(n)` type; lengths are enforced via `CHECK (length(...) ...)`.
 */

/** Maximum length for given and family names. */
export const COMPETITOR_NAME_MAX_LENGTH = 80

/** Maximum length for the Judo pass / JudoPass license number. */
export const COMPETITOR_PASS_NUMBER_MAX_LENGTH = 32

/** Maximum length for the optional competition license number. */
export const COMPETITOR_LICENSE_NUMBER_MAX_LENGTH = 32

/** Maximum length for an optional contact phone number (incl. formatting). */
export const COMPETITOR_CONTACT_PHONE_MAX_LENGTH = 32

/** Maximum length for an optional contact person name. */
export const COMPETITOR_CONTACT_PERSON_MAX_LENGTH = 80

/** @deprecated Use {@link COMPETITOR_CONTACT_PERSON_MAX_LENGTH}. */
export const COMPETITOR_COACH_MAX_LENGTH = COMPETITOR_CONTACT_PERSON_MAX_LENGTH

/** Maximum length for the optional free-text remarks field. */
export const COMPETITOR_REMARKS_MAX_LENGTH = 500

/** Registration status codes stored in `competitors.registration_status`. */
export const COMPETITOR_REGISTRATION_STATUSES = ['registered', 'late_registration'] as const

/** Registration status code union derived from {@link COMPETITOR_REGISTRATION_STATUSES}. */
export type CompetitorRegistrationStatus = (typeof COMPETITOR_REGISTRATION_STATUSES)[number]

/**
 * Allowed characters for pass and license numbers.
 *
 * The DJB Passordnung requires a "Lizenznummer" but does not publish a fixed
 * format. Digital JudoPass IDs are assigned by DokuMe; legacy paper passes
 * used varying alphanumeric values. This pattern accepts practical identifiers
 * without enforcing a federation-specific structure.
 */
export const COMPETITOR_LICENSE_IDENTIFIER_PATTERN = /^[0-9A-Za-z\-/]+$/
