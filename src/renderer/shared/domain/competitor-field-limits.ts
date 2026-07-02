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

/** Maximum length for an optional coach or supervisor name. */
export const COMPETITOR_COACH_MAX_LENGTH = 80

/**
 * Allowed characters for pass and license numbers.
 *
 * The DJB Passordnung requires a "Lizenznummer" but does not publish a fixed
 * format. Digital JudoPass IDs are assigned by DokuMe; legacy paper passes
 * used varying alphanumeric values. This pattern accepts practical identifiers
 * without enforcing a federation-specific structure.
 */
export const COMPETITOR_LICENSE_IDENTIFIER_PATTERN = /^[0-9A-Za-z\-/]+$/
