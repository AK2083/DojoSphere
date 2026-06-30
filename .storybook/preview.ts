import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3-vite'
import { createMemoryHistory, createRouter } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

import { i18n } from '../src/renderer/app/providers/i18n'
import { pinia } from '../src/renderer/app/providers/pinia'
import { vuetifyDefaults } from '../src/renderer/app/providers/vuetify/defaults'
import { useCloudStatusStore, useNetworkStatusStore } from '../src/renderer/features/status'

import '@fontsource/roboto/100.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/roboto/900.css'
import 'vuetify/styles/main.css'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', name: 'dashboard', component: { template: '<div />' } },
    { path: '/account', name: 'account', component: { template: '<div />' } },
    { path: '/settings', name: 'settings', component: { template: '<div />' } },
    { path: '/login', name: 'login', component: { template: '<div />' } },
    { path: '/register', name: 'register', component: { template: '<div />' } },
    {
      path: '/emailverification',
      name: 'emailverification',
      component: { template: '<div />' }
    }
  ]
})

void router.push({ name: 'dashboard' })

const vuetify = createVuetify({
  components,
  defaults: vuetifyDefaults,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  }
})

setup((app) => {
  app.use(i18n)
  app.use(router)
  app.use(vuetify)
  app.use(pinia)

  // Ensure network stores are initialized in Storybook environment.
  useNetworkStatusStore(pinia).setOnline(true)
  useCloudStatusStore(pinia).setCloudUsed(false)
})

const preview: Preview = {
  decorators: [
    (story, context) => {
      const isCentered =
        context.parameters.layout === 'centered' ||
        context.title.startsWith('Features/') ||
        context.title.startsWith('Shared/') ||
        context.title.startsWith('Pages/')
      const wrapperStyle = isCentered
        ? 'width: 100%; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: rgb(var(--v-theme-background));'
        : 'width: 100%; min-height: 100vh; background: rgb(var(--v-theme-background));'
      const contentStyle = isCentered
        ? 'display: block; width: min(100%, 900px);'
        : 'display: block; width: 100%;'

      return {
        components: { story },
        template: `
          <v-app>
            <v-layout style="width: 100%; min-height: 100vh;">
              <div style="${wrapperStyle}">
                <div style="${contentStyle}">
                  <story />
                </div>
              </div>
            </v-layout>
          </v-app>
        `
      }
    }
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: false
          },
          {
            id: 'aria-valid-attr-value',
            enabled: false
          },
          {
            id: 'aria-tooltip-name',
            enabled: false
          }
        ]
      }
    }
  }
}

export default preview
