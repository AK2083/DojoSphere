import { mapSupabaseError } from '@shared/api/supabase/map-error'
import { captureException } from '@shared/lib/glitchtip/logging'

import { supabase } from './client'

export async function registerUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
  })

  if (error) {
    captureException(error, 'auth', 'registerUser')
    throw mapSupabaseError(error)
  }

  return data
}
