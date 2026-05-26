import { createRouter, createWebHashHistory } from 'vue-router'
import { getCurrentSession } from '@features/authentication/service/get-current-session'

import { monitorInformation, MONITORING_EVENTS } from './monitoring'

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
  history: createWebHashHistory(),
  routes
})

router.afterEach((to, from) => {
  monitorInformation(MONITORING_EVENTS.ROUTE_CHANGED, {
    from: from.name,
    to: to.name
  })
})

router.beforeEach(async (to) => {
  const requiresSessionCheck = Boolean(to.meta.requiresAuth || to.meta.guestOnly)
  const session = requiresSessionCheck ? await getCurrentSession() : null

  if (to.meta.requiresAuth && !session) {
    return {
      name: 'login',
      query: { redirect: to.fullPath }
    }
  }

  if (to.meta.guestOnly && session) {
    return { name: 'dashboard' }
  }
})

export default router
