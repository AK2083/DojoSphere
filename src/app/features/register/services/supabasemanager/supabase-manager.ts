import { Injectable } from '@angular/core';
import { scopedLoggerFactory } from '@core/utils/scope.logger.factory';
import { environment } from '@environments/environment';
import { EmailAlreadyExistsException } from '@features/register/exceptions/supabase/email-already-exists-exception';
import { RegistrationFailedException } from '@features/register/exceptions/supabase/registration-failed-exception';
import { TooManyRequestsException } from '@features/register/exceptions/supabase/too-many-requests-exception';
import { createClient, Session, User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseManager {
  private readonly logger = scopedLoggerFactory(SupabaseManager);

  key = environment.supabase.key;
  url = environment.supabase.url;
  supabaseClient = createClient(this.url, this.key, {
    auth: {
      lock: async <T>(_name: string, _acquireTimeout: number, fn: () => Promise<T>): Promise<T> => {
        return await fn();
      },
    },
  });

  /**
   * Attempts to sign up a new user using the provided email and password.
   * Redirect URL is configured via the `options` object.
   *
   * Throws specific exceptions if the email is already in use, no session is returned,
   * or if a general error occurs.
   *
   * @param mail - The email address of the new user.
   * @param pwd - The password for the new user.
   * @returns A promise that resolves to `true` if the sign-up was successful.
   * @throws TooManyRequestsException
   * @throws EmailAlreadyExistsException
   * @throws RegistrationFailedException
   */
  async signUpNewUser(
    mail: string,
    pwd: string,
  ): Promise<{ user: User | null; session: Session | null }> {
    const { data, error } = await this.supabaseClient.auth.signUp({
      email: mail,
      password: pwd,
    });

    if (error) {
      if (error.status === 429) {
        this.logger.error('Too many requests made to the registration endpoint.', error);
        throw new TooManyRequestsException();
      }

      if (error.status === 400 && error.message.includes('already registered')) {
        this.logger.error('The provided email is already registered.');
        throw new EmailAlreadyExistsException();
      }

      this.logger.error('Registration failed due to an unexpected error:', error.message);
      throw new RegistrationFailedException();
    }

    if (!data.user && !data.session) {
      this.logger.error('Registration failed: No user session returned.');
      throw new EmailAlreadyExistsException();
    }

    this.logger.log('User registered successfully:', data.user?.email);
    return data;
  }
}
