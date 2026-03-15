import { addBreadcrumb } from '@shared/lib/glitchtip/logging'

/**
 * Monitoring category used for settings-related events.
 *
 * This category groups all monitoring breadcrumbs that originate
 * from application settings, such as language and theme preferences.
 */
export const CATEGORY = 'settings'

/**
 * Collection of monitoring event identifiers related to settings.
 *
 * These constants are used to ensure consistent event naming when
 * recording monitoring breadcrumbs for reading or writing settings.
 */
export const MONITORING_EVENTS = {
  SETTINGS_THEME_READ: 'settings.theme.read',
  SETTINGS_THEME_WRITE: 'settings.theme.write',
  SETTINGS_LANG_READ: 'settings.lang.read',
  SETTINGS_LANG_WRITE: 'settings.lang.write'
}

/**
 * Records an informational monitoring breadcrumb for settings events.
 *
 * This function wraps {@link addBreadcrumb} and automatically applies
 * the settings monitoring category and the log level `info`.
 *
 * @param {string} event - The monitoring event identifier.
 * @param {object} [data] - Optional additional data associated with the event.
 */
export function monitorInformation(event: string, data?: object) {
  addBreadcrumb(event, CATEGORY, 'info', data)
}
