import { describe, expect, it, vi } from 'vitest'

import {
  mockHeartbeatSuccess,
  setCloudModeDisabled,
  setCloudModeEnabled,
  setupLoginAvailable
} from './setup-login-available'

const CLOUD_STATUS_KEY = 'dojosphere.cloud.status.isCloudUsed'

describe('setCloudModeEnabled', () => {
  it('registers init script with cloud status enabled', async () => {
    const addInitScript = vi.fn().mockResolvedValue(undefined)
    const page = { addInitScript } as unknown as Parameters<typeof setCloudModeEnabled>[0]

    await setCloudModeEnabled(page)

    expect(addInitScript).toHaveBeenCalledTimes(1)
    const [script, args] = addInitScript.mock.calls[0]

    expect(typeof script).toBe('function')
    expect(args).toEqual([CLOUD_STATUS_KEY])

    const setItemSpy = vi.spyOn(Object.getPrototypeOf(globalThis.localStorage), 'setItem')
    ;(script as (args: string[]) => void)(args)
    expect(setItemSpy).toHaveBeenCalledWith(CLOUD_STATUS_KEY, JSON.stringify(true))
    setItemSpy.mockRestore()
  })
})

describe('setCloudModeDisabled', () => {
  it('registers init script with cloud status disabled', async () => {
    const addInitScript = vi.fn().mockResolvedValue(undefined)
    const page = { addInitScript } as unknown as Parameters<typeof setCloudModeDisabled>[0]

    await setCloudModeDisabled(page)

    expect(addInitScript).toHaveBeenCalledTimes(1)
    const [script, args] = addInitScript.mock.calls[0]

    expect(typeof script).toBe('function')
    expect(args).toEqual([CLOUD_STATUS_KEY])

    const setItemSpy = vi.spyOn(Object.getPrototypeOf(globalThis.localStorage), 'setItem')
    ;(script as (args: string[]) => void)(args)
    expect(setItemSpy).toHaveBeenCalledWith(CLOUD_STATUS_KEY, JSON.stringify(false))
    setItemSpy.mockRestore()
  })
})

describe('mockHeartbeatSuccess', () => {
  it('registers a successful heartbeat route handler', async () => {
    const fulfill = vi.fn().mockResolvedValue(undefined)
    const routeHandler = vi.fn()
    const page = {
      route: vi.fn((_pattern: string, handler: typeof routeHandler) => {
        routeHandler.mockImplementation(handler)
      })
    } as unknown as Parameters<typeof mockHeartbeatSuccess>[0]

    await mockHeartbeatSuccess(page)

    expect(page.route).toHaveBeenCalledWith('**/functions/v1/heartbeat', expect.any(Function))

    await routeHandler({
      fulfill
    })

    expect(fulfill).toHaveBeenCalledWith({
      status: 200,
      contentType: 'application/json',
      body: expect.stringContaining('"status":"ok"')
    })
  })
})

describe('setupLoginAvailable', () => {
  it('enables cloud mode and mocks heartbeat success', async () => {
    const addInitScript = vi.fn().mockResolvedValue(undefined)
    const route = vi.fn().mockResolvedValue(undefined)
    const page = {
      addInitScript,
      route
    } as unknown as Parameters<typeof setupLoginAvailable>[0]

    await setupLoginAvailable(page)

    expect(addInitScript).toHaveBeenCalledTimes(1)
    expect(route).toHaveBeenCalledWith('**/functions/v1/heartbeat', expect.any(Function))
  })
})
