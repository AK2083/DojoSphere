import type { RegisterResult } from '@shared/types/auth'
import { supabase } from './client'

export async function signUp(
  email: string,
  password: string
): Promise<RegisterResult> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) throw error

  return data
}
