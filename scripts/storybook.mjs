import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const { storybookPort } = JSON.parse(readFileSync(path.join(rootDir, 'config/dev.json'), 'utf8'))

const result = spawnSync('storybook', ['dev', '--ci', '-p', String(storybookPort)], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true
})

process.exit(result.status ?? 1)
