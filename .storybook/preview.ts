import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3-vite'
import { createMemoryHistory, createRouter } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

import { i18n } from '../src/app/providers/i18n'

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
    { path: '/datasource', name: 'datasource', component: { template: '<div />' } },
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
})

const preview: Preview = {
  decorators: [
    (story) => ({
      components: { story },
      template: `
        <v-app>
          <v-layout style="min-height: 520px;">
            <div style="width: 100%;">
              <story />
            </div>
          </v-layout>
        </v-app>
      `
    })
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
      test: 'todo'
    }
  }
}

export default preview
