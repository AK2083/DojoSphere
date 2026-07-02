# Local Database (SQLite)

DojoSphere stores tournament data locally in the Electron main process using SQLite. The renderer talks to the database only through IPC handlers exposed via the preload script — there is no direct database access from the Vue frontend.

## Driver

- **Driver:** Node.js built-in [`node:sqlite`](https://nodejs.org/api/sqlite.html) (`DatabaseSync`) — synchronous SQLite access without native module rebuilds. Requires Node.js 24+.
- **Port:** Application code uses `@main/shared/database` (public API). Only `src/main/shared/database/driver.ts` imports `node:sqlite` directly.

Connection logic lives in `src/main/shared/database/`. The main process is built to `dist-electron/` via `vite-plugin-electron`.

## Database file

The database file is created at:

```
<userData>/database.db
```

On Windows this is typically `%APPDATA%/dojosphere/database.db`. The exact path comes from Electron's `app.getPath('userData')`.

## Migrations

Schema changes are applied automatically on startup via versioned SQL files in `src/main/shared/database/migrations/`. Applied migrations are tracked in a `_migrations` table. WAL mode, foreign keys, and a busy timeout are enabled before migrations run.

To add a migration:

1. Create a new `.sql` file in `src/main/shared/database/migrations/` using the naming pattern `V<number>__<description>.sql` (for example `V003__add_tournaments.sql`).
2. Register it in `src/main/shared/database/migrations/index.ts` with a matching `id` (import the `.sql` file with `?raw`).

Migrations must not delete user data without an explicit, documented decision.

## Domain schemas

| Domain | Doc | Tables |
| ------ | --- | ------ |
| Participants | [participants-schema.md](./database/participants-schema.md) | `competitors` |
| Clubs (federation hierarchy) | [clubs-schema.md](./database/clubs-schema.md) | `countries`, `associations`, `regional_associations`, `districts`, `clubs`, `club_identifiers`, `club_addresses`, `club_contacts` |
| Grades (Kyu/Dan) | [grades-schema.md](./database/grades-schema.md) | `grades` |
| Age classes (DJB) | [age-classes-schema.md](./database/age-classes-schema.md) | `age_classes` |
| Weight classes (DJB) | [weight-classes-schema.md](./database/weight-classes-schema.md) | `weight_classes` |

## Encryption at rest (planned)

Participant and tournament data are currently stored in **plaintext** SQLite. For encryption design (SQLCipher, key handling, migration), see [encryption-at-rest.md](./database/encryption-at-rest.md).

## IPC API

The preload script (`src/preload/preload.ts`) exposes these methods on `window.api`:

- `dbHealthcheck()` — returns SQLite version and connection status
- `getUsers()` / `addUser(user)` — user management (subject to change as the schema evolves)
- `ensureLocalSession(displayName)` / `getLocalSession(token)` / `revokeLocalSession(token)` — local session handling
- `updateUserDisplayName(token, displayName)` — updates the display name for the authenticated session
- `getOsUsername()` — returns the OS username

When adding new IPC channels, also update `src/renderer/shared/types/electron-api.ts`. See [CONTRIBUTING.md](../CONTRIBUTING.md#adding-a-main-feature).

## Inspecting the database

You can browse the local database with any SQLite client or the [DBCode](https://dbcode.io/) VS Code extension. A sample connection is preconfigured in `.vscode/settings.json` (adjust the `socket` path to your `userData` location if needed).
