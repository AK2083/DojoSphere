import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@shared/api/supabase/client'

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
    meta: { guestOnly: true },
    component: () => import('@pages/Login.vue')
  },
  {
    path: '/welcome',
    name: 'welcome',
    meta: { requiresAuth: true },
    component: () => import('@pages/Welcome.vue')
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

router.beforeEach(async (to) => {
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (to.meta.requiresAuth && !session) {
    return {
      name: 'login',
      query: { redirect: to.fullPath }
    }
  }

  if (to.meta.guestOnly && session) {
    return { name: 'welcome' }
  }
})

export default router
