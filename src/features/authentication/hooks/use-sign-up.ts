import { useState } from "react";

import type { AppUser } from "@lib/supabase/app-user";
import { signUpNewUser } from "@lib/supabase/supabase-manager";
import type { ApiResult } from "@shared/types/api-result";

/**
 * Custom React hook to handle user registration.
 *
 * Provides a `signUp` function to register a new user
 * and a `registering` boolean state indicating whether
 * a registration request is currently in progress.
 *
 * @returns An object containing:
 * - `signUp`: async function that accepts `email` and `password` and returns a
 * Promise<ApiResult<AppUser>>.
 * - `registering`: boolean that is `true` while the registration is in progress, otherwise `false`.
 *
 * @example
 * const { signUp, registering } = useSignUp();
 *
 * const handleSignUp = async () => {
 *   const result = await signUp("user@example.com", "securePassword123");
 *   if (result.success) {
 *     console.log("User registered:", result.data);
 *   } else {
 *     console.error("Registration failed:", result.error);
 *   }
 * };
 */
export default function useSignUp() {
  const [registering, setRegistering] = useState(false);

  const signUp = async (email: string, password: string): Promise<ApiResult<AppUser>> => {
    setRegistering(true);

    try {
      return await signUpNewUser(email, password);
    } finally {
      setRegistering(false);
    }
  };

  return { signUp, registering };
}
