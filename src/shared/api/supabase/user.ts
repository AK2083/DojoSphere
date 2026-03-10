import { signUp } from '@shared/api/supabase/auth'
import { mapSupabaseError } from '@shared/api/supabase/map-error'

export async function registerUser(email: string, password: string) {
  const { data, error } = await signUp(email, password)

  if (error) {
    throw mapSupabaseError(error)
  }

  return data
}