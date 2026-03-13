import { createVuetify } from 'vuetify'
import { directives } from 'vuetify/dist/vuetify.js'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

import { getInitialTheme } from '../../model/theme-service'

import '@fontsource/roboto/100.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/roboto/900.css'

import 'vuetify/styles'

export const vuetify = createVuetify({
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
