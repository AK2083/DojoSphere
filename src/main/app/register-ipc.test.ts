import { describe, expect, it } from 'vitest'

import { ipcMain } from '../test/electron-mock'
import { registerIpcHandlers } from './register-ipc'

describe('registerIpcHandlers', () => {
  it('registers all ipc channels', () => {
    registerIpcHandlers()

    expect(ipcMain.handle).toHaveBeenCalledWith('db:healthcheck', expect.any(Function))
    expect(ipcMain.handle).toHaveBeenCalledWith('system:osUsername', expect.any(Function))
    expect(ipcMain.handle).toHaveBeenCalledWith('users:list', expect.any(Function))
    expect(ipcMain.handle).toHaveBeenCalledWith('users:add', expect.any(Function))
    expect(ipcMain.handle).toHaveBeenCalledWith('users:ensureLocalSession', expect.any(Function))
    expect(ipcMain.handle).toHaveBeenCalledWith('sessions:get', expect.any(Function))
    expect(ipcMain.handle).toHaveBeenCalledWith('sessions:revoke', expect.any(Function))
    expect(ipcMain.handle).toHaveBeenCalledWith('competitors:list', expect.any(Function))
    expect(ipcMain.handle).toHaveBeenCalledWith('competitors:add', expect.any(Function))
    expect(ipcMain.handle).toHaveBeenCalledWith('competitors:update', expect.any(Function))
    expect(ipcMain.handle).toHaveBeenCalledWith('competitors:delete', expect.any(Function))
    expect(ipcMain.handle).toHaveBeenCalledWith('audit:record', expect.any(Function))
  })
})
