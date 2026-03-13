import type { Session as SupabaseSession, User as SupabaseUser } from '@supabase/supabase-js'

export type AuthUser = SupabaseUser
export type AuthSession = SupabaseSession

export interface RegisterResult {
  user: AuthUser | null
  session: AuthSession | null
}
