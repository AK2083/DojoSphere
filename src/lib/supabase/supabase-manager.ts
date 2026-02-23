import { captureException, setUserContext } from "@lib/sentry/sentry-manager";
import type { AppUser } from "@lib/supabase/app-user";
import { supabase } from "@lib/supabase/client";
import { HTTP_STATUS_CODES } from "@shared/constants/http-codes";
import { ApiErrorCode, type ApiResult } from "@shared/types/api-result";
/**
 * Registers a new user using Supabase authentication.
 *
 * Attempts to create a new user account with the provided email and password.
 * Handles common errors such as rate limiting and registration conflicts,
 * and returns a standardized `ApiResult` indicating success or failure.
 *
 * @param userEmail - The email address of the new user
 * @param userPassword - The password for the new user
 * @returns A promise that resolves to an `ApiResult` containing the newly created user
 *          on success, or an error object on failure.
 *
 * @throws Will throw an error if the sign-up completes without returning a user.
 */
export async function signUpNewUser(
  userEmail: string,
  userPassword: string,
): Promise<ApiResult<AppUser>> {
  const { data, error } = await supabase.auth.signUp({
    email: userEmail,
    password: userPassword,
  });

  if (error) {
    if (error.status === HTTP_STATUS_CODES.TOO_MANY_REQUESTS) {
      return {
        success: false,
        error: {
          code: ApiErrorCode.RATE_LIMITED,
        },
      };
    }

    if (error.status && error.status >= HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) {
      callException(error);
    }

    return {
      success: false,
      error: {
        code: ApiErrorCode.CONFLICT,
      },
    };
  }

  if (!data?.user) {
    const invariantError = new Error("Invariant violated: signUp returned no user");
    callException(invariantError);
    throw invariantError;
  }

  setUserContext(data.user);
  return { success: true, data: data.user };
}

function callException(err: Error) {
  const serviceName = "Supabase Manager";
  const actionName = "signUpNewUser";
  captureException(err, serviceName, actionName);
}
