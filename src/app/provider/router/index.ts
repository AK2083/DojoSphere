import SaveLocation from '@features/authentication/page/SaveLocation.vue'
import Settings from '@features/settings/page/Settings.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: SaveLocation
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
