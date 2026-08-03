import { createClient } from '@supabase/supabase-js'

import { getAuthSessionStorageKey } from './model/auth-storage'

/** Local-first placeholder so the renderer boots when cloud env is unset. */
const FALLBACK_SUPABASE_URL = 'http://127.0.0.1:54321'
const FALLBACK_SUPABASE_KEY = 'public-anon-key'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || FALLBACK_SUPABASE_KEY

/** Shared Supabase client for renderer API access. */
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storageKey: getAuthSessionStorageKey(),
    debug: false
  }
})
