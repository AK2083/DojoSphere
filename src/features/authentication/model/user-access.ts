import { registerUser } from '@shared/api/supabase/user'

import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'

export async function register(email: string, password: string) {
  monitorInformation(MONITORING_EVENTS.AUTH_REGISTER_SUBMITTED)
  return await registerUser(email, password)
}
