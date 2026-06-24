import { createApp } from 'vue'
import { initLoggingProvider, registerGlobalErrorHandlers } from '@shared/lib'
import {
  installPlaywrightBrowserElectronApi,
  isPlaywrightBrowserOnly
} from '@shared/lib/electron/e2e-api'

import App from './App.vue'
import { i18n } from './providers/i18n'
import { pinia } from './providers/pinia'
import router from './providers/router'
import { bindActivityLoggingToRouter } from './providers/router/activity-logging'
import { vuetify } from './providers/vuetify'

if (isPlaywrightBrowserOnly()) {
  installPlaywrightBrowserElectronApi()
}

const app = createApp(App)
bindActivityLoggingToRouter(router)
initLoggingProvider(router, import.meta.env.MODE)
registerGlobalErrorHandlers(app)

app.use(i18n).use(router).use(vuetify).use(pinia).mount('#app')
