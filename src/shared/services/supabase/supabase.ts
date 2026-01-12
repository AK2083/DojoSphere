import { createClient } from "@supabase/supabase-js";

import { RegistrationFailedException } from "@features/authentication/exceptions/RegistrationFailedException";
import { TooManyRequestsException } from "@features/authentication/exceptions/TooManyRequestsException";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Attempts to sign up a new user using the provided email and password.
 * Redirect URL is configured via the `options` object.
 *
 * Throws specific exceptions if the email is already in use, no session is returned,
 * or if a general error occurs.
 *
 * @param mail - The email address of the new user.
 * @param pwd - The password for the new user.
 * @returns A promise that resolves to `true` if the sign-up was successful.
 * @throws TooManyRequestsException
 * @throws RegistrationFailedException
 */
export async function signUpNewUser(userEmail: string, userPassword: string) {
  const { data, error } = await supabase.auth.signUp({
    email: userEmail,
    password: userPassword,
  });

  if (error) {
    if (error.status === 429) {
      console.error("Too many requests made to the registration endpoint.", error.message);
      throw new TooManyRequestsException();
    }

    console.error("Registration failed due to an unexpected error:", error.message);
    throw new RegistrationFailedException();
  }

  console.log("User registered successfully:", data.user?.email);
  return data;
}
