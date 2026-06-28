import { createMemoryHistory, createRouter } from 'vue-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@shared/lib/logging/activity-logging-scope', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@shared/lib/logging/activity-logging-scope')>()

  return {
    ...actual,
    setActivityLoggingEnabled: vi.fn(actual.setActivityLoggingEnabled)
  }
})

describe('bindActivityLoggingToRouter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('disables activity logging on audience routes', async () => {
    const { setActivityLoggingEnabled, resetActivityLoggingScope } =
      await import('@shared/lib/logging/activity-logging-scope')
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
  })

  it('enables activity logging on authenticated paths', async () => {
    const { setActivityLoggingEnabled, resetActivityLoggingScope } =
      await import('@shared/lib/logging/activity-logging-scope')
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
  })
})
