import { getStorageItem, setStorageItem } from '@shared/lib'

import { monitorInformation, MONITORING_EVENTS } from '../../monitoring/monitoring'

const OTPKEY = 'dojosphere.auth.register.otpActive'
const EMAILKEY = 'dojosphere.auth.register.email'

/**
 * Stores the OTP activation status in storage.
 *
 * This function saves the provided boolean value to storage
 * and sends a monitoring event with the current status.
 * @param isActive Describes whether the registration was sent.
 */
export function setIsOtpActiveToStorage(isActive: boolean) {
  monitorInformation(MONITORING_EVENTS.STORAGE_OTP_READ, { isActive })
  setStorageItem(OTPKEY, isActive)
}

/**
 * Stores the registration email address in storage.
 *
 * Needed for the OTP verification / resend flow after a page reload.
 * @param email
 */
export function setRegisterEmailToStorage(email: string) {
  monitorInformation(MONITORING_EVENTS.STORAGE_REGISTER_EMAIL_READ, { email })
  setStorageItem(EMAILKEY, email)
}

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
 * Retrieves the registration email address from storage.
 *
 * Needed for OTP verification / resend flow when the route query is missing.
 *
 * @returns The registration email address from storage.
 */
export function getRegisterEmailFromStorage() {
  monitorInformation(MONITORING_EVENTS.STORAGE_REGISTER_EMAIL_WRITE, { EMAILKEY })
  return getStorageItem<string>(EMAILKEY)
}
