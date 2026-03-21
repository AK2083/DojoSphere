import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/home',
    name: 'home',
    component: () => import('@pages/SaveLocation.vue')
  },
  {
    path: '/confirm',
    name: 'emailConfirmation',
    component: () => import('@pages/EMailConfirmation.vue')
  },
  {
    path: '/',
    name: 'login',
    component: () => import('@pages/Login.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@pages/Settings.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
