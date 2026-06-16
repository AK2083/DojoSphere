import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import electron from 'vite-plugin-electron/simple'
import vuetify from 'vite-plugin-vuetify'

import {
  DEV_HOST,
  DEV_SERVER_PORT,
  ELECTRON_INSPECT_PORT,
  ELECTRON_REMOTE_DEBUG_PORT,
  isPlaywrightBrowserOnly
} from './config/dev'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const playwrightBrowserOnly = isPlaywrightBrowserOnly(env.VITE_PLAYWRIGHT_BROWSER_ONLY)

  return {
    server: {
      host: DEV_HOST,
      port: DEV_SERVER_PORT
    },
    plugins: [
      vue(),
      vuetify(),
      ...(playwrightBrowserOnly
        ? []
        : [
            electron({
              main: {
                entry: 'src/main/main.ts',
                onstart({ startup }) {
                  startup([
                    '.',
                    '--no-sandbox',
                    `--remote-debugging-port=${ELECTRON_REMOTE_DEBUG_PORT}`,
                    `--inspect=${ELECTRON_INSPECT_PORT}`
                  ])
                },
                vite: {
                  resolve: {
                    alias: {
                      '@main/shared': path.resolve(__dirname, 'src/main/shared'),
                      '@shared': path.resolve(__dirname, 'src/renderer/shared')
                    }
                  },
                  build: {
                    rollupOptions: {
                      external: ['electron', 'node:sqlite']
                    }
                  }
                }
              },
              preload: {
                input: path.join(__dirname, 'src/main/preload/preload.ts'),
                vite: {
                  resolve: {
                    alias: {
                      '@shared': path.resolve(__dirname, 'src/renderer/shared')
                    }
                  }
                }
              }
            })
          ])
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/renderer'),
        '@shared': path.resolve(__dirname, 'src/renderer/shared'),
        '@app': path.resolve(__dirname, 'src/renderer/app'),
        '@features': path.resolve(__dirname, 'src/renderer/features'),
        '@widgets': path.resolve(__dirname, 'src/renderer/widgets'),
        '@pages': path.resolve(__dirname, 'src/renderer/pages')
      }
    },
    build: {
      sourcemap: true
    }
  }
})
