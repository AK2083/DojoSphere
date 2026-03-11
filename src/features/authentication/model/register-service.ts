import { registerUser } from '@shared/api'

export async function register(email: string, password: string) {
  return registerUser(email, password)
}
