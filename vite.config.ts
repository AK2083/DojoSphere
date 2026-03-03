import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'src/app/autoimport/auto-imports.d.ts',
      eslintrc: {
        enabled: true
      }
    }),
    Components({
      dirs: ['src/app/components'],
      extensions: ['vue'],
      deep: true,
      dts: 'src/app/autoimport/components.d.ts'
    })
  ],
  build: {
    sourcemap: true
  }
})
