import { supabase } from '../client'

export type HeartbeatFunctionResponse = {
  status: string
  timestamp: string
}

/**
 * Calls the Supabase `heartbeat` edge function.
 *
 * This is a low-level API wrapper around `functions.invoke`.
 * It does not perform error mapping or side effects.
 *
 * @returns Raw Supabase invoke response with heartbeat payload data.
 */
export async function heartbeat(): Promise<
  Awaited<ReturnType<typeof supabase.functions.invoke<HeartbeatFunctionResponse>>>
> {
  return await supabase.functions.invoke('heartbeat', {
    body: { name: 'Functions' }
  })
}
