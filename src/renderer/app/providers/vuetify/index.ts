import { createVuetify } from 'vuetify'
import { directives } from 'vuetify/dist/vuetify.js'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { getInitialTheme } from '@features/settings'

import { vuetifyDefaults } from './defaults'

import '@fontsource/roboto/100.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/roboto/900.css'
import 'vuetify/styles/main.css'

/** Root Vuetify instance with theme and MDI icon configuration. */
export const vuetify = createVuetify({
  defaults: vuetifyDefaults,
  directives,
  theme: {
    defaultTheme: getInitialTheme()
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  }
})
