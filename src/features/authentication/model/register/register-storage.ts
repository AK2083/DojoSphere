import { getStorageItem, setStorageItem } from '@shared/lib'

import { monitorInformation, MONITORING_EVENTS } from '../../monitoring/monitoring'

const OTPKEY = 'dojosphere.auth.register.otpActive'

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
