import os from 'node:os'
import { describe, expect, it } from 'vitest'

import { getIpcHandler } from '../../../test/electron-mock'

describe('registerSystemIpc', () => {
  it('returns the operating system username', async () => {
    const { registerSystemIpc } = await import('./register')

    registerSystemIpc()

    const handler = getIpcHandler('system:osUsername')

    expect(await handler()).toBe(os.userInfo().username)
  })
})
