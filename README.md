# DojoSphere

Open-source Electron application for managing Judo tournaments.

## Features

- Tournament administration
- Competitor and club management
- Local intranet spectator view
- Match and schedule overview
- Offline/local-first capable setup

## Table of Contents

- [Tech Stack](#tech-stack)
- [Local Database (SQLite)](#local-database-sqlite)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Available Scripts](#available-scripts)
- [Best Practices](#best-practices)
- [Project Structure (Recommended)](#project-structure-recommended)
- [Dependencies](#dependencies)

## Tech Stack

- **Frontend:** [Vue 3](https://vuejs.org/), [Vue Router](https://router.vuejs.org/), [Vuetify](https://vuetifyjs.com/)
- **Build Tooling:** [Vite](https://vite.dev/), [TypeScript](https://www.typescriptlang.org/), [Vue TSC](https://www.npmjs.com/package/vue-tsc)
- **Desktop Runtime:** [Electron](https://www.electronjs.org/)
- **Local Database:** [SQLite](https://www.sqlite.org/) via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) (Electron main process)
- **Internationalization:** [vue-i18n](https://vue-i18n.intlify.dev/)
- **Backend Services:** [Supabase](https://supabase.com/)
- **Monitoring:** [Sentry for Vue](https://docs.sentry.io/platforms/javascript/guides/vue/), [GlitchTip](https://glitchtip.com/)
- **Testing:** [Vitest](https://vitest.dev/) (unit), [Playwright](https://playwright.dev/) (E2E), [Storybook](https://storybook.js.org/) (UI components)
- **Code Quality:** [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)

## Local Database (SQLite)

DojoSphere stores tournament data locally in the Electron main process using SQLite. The renderer talks to the database only through IPC handlers exposed via the preload script — there is no direct database access from the Vue frontend.

### Driver

- **Primary:** [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) — synchronous, high-performance native bindings suited to Electron's main process.
- **Fallback:** Node.js built-in [`node:sqlite`](https://nodejs.org/api/sqlite.html) (`DatabaseSync`) when the native module is unavailable (for example after a Node/Electron version mismatch).

Connection logic lives in `electron/database/connection.ts`. The main process is built to `dist-electron/` via `vite-plugin-electron`.

### Database file

The database file is created at:

```
<userData>/database.db
```

On Windows this is typically `%APPDATA%/dojosphere/database.db`. The exact path comes from Electron's `app.getPath('userData')`.

### Migrations

Schema changes are applied automatically on startup via versioned SQL files in `electron/database/migrations/`. Applied migrations are tracked in a `_migrations` table. WAL mode, foreign keys, and a busy timeout are enabled before migrations run.

To add a migration:

1. Create a new `.sql` file in `electron/database/migrations/` using the naming pattern `V<number>__<description>.sql` (for example `V003__add_tournaments.sql`).
2. Register it in `electron/database/migrations/index.ts` with a matching `id` (import the `.sql` file with `?raw`).

### IPC API

The preload script (`electron/preload.ts`) exposes these methods on `window.api`:

- `dbHealthcheck()` — returns SQLite version and connection status
- `getUsers()` / `addUser(user)` — example handlers (subject to change as the schema evolves)

### Native module rebuild

`better-sqlite3` ships native binaries that must match the Electron runtime. After upgrading Electron or on a fresh clone, rebuild the module:

```bash
npm run rebuild-sqlite
```

If you see errors like `NODE_MODULE_VERSION` mismatch or `better-sqlite3 nicht verfuegbar`, run this script first. The app will fall back to `node:sqlite` until the rebuild succeeds.

### Inspecting the database

You can browse the local database with any SQLite client or the [DBCode](https://dbcode.io/) VS Code extension. A sample connection is preconfigured in `.vscode/settings.json` (adjust the `socket` path to your `userData` location if needed).

## Requirements

- **Node.js:** latest LTS recommended
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
- `npm run test:coverage` runs tests and generates a coverage report.
- `npm run test:e2e` runs end-to-end tests with Playwright.
- `npm run test:e2e:ui` opens Playwright in UI mode.
- `npm run storybook` starts Storybook (uses the next free port if `6006` is already occupied).
- `npm run build-storybook` creates a static Storybook build.
- `npm run supabase:start` starts local Supabase services.
- `npm run supabase:stop` stops local Supabase services.
- `npm run supabase:status` shows the status of local Supabase services.
- `npm run supabase:init` initializes Supabase configuration for the project.
- `npm run rebuild-sqlite` rebuilds the `better-sqlite3` native module for the current Electron version.

## Best Practices

- Keep changes small and focused by feature or fix.
- Run `lint:check`, `type:check`, and relevant tests before every commit.
- Cover new business logic with unit tests and critical flows with E2E tests.
- Avoid hardcoded UI strings and use i18n keys consistently.
- Handle errors and edge cases explicitly (auth, API failures, offline behavior).
- Keep formatting and import ordering consistent across the codebase.

## Project Structure (Recommended)

- The structure follows key ideas from [Feature-Sliced Design](https://feature-sliced.design/): business-focused slices, clear boundaries, and explicit module APIs.
- `src/features/` contains domain-focused feature slices (for example authentication and settings).
- `src/widgets/` contains reusable, composed UI blocks that combine multiple features/entities.
- `src/shared/` (if present) contains cross-cutting utilities, types, and configuration with no business ownership.
- `electron/` contains TypeScript main and preload logic for the desktop runtime (built to `dist-electron/`).
- `electron/database/` contains SQLite connection setup, migration runner, and versioned schema files.

## Dependencies

- `@fontsource/roboto`: Provides local Roboto fonts for consistent typography across platforms.
- `@mdi/js`: Provides Material Design icon SVG paths for flexible icon rendering.
- `@sentry/vue`: Captures runtime errors and performance signals for monitoring and debugging.
- `@supabase/supabase-js`: Client SDK for Supabase auth, database access, and related services.
- `better-sqlite3`: Synchronous SQLite driver for the Electron main process (local-first tournament data).
- `vue`: Core framework for building reactive, component-driven user interfaces.
- `vue-i18n`: Internationalization library for translations and locale-aware UI text.
- `vue-router`: Official routing library for navigation and page-level state by route.
- `vuetify`: Material Design component framework for consistent, fast UI development.
