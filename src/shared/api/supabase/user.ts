import { mapSupabaseError } from '@shared/api/supabase/map-error'
import { supabase } from './client'

export async function registerUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
  })

  if (error) {
    throw mapSupabaseError(error)
  }

  return data
}
