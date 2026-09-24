import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { shell } from '../test/electron-mock'

const spawnMock = vi.hoisted(() =>
  vi.fn(() => ({
    unref: vi.fn()
  }))
)

vi.mock('node:child_process', () => ({
  spawn: spawnMock
}))

describe('openExternalUrl', () => {
  const originalPlatform = process.platform

  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  afterEach(() => {
    Object.defineProperty(process, 'platform', {
      configurable: true,
      value: originalPlatform
    })
  })

  it('opens http(s) urls via shell.openExternal', async () => {
    const { openExternalUrl } = await import('./open-external-url')

    expect(openExternalUrl('https://example.com/path')).toBe(true)
    expect(shell.openExternal).toHaveBeenCalledWith('https://example.com/path')
    expect(spawnMock).not.toHaveBeenCalled()
  })

  it('opens mailto via Windows start on win32', async () => {
    Object.defineProperty(process, 'platform', { configurable: true, value: 'win32' })
    const { openExternalUrl } = await import('./open-external-url')

    expect(openExternalUrl('mailto:info@example.com')).toBe(true)
    expect(spawnMock).toHaveBeenCalledWith(
      'cmd.exe',
      ['/c', 'start', '', 'mailto:info@example.com'],
      expect.objectContaining({
        detached: true,
        stdio: 'ignore',
        windowsHide: true
      })
    )
    expect(shell.openExternal).not.toHaveBeenCalled()
  })

  it('opens mailto via shell.openExternal on non-windows platforms', async () => {
    Object.defineProperty(process, 'platform', { configurable: true, value: 'darwin' })
    const { openExternalUrl } = await import('./open-external-url')

    expect(openExternalUrl('mailto:info@example.com')).toBe(true)
    expect(shell.openExternal).toHaveBeenCalledWith('mailto:info@example.com')
    expect(spawnMock).not.toHaveBeenCalled()
  })

  it('rejects unsupported urls', async () => {
    const { openExternalUrl } = await import('./open-external-url')

    expect(openExternalUrl('file:///etc/passwd')).toBe(false)
    expect(openExternalUrl('mailto:bad"url')).toBe(false)
    expect(spawnMock).not.toHaveBeenCalled()
    expect(shell.openExternal).not.toHaveBeenCalled()
  })
})
