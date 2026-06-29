# DojoSphere

Open-source Electron application for managing Judo tournaments.

## Features

- Tournament administration
- Competitor and club management
- Local intranet **audience** overview (`/audience`, anonymous, no activity logging)
- Match and schedule overview
- Offline/local-first capable setup

## Tech Stack

- **Frontend:** [Vue 3](https://vuejs.org/), [Vue Router](https://router.vuejs.org/), [Vuetify](https://vuetifyjs.com/)
- **Build Tooling:** [Vite](https://vite.dev/), [TypeScript](https://www.typescriptlang.org/), [Vue TSC](https://www.npmjs.com/package/vue-tsc)
- **Desktop Runtime:** [Electron](https://www.electronjs.org/)
- **Local Database:** [SQLite](https://www.sqlite.org/) via Node.js built-in [`node:sqlite`](https://nodejs.org/api/sqlite.html) (Electron main process)
- **Internationalization:** [vue-i18n](https://vue-i18n.intlify.dev/)
- **Backend Services:** [Supabase](https://supabase.com/) (optional cloud sync)
- **Logging:** Local error log + SQLite audit; see [Logging & monitoring](docs/logging.md)
- **Testing:** [Vitest](https://vitest.dev/) (unit), [Playwright](https://playwright.dev/) (E2E), [Storybook](https://storybook.js.org/) (UI components)
- **Code Quality:** [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)

## Quick Start

**Requirements:** Node.js 24+, npm. Optional: Supabase CLI for local cloud services.

```bash
npm install
npm run dev
```

Other common commands: `npm run storybook` (UI development), `npm run build` (production build).

## Documentation

- [Contributing](CONTRIBUTING.md) — development workflow, scripts, tests, adding features
- [Architecture](docs/architecture.md) — FSD renderer, vertical slices in main
- [Local database](docs/database.md) — SQLite, migrations, IPC
- [Logging & audit](docs/logging.md) — local error log and SQLite audit

## Logging & audit

DojoSphere uses two lanes: **error logging** (local `app.log`) and **audit** (business actions in SQLite). Logging is **offline-only**; a Settings toggle for future cloud diagnostics is stored but does not upload data yet. At startup, an anonymous system snapshot (OS and app version) is written once to `app.log`.

| Role                                  | Logging                                                                                                   |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Tournament director / scorekeeper** | Errors logged from feature `api/` (renderer) and repositories (main); privileged writes audited in SQLite |
| **Audience** (`/audience`)            | Anonymous — no audit for browsing; errors still logged on real failures                                   |

Features use `logError` from `@shared/lib` in `api/` layers — not ad-hoc `console` or file access.

Local files (Electron `userData`): `logs/app.log`, `database.db` (`authorization_audit_logs`).

Full architecture: [docs/logging.md](docs/logging.md). Audience rules: [src/renderer/features/audience/README.md](src/renderer/features/audience/README.md).

## License

MIT — see [LICENSE](LICENSE).
