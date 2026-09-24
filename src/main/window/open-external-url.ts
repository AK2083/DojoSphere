import { spawn } from 'node:child_process'

import { shell } from 'electron'

const SAFE_HTTP_URL = /^https?:\/\//i
const SAFE_MAILTO_URL = /^mailto:[^\s"'<>\\]+$/i

/**
 * Opens a mailto: URL with the OS default mail client.
 *
 * On Windows, `shell.openExternal` often shows the protocol "Open with" picker
 * (browser / Thunderbird / …). `cmd /c start` uses the registered mailto
 * association instead (e.g. Outlook when set as default).
 *
 * @param url - Sanitized mailto URL.
 */
function openMailto(url: string): void {
  if (process.platform === 'win32') {
    const child = spawn('cmd.exe', ['/c', 'start', '', url], {
      detached: true,
      stdio: 'ignore',
      windowsHide: true
    })
    child.unref()
    return
  }

  void shell.openExternal(url)
}

/**
 * Opens http(s) or mailto URLs with the OS default handler.
 *
 * @param url - Absolute URL from a renderer navigation or window.open.
 * @returns `true` when the URL was accepted and handed off externally.
 */
export function openExternalUrl(url: string): boolean {
  if (SAFE_MAILTO_URL.test(url)) {
    openMailto(url)
    return true
  }

  if (SAFE_HTTP_URL.test(url)) {
    void shell.openExternal(url)
    return true
  }

  return false
}
