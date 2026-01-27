import { useState } from "react";

import type { AppUser } from "@shared/model/AppUser";
import type { ApiResult } from "@shared/model/Response";
import { signUpNewUser } from "@shared/services/supabase/supabase-manager";

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
