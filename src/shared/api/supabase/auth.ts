import { captureException, setUserContext } from '@shared/lib/glitchtip/logging'
import type { RegisterResult } from '@shared/types/auth'

import { supabase } from './client'

export async function signUp(email: string, password: string): Promise<RegisterResult> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) {
    captureException(error, 'auth', 'signUp')
    throw error
  }

  if (!data.user) {
    const err = new Error('User not found after sign up')
    captureException(err, 'auth', 'signUp')
    throw err
  }

  setUserContext({
    id: data.user.id
  })

  return data
}

export async function checkOtp(email: string, token: string): Promise<void> {
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup'
  })

  if (error) {
    captureException(error, 'auth', 'checkOtp')
    throw error
  }
}
