import { createApp } from 'vue'
import { initLoggingProvider } from '@shared/lib'

import App from './App.vue'
import { i18n } from './providers/i18n'
import { pinia } from './providers/pinia'
import router from './providers/router'
import { vuetify } from './providers/vuetify'

const app = createApp(App)
initLoggingProvider(app, router, import.meta.env.VITE_GLITCHTIP_DSN, import.meta.env.MODE)

app.use(i18n).use(router).use(vuetify).use(pinia).mount('#app')
