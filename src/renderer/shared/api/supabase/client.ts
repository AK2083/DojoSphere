import { createClient } from '@supabase/supabase-js'

import { getAuthSessionStorageKey } from './model/auth-storage'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

/** Shared Supabase client for renderer API access. */
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storageKey: getAuthSessionStorageKey(),
    debug: false
  }
})
