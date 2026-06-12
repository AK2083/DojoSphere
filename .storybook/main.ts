import path from 'path'
import type { StorybookConfig } from '@storybook/vue3-vite'
import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vite'
import vuetify from 'vite-plugin-vuetify'

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: ['../src/renderer/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-vitest', '@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: '@storybook/vue3-vite',
  async viteFinal(baseConfig) {
    return mergeConfig(baseConfig, {
      plugins: [vuetify()],
      resolve: {
        alias: {
          '@': path.resolve(dirname, '../src/renderer'),
          '@shared': path.resolve(dirname, '../src/renderer/shared'),
          '@app': path.resolve(dirname, '../src/renderer/app'),
          '@features': path.resolve(dirname, '../src/renderer/features'),
          '@widgets': path.resolve(dirname, '../src/renderer/widgets'),
          '@pages': path.resolve(dirname, '../src/renderer/pages')
        }
      }
    })
  }
}

export default config
