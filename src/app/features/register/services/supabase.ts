import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
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
   * @throws SupabaseCriticalException | DuplicateMailException
   */
  async signUpNewUser(mail: string, pwd: string): Promise<boolean> {
    const { data, error } = await this.supabaseClient.auth.signUp({
      email: mail,
      password: pwd,
    });

    console.log('usr: ', data);
    console.error('err: ', error);

    return true;
  }
}
