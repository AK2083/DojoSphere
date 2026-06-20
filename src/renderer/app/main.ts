import { createApp } from 'vue'
import { initLoggingProvider } from '@shared/lib'
import {
  installPlaywrightBrowserElectronApi,
  isPlaywrightBrowserOnly
} from '@shared/lib/electron/e2e-api'

import App from './App.vue'
import { i18n } from './providers/i18n'
import { pinia } from './providers/pinia'
import router from './providers/router'
import { vuetify } from './providers/vuetify'

if (isPlaywrightBrowserOnly()) {
  installPlaywrightBrowserElectronApi()
}

const app = createApp(App)
initLoggingProvider(router, import.meta.env.MODE)

app.use(i18n).use(router).use(vuetify).use(pinia).mount('#app')
