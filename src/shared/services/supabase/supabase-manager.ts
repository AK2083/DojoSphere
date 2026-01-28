import { createClient } from "@supabase/supabase-js";

import type { ApiResult } from "@/shared/types/api-result";
import type { AppUser } from "@/shared/types/app-user";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

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
    if (error.status === 429) {
      return {
        success: false,
        error: {
          code: "RATE_LIMITED",
          message: "Too many requests to the registration endpoint.",
        },
      };
    }

    return {
      success: false,
      error: {
        code: "CONFLICT",
        message: "Registration failed due to an unexpected error.",
      },
    };
  }

  if (!data?.user) {
    throw new Error("Invariant violated: no user returned after signUp");
  }

  return { success: true, data: data.user };
}
