import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import electron from 'vite-plugin-electron/simple'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  plugins: [
    vue(),
    vuetify(),
    electron({
      main: {
        entry: 'src/main/main.ts',
        onstart({ startup }) {
          startup(['.', '--no-sandbox', '--remote-debugging-port=9223', '--inspect=9229'])
        },
        vite: {
          resolve: {
            alias: {
              '@shared': path.resolve(__dirname, 'src/shared')
            }
          },
          build: {
            rollupOptions: {
              external: ['electron', 'better-sqlite3', 'node:sqlite']
            }
          }
        }
      },
      preload: {
        input: path.join(__dirname, 'src/main/preload.ts'),
        vite: {
          resolve: {
            alias: {
              '@shared': path.resolve(__dirname, 'src/shared')
            }
          }
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/renderer'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@app': path.resolve(__dirname, 'src/renderer/app'),
      '@features': path.resolve(__dirname, 'src/renderer/features'),
      '@widgets': path.resolve(__dirname, 'src/renderer/widgets'),
      '@pages': path.resolve(__dirname, 'src/renderer/pages')
    }
  },
  build: {
    sourcemap: true
  }
})
