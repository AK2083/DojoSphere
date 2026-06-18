# DojoSphere

Open-source Electron application for managing Judo tournaments.

## Features

- Tournament administration
- Competitor and club management
- Local intranet audience view
- Match and schedule overview
- Offline/local-first capable setup

## Table of Contents

- [Tech Stack](#tech-stack)
- [Logging & Monitoring](#logging--monitoring)
- [Local Database (SQLite)](#local-database-sqlite)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Available Scripts](#available-scripts)
- [Best Practices](#best-practices)
- [Project Structure](#project-structure)
- [Adding a Main Feature](#adding-a-main-feature)
- [Dependencies](#dependencies)

## Tech Stack

- **Frontend:** [Vue 3](https://vuejs.org/), [Vue Router](https://router.vuejs.org/), [Vuetify](https://vuetifyjs.com/)
- **Build Tooling:** [Vite](https://vite.dev/), [TypeScript](https://www.typescriptlang.org/), [Vue TSC](https://www.npmjs.com/package/vue-tsc)
- **Desktop Runtime:** [Electron](https://www.electronjs.org/)
- **Local Database:** [SQLite](https://www.sqlite.org/) via Node.js built-in [`node:sqlite`](https://nodejs.org/api/sqlite.html) (Electron main process)
- **Internationalization:** [vue-i18n](https://vue-i18n.intlify.dev/)
- **Backend Services:** [Supabase](https://supabase.com/)
- **Monitoring:** local capture via Sentry offline queue (target: [`@sentry/electron`](https://docs.sentry.io/platforms/javascript/guides/electron/)); GlitchTip upload later; interim [`@sentry/vue`](https://docs.sentry.io/platforms/javascript/guides/vue/) in the renderer (see [Logging & Monitoring](#logging--monitoring))
- **Testing:** [Vitest](https://vitest.dev/) (unit), [Playwright](https://playwright.dev/) (E2E), [Storybook](https://storybook.js.org/) (UI components)
- **Code Quality:** [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)

## Logging & Monitoring

DojoSphere separates three lanes: **telemetry** (errors, queued locally), **audit** (business actions → SQLite `authorization_audit_logs`), and **debug** (support → log file in main).

**Current focus: capture first, send later.** Telemetry and audit are recorded locally even when offline or cloud mode is off. Upload to GlitchTip is planned for a later phase — see [`docs/logging.md`](docs/logging.md).

**Cloud mode (`isCloudUsed`)** gates cloud services and will gate telemetry **upload**, not **capture**.

**Scorekeepers** use the same audit logging as the **tournament director** for every write (`authorization_audit_logs`, via `entity_type`). **The audience** is anonymous and read-only — no name, no sign-in, and no dedicated activity logging.

Full architecture, phased issues, and risks: [`docs/logging.md`](docs/logging.md).

## Local Database (SQLite)

DojoSphere stores tournament data locally in the Electron main process using SQLite. The renderer talks to the database only through IPC handlers exposed via the preload script — there is no direct database access from the Vue frontend.

### Driver

- **Driver:** Node.js built-in [`node:sqlite`](https://nodejs.org/api/sqlite.html) (`DatabaseSync`) — synchronous SQLite access without native module rebuilds. Requires Node.js 24+.
- **Port:** Application code uses `@main/shared/database` (public API). Only `src/main/shared/database/driver.ts` imports `node:sqlite` directly.

Connection logic lives in `src/main/shared/database/`. The main process is built to `dist-electron/` via `vite-plugin-electron`.

### Database file

The database file is created at:

```
<userData>/database.db
```

On Windows this is typically `%APPDATA%/dojosphere/database.db`. The exact path comes from Electron's `app.getPath('userData')`.

### Migrations

Schema changes are applied automatically on startup via versioned SQL files in `src/main/shared/database/migrations/`. Applied migrations are tracked in a `_migrations` table. WAL mode, foreign keys, and a busy timeout are enabled before migrations run.

To add a migration:

1. Create a new `.sql` file in `src/main/shared/database/migrations/` using the naming pattern `V<number>__<description>.sql` (for example `V003__add_tournaments.sql`).
2. Register it in `src/main/shared/database/migrations/index.ts` with a matching `id` (import the `.sql` file with `?raw`).

### IPC API

The preload script (`src/preload/preload.ts`) exposes these methods on `window.api`:

- `dbHealthcheck()` — returns SQLite version and connection status
- `getUsers()` / `addUser(user)` — user management (subject to change as the schema evolves)
- `ensureLocalSession(displayName)` / `getLocalSession(token)` / `revokeLocalSession(token)` — local session handling
- `updateUserDisplayName(token, displayName)` — updates the display name for the authenticated session
- `getOsUsername()` — returns the OS username

### Inspecting the database

You can browse the local database with any SQLite client or the [DBCode](https://dbcode.io/) VS Code extension. A sample connection is preconfigured in `.vscode/settings.json` (adjust the `socket` path to your `userData` location if needed).

## Requirements

- **Node.js:** 24 or newer (required for `node:sqlite`)
- **npm:** installed with Node.js
- **(Optional) Supabase CLI:** for local Supabase services

## Quick Start

```bash
npm install
npm run dev
```

Run the desktop app (Vite dev server + Electron):

```bash
npm run dev
```

Or use the alias:

```bash
npm run electron:start
```

Run Storybook for isolated UI development:

```bash
npm run storybook
```

Create a production build:

```bash
npm run build
```

## Available Scripts

- `npm run dev` starts the Vite development server and Electron (via `vite-plugin-electron`).
- `npm run build` runs type checks and creates a production build (renderer in `dist/`, Electron in `dist-electron/`).
- `npm run preview` serves a local preview of the production build.
- `npm run electron` starts Electron against the last build (`dist-electron/main.js`).
- `npm run electron:start` alias for `npm run dev`.
- `npm run lint:check` runs ESLint checks.
- `npm run lint:fix` auto-fixes supported ESLint issues.
- `npm run type:check` runs TypeScript checks for Vue, Vite config, and Electron without building.
- `npm run format:check` checks formatting with Prettier.
- `npm run format:fix` formats files using Prettier.
- `npm run test` runs unit tests with Vitest.
- `npm run test:main` runs main-process unit tests only.
- `npm run test:coverage` runs tests and generates a coverage report.
- `npm run test:e2e` runs end-to-end tests with Playwright.
- `npm run test:e2e:ui` opens Playwright in UI mode.
- `npm run storybook` starts Storybook on the port from [`config/dev.json`](config/dev.json) (default `6006`).
- `npm run build-storybook` creates a static Storybook build.
- `npm run supabase:start` starts local Supabase services.
- `npm run supabase:stop` stops local Supabase services.
- `npm run supabase:status` shows the status of local Supabase services.
- `npm run supabase:init` initializes Supabase configuration for the project.

## Best Practices

- Keep changes small and focused by feature or fix.
- Run `lint:check`, `type:check`, and relevant tests before every commit.
- Cover new business logic with unit tests and critical flows with E2E tests.
- Avoid hardcoded UI strings and use i18n keys consistently.
- Handle errors and edge cases explicitly (auth, API failures, offline behavior).
- Keep formatting and import ordering consistent across the codebase.

## Project Structure

The codebase uses two complementary architectures:

| Area                | Architecture                                            | Location                                                          |
| ------------------- | ------------------------------------------------------- | ----------------------------------------------------------------- |
| **Renderer**        | [Feature-Sliced Design](https://feature-sliced.design/) | `src/renderer/app/`, `pages/`, `widgets/`, `features/`, `shared/` |
| **Preload**         | IPC bridge                                              | `src/preload/`                                                    |
| **Main (Electron)** | Vertical Slices                                         | `src/main/features/<slice>/`, `shared/`, `app/`                   |

### Renderer (FSD)

- `src/renderer/app/` — composition root (router, plugins, providers)
- `src/renderer/pages/` — route-level components
- `src/renderer/widgets/` — reusable composed UI blocks
- `src/renderer/features/` — business slices (authentication, settings, status, …)
- `src/renderer/shared/` — cross-cutting utilities, API clients, UI primitives

See `.cursor/rules/architecture-fsd.mdc` for import rules and slice conventions.

### Main process (Vertical Slices)

- `src/main/app/` — bootstrap, IPC registration (`register-ipc.ts`)
- `src/main/features/<slice>/` — one use case per slice (users, sessions, health, …)
- `src/main/shared/` — infrastructure (database, security helpers)
- `src/main/window/` — main-process window setup
- `src/preload/` — IPC bridge to `window.api`

Each main feature slice follows this layout:

```
src/main/features/<slice>/
  ipc/register.ts    # thin IPC adapters
  service/           # use-case orchestration (optional)
  repository/        # SQL access (optional)
  index.ts           # public API
```

Import rules: `features → shared`; `features → features` only via `@main/features/<slice>`; `shared` must not import features.

See `.cursor/rules/architecture-vertical-slice.mdc` for details.

## Adding a Main Feature

1. Create `src/main/features/<slice>/` with `index.ts` exporting `registerXxxIpc` (and services if needed).
2. Register the slice in `src/main/app/register-ipc.ts`.
3. Extend `src/preload/preload.ts` and `src/renderer/shared/types/electron-api.ts` only when adding new IPC channels.
4. Add SQL migrations under `src/main/shared/database/migrations/` when the schema changes.
5. Co-locate tests; use `@main/shared/database` in tests, not internal driver paths.

## Dependencies

- `@fontsource/roboto`: Provides local Roboto fonts for consistent typography across platforms.
- `@mdi/js`: Provides Material Design icon SVG paths for flexible icon rendering.
- `@sentry/vue`: Interim — runtime errors and breadcrumbs in the renderer; migration to `@sentry/electron` planned ([`docs/logging.md`](docs/logging.md)).
- `@supabase/supabase-js`: Client SDK for Supabase auth, database access, and related services.
- `vue`: Core framework for building reactive, component-driven user interfaces.
- `vue-i18n`: Internationalization library for translations and locale-aware UI text.
- `vue-router`: Official routing library for navigation and page-level state by route.
- `vuetify`: Material Design component framework for consistent, fast UI development.
