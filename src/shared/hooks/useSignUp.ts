import { useState } from "react";

import { signUpNewUser } from "@shared/services/supabase/supabase-manager";

export default function useSignUp() {
  const [registering, setRegistering] = useState(false);

  const signUp = async (email: string, password: string) => {
    setRegistering(true);

    try {
      await signUpNewUser(email, password);
    } finally {
      setRegistering(false);
    }
  };

  return { signUp, registering };
}
