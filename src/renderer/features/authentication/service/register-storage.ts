import { getStorageItem, removeStorageItem } from '@shared/lib'

const OTPKEY = 'dojosphere.auth.register.otpActive'

/**
 * Retrieves the OTP activation status from storage.
 *
 * @returns The OTP activation status from storage.
 */
export function getIsOtpActiveFromStorage() {
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
