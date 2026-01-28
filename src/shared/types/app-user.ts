import type { User } from "@supabase/supabase-js";

/**
 * Represents an application user.
 *
 * This type is a read-only wrapper around Supabase's `User` type,
 * ensuring that user objects are immutable throughout the app.
 *
 * @example
 * const user: AppUser = {
 *   id: "123",
 *   email: "alice@example.com",
 *   created_at: "2026-01-28T12:00:00Z",
 *   // ...other Supabase user fields
 * };
 */
export type AppUser = Readonly<User>;
