# Contributing to DojoSphere

Thank you for your interest in contributing. This guide covers the development workflow, quality checks, and how to extend the codebase.

## Requirements

- **Node.js:** 24 or newer (required for `node:sqlite`)
- **npm:** installed with Node.js
- **Windows:** [Microsoft Visual C++ Redistributable (x64)](https://aka.ms/vs/17/release/vc_redist.x64.exe) — required to load native Node addons used by Vite, Vitest, and Electron’s install tooling
- **(Optional) Supabase CLI:** for local Supabase services

## Getting started

```bash
npm install
npm run dev
```

`npm run dev` starts the Vite development server and Electron (alias: `npm run electron:start`).

For isolated UI work, run `npm run storybook`. For a production build, run `npm run build`.

See the [README](README.md) for a project overview and feature list.

### Windows: Visual C++ Redistributable

On a fresh Windows machine, `npm install` can succeed while `npm test` and `npm run electron:start` still fail. Typical symptoms:

- `Cannot find native binding` / `ERR_DLOPEN_FAILED` for packages such as `oxc-resolver` or `@electron-internal/extract-zip`
- German Windows: `Das angegebene Modul wurde nicht gefunden` when loading a `.node` file that **does** exist under `node_modules`
- Electron: `Downloading Electron binary...` then failure; later `Electron failed to install correctly` / missing `node_modules/electron/dist`

**Cause:** Native `.node` addons need `VCRUNTIME140.dll` / `MSVCP140.dll`. Those come from the VC++ Redistributable, not from `npm install`. This is a **developer machine** requirement; a packaged Electron app for end users normally ships its own runtime and does not need a separate VC++ install for this reason.

**Fix:**

1. Install [VC_redist.x64.exe](https://aka.ms/vs/17/release/vc_redist.x64.exe).
2. Re-open the terminal, then reinstall Electron so the binary download can finish:

```powershell
Remove-Item -Recurse -Force node_modules\electron
npm install
```

If Electron is still incomplete:

```powershell
node node_modules/electron/install.js
```

3. Run `npm test` and `npm run electron:start` again.

A full wipe of `node_modules` is only needed if problems remain after the Redistributable is installed.

## Available scripts

- `npm run dev` — Vite development server and Electron (via `vite-plugin-electron`).
- `npm run build` — type checks and production build (renderer in `dist/`, Electron in `dist-electron/`).
- `npm run preview` — local preview of the production build.
- `npm run electron` — Electron against the last build (`dist-electron/main.js`).
- `npm run electron:start` — alias for `npm run dev`.
- `npm run lint:check` — ESLint checks.
- `npm run lint:fix` — auto-fix supported ESLint issues.
- `npm run type:check` — TypeScript checks for Vue, Vite config, and Electron without building.
- `npm run format:check` — Prettier formatting check.
- `npm run format:fix` — format files with Prettier.
- `npm run test` — unit tests with Vitest.
- `npm run test:main` — main-process unit tests only.
- `npm run test:coverage` — tests with coverage report.
- `npm run test:e2e` — end-to-end tests with Playwright.
- `npm run test:e2e:ui` — Playwright in UI mode.
- `npm run storybook` — Storybook on the port from [`config/dev.json`](config/dev.json) (default `6006`).
- `npm run build-storybook` — static Storybook build.
- `npm run supabase:start` — start local Supabase services.
- `npm run supabase:stop` — stop local Supabase services.
- `npm run supabase:status` — status of local Supabase services.
- `npm run supabase:init` — initialize Supabase configuration for the project.

## Best practices

- Keep changes small and focused by feature or fix.
- Run `lint:check`, `type:check`, and relevant tests before every commit.
- Cover new business logic with unit tests and critical flows with E2E tests.
- Avoid hardcoded UI strings and use i18n keys consistently.
- Handle errors and edge cases explicitly (auth, API failures, offline behavior).
- Keep formatting and import ordering consistent across the codebase.
- Do not store secrets, API keys, or tokens in the repository, renderer, or logs.
- SQLite access belongs in the Electron main process only; the renderer uses IPC.

## Architecture

The renderer follows [Feature-Sliced Design](https://feature-sliced.design/); the Electron main process uses vertical slices. See [docs/architecture.md](docs/architecture.md) for folder layout, import rules, and slice conventions.

## Adding a main feature

1. Create `src/main/features/<slice>/` with `index.ts` exporting `registerXxxIpc` (and services if needed).
2. Register the slice in `src/main/app/register-ipc.ts`.
3. Extend `src/preload/preload.ts` and `src/renderer/shared/types/electron-api.ts` only when adding new IPC channels.
4. Add SQL migrations under `src/main/shared/database/migrations/` when the schema changes — see [docs/database.md](docs/database.md).
5. Co-locate tests; use `@main/shared/database` in tests, not internal driver paths.

## Further documentation

- [Architecture](docs/architecture.md) — FSD renderer, vertical slices in main, import rules
- [Local database](docs/database.md) — SQLite, migrations, IPC API
- [Logging & audit](docs/logging.md) — local error log and SQLite audit
