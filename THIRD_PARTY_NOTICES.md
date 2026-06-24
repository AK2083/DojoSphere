# Third-Party Notices

DojoSphere is distributed under the MIT License. The following third-party services and libraries are used in optional or bundled form.

## Hosted services (operator-configured)

### Grafana Cloud

When diagnostic upload is enabled in Settings, pseudonymized error telemetry may be sent to Grafana Cloud (Grafana Labs) via OTLP. This is a **hosted service** with separate terms and privacy obligations. See [Grafana Privacy Policy](https://grafana.com/legal/privacy-policy/).

Credentials for Grafana Cloud OTLP ingest are configured in the **main process environment** only (`OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_EXPORTER_OTLP_HEADERS`). They must not be shipped in the renderer or repository.

### Supabase

Optional cloud authentication and sync use Supabase when cloud mode is enabled. See [Supabase Privacy Policy](https://supabase.com/privacy).

## Open-source dependencies

Runtime dependencies are listed in `package.json`. Notable stacks include:

- Vue 3, Vuetify, Vue Router, vue-i18n
- Electron
- OpenTelemetry (`@opentelemetry/*`)
- `@supabase/supabase-js`

For a full license report, run `npx license-checker --production` in the project root.
