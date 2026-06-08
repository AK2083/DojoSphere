import fs from 'node:fs'

import type { BrowserWindow } from 'electron'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { app } from '../test/electron-mock'
import { loadRenderer } from './load-renderer'

function createWindowMock() {
  const loadURL = vi.fn().mockResolvedValue(undefined)
  const loadFile = vi.fn().mockResolvedValue(undefined)
  const openDevTools = vi.fn()

  const win = {
    loadURL,
    loadFile,
    webContents: {
      openDevTools
    }
  } as unknown as BrowserWindow

  return { win, loadURL, loadFile, openDevTools }
}

describe('loadRenderer', () => {
  beforeEach(() => {
    app.isPackaged = false
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loads the production build when the app is packaged', async () => {
    app.isPackaged = true
    const { win, loadFile, loadURL } = createWindowMock()

    await loadRenderer(win, 'http://localhost:5173')

    expect(loadFile).toHaveBeenCalledWith(expect.stringMatching(/dist[\\/]index\.html$/))
    expect(loadURL).not.toHaveBeenCalled()
  })

  it('loads the dev server and opens devtools in development', async () => {
    const { win, loadURL, openDevTools } = createWindowMock()

    await loadRenderer(win, 'http://localhost:5173')

    expect(loadURL).toHaveBeenCalledWith('http://localhost:5173')
    expect(openDevTools).toHaveBeenCalled()
  })

  it('shows a fallback error page when dev server and build are unavailable', async () => {
    const { win, loadURL } = createWindowMock()
    loadURL.mockRejectedValueOnce(new Error('connection refused'))
    vi.spyOn(fs, 'existsSync').mockReturnValue(false)

    await loadRenderer(win, 'http://localhost:5173')

    const fallbackUrl = loadURL.mock.calls[1]?.[0] as string

    expect(loadURL).toHaveBeenCalledTimes(2)
    expect(fallbackUrl).toContain('data:text/html')
    expect(decodeURIComponent(fallbackUrl)).toContain('DojoSphere konnte nicht geladen werden')
  })

  it('loads the production build when the dev server is unavailable', async () => {
    const { win, loadURL, loadFile } = createWindowMock()
    loadURL.mockRejectedValueOnce(new Error('connection refused'))
    vi.spyOn(fs, 'existsSync').mockReturnValue(true)

    await loadRenderer(win, 'http://localhost:5173')

    expect(loadFile).toHaveBeenCalledWith(expect.stringMatching(/dist[\\/]index\.html$/))
    expect(loadURL).toHaveBeenCalledTimes(1)
  })
})
