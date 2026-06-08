import { describe, expect, it } from 'vitest'

import { ipcMain } from '../test/electron-mock'
import { registerIpcHandlers } from './register'

describe('registerIpcHandlers', () => {
  it('registers all ipc channels', () => {
    registerIpcHandlers()

    expect(ipcMain.handle).toHaveBeenCalledWith('db:healthcheck', expect.any(Function))
    expect(ipcMain.handle).toHaveBeenCalledWith('users:list', expect.any(Function))
    expect(ipcMain.handle).toHaveBeenCalledWith('users:add', expect.any(Function))
  })
})
