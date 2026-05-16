import { getStorageItem, removeStorageItem } from '@shared/lib'

import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'

const OTPKEY = 'dojosphere.auth.register.otpActive'

/**
 * Retrieves the OTP activation status from storage.
 *
 * This function reads the stored value and triggers a monitoring event.
 *
 * @returns The OTP activation status from storage.
 */
export function getIsOtpActiveFromStorage() {
  monitorInformation(MONITORING_EVENTS.STORAGE_OTP_WRITE, { OTPKEY })
  return getStorageItem<boolean>(OTPKEY)
}

/**
 * Clears the OTP activation status from storage.
 *
 * Used after successful confirmation so account navigation
 * no longer routes back to email verification.
 */
export function clearIsOtpActiveFromStorage() {
  removeStorageItem(OTPKEY)
}
