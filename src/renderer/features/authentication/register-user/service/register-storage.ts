import { removeStorageItem, setStorageItem } from '@shared/lib'

const EMAILKEY = 'dojosphere.auth.register.email'
const OTPKEY = 'dojosphere.auth.register.otpActive'

/**
 * Stores the registration email address in storage.
 *
 * Needed for the OTP verification / resend flow after a page reload.
 * @param email
 */
export function setRegisterEmailToStorage(email: string) {
  setStorageItem(EMAILKEY, email)
}

/**
 * Stores the OTP activation status in storage.
 *
 * @param isActive Describes whether the registration was sent.
 */
export function setIsOtpActiveToStorage(isActive: boolean) {
  setStorageItem(OTPKEY, isActive)
}

/**
 * Clears persisted registration progress from storage.
 *
 * This should be called after a completed logout to avoid stale
 * register/otp state affecting future account routing.
 */
export function clearRegisterStorage() {
  removeStorageItem(EMAILKEY)
  removeStorageItem(OTPKEY)
}
