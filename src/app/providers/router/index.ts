import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@shared/api/supabase/client'

const routes = [
  {
    path: '/',
    redirect: { name: 'datasource' }
  },
  {
    path: '/datasource',
    name: 'datasource',
    component: () => import('@pages/data-source')
  },
  {
    path: '/emailverification',
    name: 'emailverification',
    meta: { guestOnly: true },
    component: () => import('@pages/email-verification')
  },
  {
    path: '/login',
    name: 'login',
    meta: { guestOnly: true },
    component: () => import('@pages/login')
  },
  {
    path: '/passwordreset',
    name: 'passwordreset',
    meta: { guestOnly: true },
    component: () => import('@pages/password-reset')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: { requiresAuth: true },
    component: () => import('@pages/dashboard')
  },
  {
    path: '/account',
    name: 'account',
    meta: { requiresAuth: true },
    component: () => import('@pages/account')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@pages/settings')
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
