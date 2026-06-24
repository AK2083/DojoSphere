import { createMemoryHistory, createRouter } from 'vue-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const clearUserContext = vi.fn()
const monitorInformation = vi.fn()

vi.mock('@shared/lib/telemetry/logging', () => ({
  clearUserContext
}))

vi.mock('@shared/lib/telemetry/activity-logging-scope', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@shared/lib/telemetry/activity-logging-scope')>()

  return {
    ...actual,
    setActivityLoggingEnabled: vi.fn(actual.setActivityLoggingEnabled)
  }
})

vi.mock('./monitoring', () => ({
  MONITORING_EVENTS: {
    ROUTE_CHANGED: 'router.route.changed'
  },
  monitorInformation
}))

describe('bindActivityLoggingToRouter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('disables activity logging and clears user context on audience routes', async () => {
    const { setActivityLoggingEnabled, resetActivityLoggingScope } =
      await import('@shared/lib/telemetry/activity-logging-scope')
    const { bindActivityLoggingToRouter } = await import('./activity-logging')

    resetActivityLoggingScope()

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'dashboard', component: { template: '<div />' } },
        {
          path: '/audience',
          name: 'audience',
          meta: { activityLogging: false },
          component: { template: '<div />' }
        }
      ]
    })

    bindActivityLoggingToRouter(router)
    await router.push('/audience')
    await router.isReady()

    expect(setActivityLoggingEnabled).toHaveBeenLastCalledWith(false)
    expect(clearUserContext).toHaveBeenCalledOnce()
    expect(monitorInformation).not.toHaveBeenCalled()
  })

  it('records route breadcrumbs on authenticated paths', async () => {
    const { setActivityLoggingEnabled, resetActivityLoggingScope } =
      await import('@shared/lib/telemetry/activity-logging-scope')
    const { bindActivityLoggingToRouter } = await import('./activity-logging')

    resetActivityLoggingScope()

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', name: 'dashboard', component: { template: '<div />' } }]
    })

    bindActivityLoggingToRouter(router)
    await router.push('/')
    await router.isReady()

    expect(setActivityLoggingEnabled).toHaveBeenLastCalledWith(true)
    expect(monitorInformation).toHaveBeenCalledWith('router.route.changed', { name: 'dashboard' })
  })
})
