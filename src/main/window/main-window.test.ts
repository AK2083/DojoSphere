import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DEV_SERVER_URL } from '../../../config/dev'
import {
  app,
  BrowserWindowConstructor,
  createBrowserWindowMock,
  Menu,
  shell
} from '../test/electron-mock'

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

  it('opens http(s) links externally and denies in-app windows', async () => {
    vi.doMock('./load-renderer', () => ({
      loadRenderer: vi.fn().mockResolvedValue(undefined)
    }))

    const { createWindow } = await import('./main-window')
    createWindow(DEV_SERVER_URL)

    const win = getBrowserWindowMock()
    const openHandler = win.webContents.setWindowOpenHandler.mock.calls[0]?.[0] as
      ((details: { url: string }) => { action: 'allow' | 'deny' }) | undefined

    expect(openHandler).toEqual(expect.any(Function))
    expect(openHandler?.({ url: 'https://www.example.com' })).toEqual({ action: 'deny' })
    expect(shell.openExternal).toHaveBeenCalledWith('https://www.example.com')

    shell.openExternal.mockClear()
    expect(openHandler?.({ url: 'http://www.example.com' })).toEqual({ action: 'deny' })
    expect(shell.openExternal).toHaveBeenCalledWith('http://www.example.com')

    shell.openExternal.mockClear()
    expect(openHandler?.({ url: 'file:///tmp/secret' })).toEqual({ action: 'deny' })
    expect(shell.openExternal).not.toHaveBeenCalled()

    shell.openExternal.mockClear()
    expect(openHandler?.({ url: 'not a url' })).toEqual({ action: 'deny' })
    expect(shell.openExternal).not.toHaveBeenCalled()
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

  it('opens http(s) and mailto urls externally and denies in-app navigation', async () => {
    vi.doMock('./load-renderer', () => ({
      loadRenderer: vi.fn().mockResolvedValue(undefined)
    }))
    const openExternalUrlMock = vi.fn().mockReturnValue(true)
    vi.doMock('./open-external-url', () => ({
      openExternalUrl: openExternalUrlMock
    }))

    const { createWindow } = await import('./main-window')
    createWindow(DEV_SERVER_URL)

    const win = getBrowserWindowMock()
    expect(win.webContents.setWindowOpenHandler).toHaveBeenCalledOnce()

    const openHandler = win.webContents.setWindowOpenHandler.mock.calls[0]?.[0] as (details: {
      url: string
    }) => { action: string }

    expect(openHandler({ url: 'https://example.com' })).toEqual({ action: 'deny' })
    expect(openExternalUrlMock).toHaveBeenCalledWith('https://example.com')

    openExternalUrlMock.mockClear()
    expect(openHandler({ url: 'mailto:info@example.com' })).toEqual({ action: 'deny' })
    expect(openExternalUrlMock).toHaveBeenCalledWith('mailto:info@example.com')

    openExternalUrlMock.mockClear()
    openExternalUrlMock.mockReturnValue(false)
    expect(openHandler({ url: 'file:///etc/passwd' })).toEqual({ action: 'deny' })
    expect(openExternalUrlMock).toHaveBeenCalledWith('file:///etc/passwd')

    const willNavigateHandler = win.webContents.on.mock.calls.find(
      ([event]) => event === 'will-navigate'
    )?.[1] as ((event: { preventDefault: () => void }, url: string) => void) | undefined

    expect(willNavigateHandler).toEqual(expect.any(Function))

    const preventDefault = vi.fn()
    openExternalUrlMock.mockClear()
    openExternalUrlMock.mockReturnValue(true)
    willNavigateHandler?.({ preventDefault }, 'mailto:board@example.com')
    expect(preventDefault).toHaveBeenCalled()
    expect(openExternalUrlMock).toHaveBeenCalledWith('mailto:board@example.com')

    preventDefault.mockClear()
    openExternalUrlMock.mockClear()
    willNavigateHandler?.({ preventDefault }, `${DEV_SERVER_URL}/#/associations`)
    expect(preventDefault).not.toHaveBeenCalled()
    expect(openExternalUrlMock).not.toHaveBeenCalled()
  })
})
