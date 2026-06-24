import { ref } from 'vue'
import { bindConnectivityState } from '@shared/model/connectivity-state'
import { afterEach, describe, expect, it } from 'vitest'

import {
  isCloudModeMonitoringAllowed,
  resetCloudModeMonitoringCheck,
  setAutoUploadDiagnosticsCheck,
  setCloudModeMonitoringCheck,
  shouldCaptureTelemetry,
  shouldUploadTelemetry
} from './monitoring-guard'

describe('monitoring-guard', () => {
  afterEach(() => {
    resetCloudModeMonitoringCheck()
    bindConnectivityState({
      isOnline: ref(true),
      isCloudUsed: ref(false),
      isSupabaseReachable: ref(true),
      isGrafanaCloudReachable: ref(false)
    })
  })

  it('allows capture regardless of navigator.onLine', () => {
    Object.defineProperty(globalThis.navigator, 'onLine', {
      configurable: true,
      value: false
    })

    expect(shouldCaptureTelemetry()).toBe(true)
  })

  it('allows capture when cloud mode check is registered and returns false', () => {
    setCloudModeMonitoringCheck(() => false)

    expect(shouldCaptureTelemetry()).toBe(true)
    expect(isCloudModeMonitoringAllowed()).toBe(false)
  })

  it('reports cloud mode allowed when check is not registered', () => {
    expect(isCloudModeMonitoringAllowed()).toBe(true)
  })

  it('blocks upload when auto diagnostics is off', () => {
    setAutoUploadDiagnosticsCheck(() => false)
    bindConnectivityState({
      isOnline: ref(true),
      isCloudUsed: ref(false),
      isSupabaseReachable: ref(true),
      isGrafanaCloudReachable: ref(true)
    })

    expect(shouldUploadTelemetry()).toBe(false)
  })

  it('blocks upload when Grafana Cloud is unreachable', () => {
    setAutoUploadDiagnosticsCheck(() => true)
    bindConnectivityState({
      isOnline: ref(true),
      isCloudUsed: ref(false),
      isSupabaseReachable: ref(true),
      isGrafanaCloudReachable: ref(false)
    })

    expect(shouldUploadTelemetry()).toBe(false)
  })

  it('allows upload when auto diagnostics is on and Grafana is reachable, regardless of cloud mode', () => {
    setAutoUploadDiagnosticsCheck(() => true)
    bindConnectivityState({
      isOnline: ref(true),
      isCloudUsed: ref(false),
      isSupabaseReachable: ref(true),
      isGrafanaCloudReachable: ref(true)
    })

    expect(shouldUploadTelemetry()).toBe(true)
  })

  it('allows upload when auto diagnostics and Grafana reachability pass', () => {
    setAutoUploadDiagnosticsCheck(() => true)
    bindConnectivityState({
      isOnline: ref(true),
      isCloudUsed: ref(true),
      isSupabaseReachable: ref(true),
      isGrafanaCloudReachable: ref(true)
    })

    expect(shouldUploadTelemetry()).toBe(true)
  })
})
