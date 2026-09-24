/**
 * Field length limits for association text inputs.
 *
 * Local SQLite (`V007`) and Supabase store these columns as unconstrained `TEXT` /
 * `text`. The limits below are application-level constraints used by the form
 * (maxlength, counter, validation) so entries stay within practical German
 * address and contact formats.
 */

/** Maximum length for the official association name. */
export const ASSOCIATION_NAME_MAX_LENGTH = 120

/** Maximum length for the short / display name. */
export const ASSOCIATION_SHORT_NAME_MAX_LENGTH = 40

/** Maximum length for a city name. */
export const ASSOCIATION_CITY_MAX_LENGTH = 80

/** Maximum length for a street name. */
export const ASSOCIATION_STREET_MAX_LENGTH = 120

/** Maximum length for a house number (incl. letters / ranges). */
export const ASSOCIATION_HOUSE_NUMBER_MAX_LENGTH = 10

/** Exact digit count for a German postal code. */
export const ASSOCIATION_POSTAL_CODE_LENGTH = 5

/** Maximum length for a website host and optional path (without protocol). */
export const ASSOCIATION_WEBSITE_HOST_MAX_LENGTH = 180

/** Maximum length for a Vereinsregisternummer (e.g. `VR 2876 P`). */
export const ASSOCIATION_NUMBER_MAX_LENGTH = 20

/** Maximum length for an email address. */
export const ASSOCIATION_EMAIL_MAX_LENGTH = 120

/** Maximum length for a national phone number (without country calling code). */
export const ASSOCIATION_PHONE_MAX_LENGTH = 20

/** Minimum digit count required in a national phone number. */
export const ASSOCIATION_PHONE_MIN_DIGITS = 3
