import { afterEach, describe, expect, it } from 'vitest'

import {
  isCloudModeMonitoringAllowed,
  resetCloudModeMonitoringCheck,
  setCloudModeMonitoringCheck,
  shouldCaptureTelemetry
} from './monitoring-guard'

describe('monitoring-guard', () => {
  afterEach(() => {
    resetCloudModeMonitoringCheck()
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
})
