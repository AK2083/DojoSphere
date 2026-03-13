import { createApp } from 'vue'

import App from './App.vue'
import { i18n } from './providers/i18n'
import router from './providers/router'
import { vuetify } from './providers/vuetify'

createApp(App).use(i18n).use(router).use(vuetify).mount('#app')
