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
- **Monitoring:** [OpenTelemetry](https://opentelemetry.io/) — local trace capture; see [Logging & monitoring](docs/logging.md)
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
- [Logging & monitoring](docs/logging.md) — telemetry, audit, and debug lanes

## Logging & monitoring

DojoSphere separates three lanes: **telemetry** (OpenTelemetry traces), **audit** (business actions in SQLite), and **debug** (support logs in main). Capture is **local-first** and works offline; uploading traces to Grafana Cloud is prepared but not enabled in the product yet.

| Role                                  | Logging                                                                                       |
| ------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Tournament director / scorekeeper** | Full telemetry on authenticated paths; every privileged write is audited with `actor_user_id` |
| **Audience** (`/audience`)            | Anonymous — no sign-in, no name, no activity breadcrumbs or audit for browsing                |

Features use the stable public API in `@shared/lib` (`captureException`, `addBreadcrumb`, `setUserContext`, `auditRecord`, …) — not OpenTelemetry SDK calls directly.

Local files (Electron `userData`): `telemetry/traces.jsonl`, `database.db` (`authorization_audit_logs`), `logs/app.log`.

Full architecture, roles, and deferred upload phase: [docs/logging.md](docs/logging.md). Audience rules: [src/renderer/features/audience/README.md](src/renderer/features/audience/README.md).

## License

MIT — see [LICENSE](LICENSE).
