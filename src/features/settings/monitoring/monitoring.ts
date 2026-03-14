import { addBreadcrumb } from '@shared/lib/glitchtip/logging'

export const CATEGORY = 'settings'

export const MONITORING_EVENTS = {
  SETTINGS_THEME_READ: 'settings.theme.read',
  SETTINGS_THEME_WRITE: 'settings.theme.write',
  SETTINGS_LANG_READ: 'settings.lang.read',
  SETTINGS_LANG_WRITE: 'settings.lang.write'
}

export function monitorInformation(event: string, data?: object) {
  addBreadcrumb(event, CATEGORY, 'info', data)
}
