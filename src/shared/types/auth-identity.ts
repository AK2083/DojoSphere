import type { Session, User } from '@shared/api'

export type AuthSession = Session
export type AuthUser = User

export type CurrentUserState = {
  user: AuthUser | null
  error: Error | null
}
