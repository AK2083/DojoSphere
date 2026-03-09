import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { Vuetify3Resolver } from 'unplugin-vue-components/resolvers'
import path from 'path'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'src/app/config/autoimport/auto-imports.d.ts',
      eslintrc: {
        enabled: true
      }
    }),
    Components({
      dirs: ['src/app/ui', 'src/widgets', 'src/features'],
      extensions: ['vue'],
      deep: true,
      dts: 'src/app/config/autoimport/ui.d.ts',
      resolvers: [Vuetify3Resolver()]
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@widgets': path.resolve(__dirname, 'src/widgets'),
      '@pages': path.resolve(__dirname, 'src/pages')
    }
  },
  build: {
    sourcemap: true
  }
})
