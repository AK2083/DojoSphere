import { afterEach, describe, expect, it } from 'vitest'

import {
  isActivityLoggingEnabled,
  resetActivityLoggingScope,
  setActivityLoggingEnabled
} from './activity-logging-scope'

describe('activity-logging-scope', () => {
  afterEach(() => {
    resetActivityLoggingScope()
  })

  it('is enabled by default', () => {
    expect(isActivityLoggingEnabled()).toBe(true)
  })

  it('can be disabled for audience routes', () => {
    setActivityLoggingEnabled(false)

    expect(isActivityLoggingEnabled()).toBe(false)
  })

  it('resets to enabled', () => {
    setActivityLoggingEnabled(false)
    resetActivityLoggingScope()

    expect(isActivityLoggingEnabled()).toBe(true)
  })
})
