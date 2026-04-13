import { getIsOtpActiveFromStorage } from '../register-user/model/register-storage'

/**
 * Composable for resolving authentication-related navigation targets.
 *
 * Provides a function that determines the correct account route
 * based on the user's OTP (One-Time Password) activation status.
 *
 * If OTP is active, the "home" route is returned.
 * Otherwise, the "emailConfirmation" route is returned.
 *
 * @returns Navigation helpers.
 */
export function useAuthNavigation() {
  /**
   * Returns the appropriate route object for account navigation
   * depending on OTP activation status.
   *
   * @returns Vue Router location object.
   */
  function getAccountRoute() {
    return getIsOtpActiveFromStorage() ? { name: 'emailverification' } : { name: 'datasource' }
  }

  return { getAccountRoute }
}
