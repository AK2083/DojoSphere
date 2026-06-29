import { getAuthSessionStorageKey } from '@shared/api/supabase/model/auth-storage'
import { describe, expect, it, vi } from 'vitest'

import {
  clearSupabaseAuthSessionInStorage,
  mockHeartbeatSuccess,
  mockSupabaseCloudAuthForE2e,
  setSupabaseAuthSessionInStorage,
  setupLoginAvailable
} from './setup-login-available'

const AUTH_SESSION_KEY = getAuthSessionStorageKey()

describe('setSupabaseAuthSessionInStorage', () => {
  it('registers init script with supabase auth session', async () => {
    const addInitScript = vi.fn().mockResolvedValue(undefined)
    const page = { addInitScript } as unknown as Parameters<
      typeof setSupabaseAuthSessionInStorage
    >[0]

    await setSupabaseAuthSessionInStorage(page)

    expect(addInitScript).toHaveBeenCalledTimes(1)
    const [script, args] = addInitScript.mock.calls[0]

    expect(typeof script).toBe('function')
    expect(args).toHaveLength(2)
    expect(args[0]).toBe(AUTH_SESSION_KEY)

    const setItemSpy = vi.spyOn(Object.getPrototypeOf(globalThis.localStorage), 'setItem')
    ;(script as (args: string[]) => void)(args)
    const stored = JSON.parse(globalThis.localStorage.getItem(AUTH_SESSION_KEY) ?? '{}') as {
      access_token?: string
      user?: { id: string }
    }
    expect(stored.access_token).toBe('e2e-access-token')
    expect(stored.user?.id).toBe('00000000-0000-0000-0000-000000000001')
    expect(setItemSpy).toHaveBeenCalled()
    setItemSpy.mockRestore()
  })
})

describe('mockSupabaseCloudAuthForE2e', () => {
  it('seeds storage and registers auth route handlers', async () => {
    const addInitScript = vi.fn().mockResolvedValue(undefined)
    const userRouteHandler = vi.fn()
    const tokenRouteHandler = vi.fn()
    const fulfill = vi.fn().mockResolvedValue(undefined)
    const route = vi.fn((pattern: string, handler: typeof userRouteHandler) => {
      if (pattern === '**/auth/v1/user**') {
        userRouteHandler.mockImplementation(handler)
      }

      if (pattern === '**/auth/v1/token**') {
        tokenRouteHandler.mockImplementation(handler)
      }
    })
    const page = { addInitScript, route } as unknown as Parameters<
      typeof mockSupabaseCloudAuthForE2e
    >[0]

    await mockSupabaseCloudAuthForE2e(page)

    expect(addInitScript).toHaveBeenCalledTimes(1)
    expect(route).toHaveBeenCalledWith('**/auth/v1/user**', expect.any(Function))
    expect(route).toHaveBeenCalledWith('**/auth/v1/token**', expect.any(Function))

    await userRouteHandler({ fulfill })
    expect(fulfill).toHaveBeenCalledWith({
      status: 200,
      contentType: 'application/json',
      body: expect.stringContaining('"id":"00000000-0000-0000-0000-000000000001"')
    })

    await tokenRouteHandler({ fulfill })
    expect(fulfill).toHaveBeenCalledWith({
      status: 200,
      contentType: 'application/json',
      body: expect.stringContaining('"access_token":"e2e-access-token"')
    })
  })
})

describe('clearSupabaseAuthSessionInStorage', () => {
  it('registers init script that clears supabase auth session', async () => {
    const addInitScript = vi.fn().mockResolvedValue(undefined)
    const page = { addInitScript } as unknown as Parameters<
      typeof clearSupabaseAuthSessionInStorage
    >[0]

    await clearSupabaseAuthSessionInStorage(page)

    expect(addInitScript).toHaveBeenCalledTimes(1)
    const [script, args] = addInitScript.mock.calls[0]

    expect(typeof script).toBe('function')
    expect(args).toEqual([AUTH_SESSION_KEY])

    const removeItemSpy = vi.spyOn(Object.getPrototypeOf(globalThis.localStorage), 'removeItem')
    ;(script as (args: string[]) => void)(args)
    expect(removeItemSpy).toHaveBeenCalledWith(AUTH_SESSION_KEY)
    removeItemSpy.mockRestore()
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
  it('mocks heartbeat success', async () => {
    const route = vi.fn().mockResolvedValue(undefined)
    const page = {
      route
    } as unknown as Parameters<typeof setupLoginAvailable>[0]

    await setupLoginAvailable(page)

    expect(route).toHaveBeenCalledWith('**/functions/v1/heartbeat', expect.any(Function))
  })
})
