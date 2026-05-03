import { setStorageItem } from '@shared/lib'

import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'

const EMAILKEY = 'dojosphere.auth.register.email'
const OTPKEY = 'dojosphere.auth.register.otpActive'

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
