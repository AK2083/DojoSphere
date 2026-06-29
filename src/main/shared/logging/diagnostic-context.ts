import { release } from 'node:os'

import { app } from 'electron'

import { createLogger } from './logger'

/** Allowlisted fields for anonymous system snapshots at session start. */
const SYSTEM_SNAPSHOT_FIELDS = [
  'platform',
  'arch',
  'osRelease',
  'appVersion',
  'electronVersion',
  'mode'
] as const

type SystemSnapshotField = (typeof SYSTEM_SNAPSHOT_FIELDS)[number]

/** Anonymous OS/runtime context written once per application session. */
export type SystemSnapshot = Record<SystemSnapshotField, string>

function pickAllowlistedSnapshot(fields: Record<string, string>): SystemSnapshot {
  const snapshot = {} as SystemSnapshot

  for (const key of SYSTEM_SNAPSHOT_FIELDS) {
    snapshot[key] = fields[key]
  }

  return snapshot
}

/**
 * Builds the allowlisted system snapshot for the current session.
 *
 * @returns Anonymous OS/runtime fields only — no hostname, username, or network identifiers.
 */
export function buildSystemSnapshot(): SystemSnapshot {
  return pickAllowlistedSnapshot({
    platform: process.platform,
    arch: process.arch,
    osRelease: release(),
    appVersion: app.getVersion(),
    electronVersion: process.versions.electron ?? 'unknown',
    mode: import.meta.env.MODE
  })
}

/**
 * Writes a one-time anonymous system snapshot to the local error log.
 *
 * Independent of the cloud diagnostic upload preference.
 */
export function captureSystemSnapshot(): void {
  createLogger('diagnostics').info('session_snapshot', buildSystemSnapshot())
}
