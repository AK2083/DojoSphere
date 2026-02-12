import { useEffect, useState } from "react";

import { supabase } from "@lib/supabase/client";

import { setUserContext } from "@shared/services/sentry/sentry-manager";

import { AuthContext } from "./auth-context";

import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Session["user"] | null>(null);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        const currentUser = session?.user ?? null;

        setUser(currentUser);

        console.log("User:", currentUser);
        if (currentUser) {
          setUserContext({ id: currentUser.id });
        } else {
          setUserContext(null);
        }
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}
