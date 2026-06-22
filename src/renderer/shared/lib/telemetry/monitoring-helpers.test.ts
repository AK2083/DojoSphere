import { beforeEach, describe, expect, it, vi } from 'vitest'

const { addBreadcrumb } = vi.hoisted(() => ({
  addBreadcrumb: vi.fn()
}))

vi.mock('./logging', () => ({
  addBreadcrumb
}))

import { createMonitoringHelpers } from './monitoring-helpers'

describe('createMonitoringHelpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('forwards breadcrumbs with the configured category and level', () => {
    const { monitorDebug, monitorInformation, monitorWarning, monitorError } =
      createMonitoringHelpers('authentication')

    monitorDebug('auth.debug', { step: 'read' })
    monitorInformation('auth.info')
    monitorWarning('auth.warning', { code: 'retry' })
    monitorError('auth.error')

    expect(addBreadcrumb).toHaveBeenNthCalledWith(1, 'auth.debug', 'authentication', 'debug', {
      step: 'read'
    })
    expect(addBreadcrumb).toHaveBeenNthCalledWith(
      2,
      'auth.info',
      'authentication',
      'info',
      undefined
    )
    expect(addBreadcrumb).toHaveBeenNthCalledWith(3, 'auth.warning', 'authentication', 'warning', {
      code: 'retry'
    })
    expect(addBreadcrumb).toHaveBeenNthCalledWith(
      4,
      'auth.error',
      'authentication',
      'error',
      undefined
    )
  })
})
