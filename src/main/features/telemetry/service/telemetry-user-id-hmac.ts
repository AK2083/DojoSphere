import { createHmac, randomBytes } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const TELEMETRY_DIR_NAME = 'telemetry'
const HMAC_KEY_FILE_NAME = 'export-hmac.key'

/**
 * Resolves the HMAC secret used to pseudonymize user IDs before Grafana export.
 *
 * @param userDataPath Electron userData directory.
 * @param env Process environment (defaults to `process.env`).
 * @returns Secret bytes for HMAC-SHA256.
 */
export function resolveTelemetryExportHmacSecret(
  userDataPath: string,
  env: NodeJS.ProcessEnv = process.env
): Buffer {
  const envSecret = env.TELEMETRY_EXPORT_HMAC_SECRET?.trim()

  if (envSecret) {
    return Buffer.from(envSecret, 'utf8')
  }

  const telemetryDir = join(userDataPath, TELEMETRY_DIR_NAME)
  const keyPath = join(telemetryDir, HMAC_KEY_FILE_NAME)

  // eslint-disable-next-line security/detect-non-literal-fs-filename -- trusted telemetry directory
  if (existsSync(keyPath)) {
    // Path is resolved under Electron userData; not derived from untrusted input.
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- trusted telemetry directory
    return readFileSync(keyPath)
  }

  // eslint-disable-next-line security/detect-non-literal-fs-filename -- trusted telemetry directory
  mkdirSync(telemetryDir, { recursive: true })
  const secret = randomBytes(32)
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- trusted telemetry directory
  writeFileSync(keyPath, secret, { mode: 0o600 })

  return secret
}

/**
 * Pseudonymizes a raw user ID with HMAC-SHA256 for external telemetry export.
 *
 * @param rawUserId Internal user identifier.
 * @param secret HMAC secret from {@link resolveTelemetryExportHmacSecret}.
 * @returns Hex-encoded HMAC digest.
 */
export function hashTelemetryUserId(rawUserId: string, secret: Buffer): string {
  return createHmac('sha256', secret).update(rawUserId).digest('hex')
}
