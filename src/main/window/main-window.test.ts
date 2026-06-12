import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DEV_SERVER_URL } from '../../../config/dev'
import { app, BrowserWindowConstructor, createBrowserWindowMock, Menu } from '../test/electron-mock'

function getBrowserWindowMock() {
  const win = createBrowserWindowMock()

  if (!win) {
    throw new Error('BrowserWindow mock was not created.')
  }

  return win
}

describe('createWindow', () => {
  beforeEach(() => {
    app.isPackaged = false
    vi.resetModules()
  })

  it('creates a window without menu and loads the renderer', async () => {
    const loadRendererMock = vi.fn().mockResolvedValue(undefined)
    vi.doMock('./load-renderer', () => ({
      loadRenderer: loadRendererMock
    }))

    const { createWindow } = await import('./main-window')

    createWindow(DEV_SERVER_URL)

    expect(Menu.setApplicationMenu).toHaveBeenCalledWith(null)
    expect(BrowserWindowConstructor).toHaveBeenCalledWith(
      expect.objectContaining({
        width: 1200,
        height: 800,
        webPreferences: expect.objectContaining({
          devTools: true
        })
      })
    )
    expect(loadRendererMock).toHaveBeenCalledWith(getBrowserWindowMock(), DEV_SERVER_URL)
  })

  it('blocks devtools shortcut when packaged', async () => {
    app.isPackaged = true
    vi.doMock('./load-renderer', () => ({
      loadRenderer: vi.fn().mockResolvedValue(undefined)
    }))

    const { createWindow } = await import('./main-window')
    createWindow(DEV_SERVER_URL)

    const win = getBrowserWindowMock()
    const beforeInputHandler = win.webContents.on.mock.calls.find(
      ([event]) => event === 'before-input-event'
    )?.[1]

    expect(beforeInputHandler).toEqual(expect.any(Function))

    const preventDefault = vi.fn()
    beforeInputHandler?.(
      { preventDefault },
      {
        control: true,
        meta: false,
        shift: true,
        key: 'I'
      }
    )

    expect(preventDefault).toHaveBeenCalled()
  })

  it('blocks devtools shortcut with meta key when packaged', async () => {
    app.isPackaged = true
    vi.doMock('./load-renderer', () => ({
      loadRenderer: vi.fn().mockResolvedValue(undefined)
    }))

    const { createWindow } = await import('./main-window')
    createWindow(DEV_SERVER_URL)

    const win = getBrowserWindowMock()
    const beforeInputHandler = win.webContents.on.mock.calls.find(
      ([event]) => event === 'before-input-event'
    )?.[1]
    const preventDefault = vi.fn()

    beforeInputHandler?.(
      { preventDefault },
      {
        control: false,
        meta: true,
        shift: true,
        key: 'i'
      }
    )

    expect(preventDefault).toHaveBeenCalled()
  })

  it('does not block devtools shortcut in development', async () => {
    app.isPackaged = false
    vi.doMock('./load-renderer', () => ({
      loadRenderer: vi.fn().mockResolvedValue(undefined)
    }))

    const { createWindow } = await import('./main-window')
    createWindow(DEV_SERVER_URL)

    const win = getBrowserWindowMock()
    const beforeInputHandler = win.webContents.on.mock.calls.find(
      ([event]) => event === 'before-input-event'
    )?.[1]
    const preventDefault = vi.fn()

    beforeInputHandler?.(
      { preventDefault },
      {
        control: true,
        meta: false,
        shift: true,
        key: 'I'
      }
    )

    expect(preventDefault).not.toHaveBeenCalled()
  })

  it('does not block unrelated shortcuts when packaged', async () => {
    app.isPackaged = true
    vi.doMock('./load-renderer', () => ({
      loadRenderer: vi.fn().mockResolvedValue(undefined)
    }))

    const { createWindow } = await import('./main-window')
    createWindow(DEV_SERVER_URL)

    const win = getBrowserWindowMock()
    const beforeInputHandler = win.webContents.on.mock.calls.find(
      ([event]) => event === 'before-input-event'
    )?.[1]
    const preventDefault = vi.fn()

    beforeInputHandler?.(
      { preventDefault },
      {
        control: true,
        meta: false,
        shift: true,
        key: 'J'
      }
    )

    expect(preventDefault).not.toHaveBeenCalled()
  })
})
