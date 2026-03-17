import { signUpWithMailAndPassword } from '@shared/api/supabase/sign-up-with-mail-and-password'
import { AppError } from '@shared/errors/app-error'
import type { RegisterResult } from '@shared/types/register-result'

import { translationKeys } from '../i18n/keys'
import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'

/**
 * Registers a new user account.
 *
 * The function represents the registration use case of the auth feature.
 * It is responsible for orchestrating monitoring, API interaction and
 * error normalization so that the UI layer does not depend on infrastructure
 * details (e.g. Supabase errors).
 *
 * Workflow:
 * 1. Records a monitoring event (`AUTH_REGISTER_SUBMITTED`).
 * 2. Calls {@link registerUserAccount} to perform the actual registration.
 * 3. Normalizes possible errors into application-level {@link ErrorCode}.
 *
 * @param email - The email address used for the new account.
 * @param password - The password for the new account.
 *
 * @returns A promise resolving to a {@link RegisterResult}.
 * - `{ success: true }` if the registration succeeded.
 * - `{ success: false, error }` if an error occurred.
 */
export async function registerUserAccount(
  email: string,
  password: string
): Promise<RegisterResult> {
  monitorInformation(MONITORING_EVENTS.AUTH_REGISTER_SUBMITTED)

  try {
    await signUpWithMailAndPassword(email, password)
    return { success: true }
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return {
        success: false,
        error: error
      }
    }

    return {
      success: false,
      error: new AppError(translationKeys.form.error.unknown, '', error)
    }
  }
}
