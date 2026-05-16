import { getStorageItem, removeStorageItem } from '@shared/lib'

import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'

const EMAILKEY = 'dojosphere.auth.register.email'

/**
 * Retrieves the registration email address from storage.
 *
 * Needed for OTP verification / resend flow when the route query is missing.
 *
 * @returns The registration email address from storage.
 */
export function getRegisterEmailFromStorage() {
  monitorInformation(MONITORING_EVENTS.STORAGE_REGISTER_EMAIL_READ, { EMAILKEY })
  return getStorageItem<string>(EMAILKEY)
}

/**
 * Clears the temporary registration email from storage.
 */
export function clearRegisterEmailFromStorage() {
  removeStorageItem(EMAILKEY)
}
