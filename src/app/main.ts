import { createApp } from 'vue'
import App from '@app/components/App.vue'

import 'vuetify/styles/main.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

import '@fontsource/roboto/100.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/roboto/900.css'

import { getInitialTheme } from '@app/model/theme-service'
import router from '@app/provider/router'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: getInitialTheme()
  }
})

createApp(App)
.use(router)
.use(vuetify)
.mount('#app')
