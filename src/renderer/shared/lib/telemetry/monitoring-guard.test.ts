import { ref } from 'vue'
import { bindConnectivityState } from '@shared/model/connectivity-state'
import { afterEach, describe, expect, it } from 'vitest'

import {
  isCloudModeMonitoringAllowed,
  resetCloudModeMonitoringCheck,
  setCloudModeMonitoringCheck,
  shouldCaptureTelemetry,
  shouldUploadTelemetry
} from './monitoring-guard'

describe('monitoring-guard', () => {
  afterEach(() => {
    resetCloudModeMonitoringCheck()
    bindConnectivityState({
      isOnline: ref(true),
      isCloudUsed: ref(true),
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

  it('blocks upload when cloud mode is off', () => {
    setCloudModeMonitoringCheck(() => false)
    bindConnectivityState({
      isOnline: ref(true),
      isCloudUsed: ref(false),
      isSupabaseReachable: ref(true),
      isGrafanaCloudReachable: ref(true)
    })

    expect(shouldUploadTelemetry()).toBe(false)
  })

  it('blocks upload when heartbeat is ok but Grafana Cloud is down', () => {
    setCloudModeMonitoringCheck(() => true)
    bindConnectivityState({
      isOnline: ref(true),
      isCloudUsed: ref(true),
      isSupabaseReachable: ref(true),
      isGrafanaCloudReachable: ref(false)
    })

    expect(shouldUploadTelemetry()).toBe(false)
  })

  it('allows upload when cloud mode and Grafana Cloud reachability pass', () => {
    setCloudModeMonitoringCheck(() => true)
    bindConnectivityState({
      isOnline: ref(true),
      isCloudUsed: ref(true),
      isSupabaseReachable: ref(true),
      isGrafanaCloudReachable: ref(true)
    })

    expect(shouldUploadTelemetry()).toBe(true)
  })
})
