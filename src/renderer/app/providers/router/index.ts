import { createRouter, createWebHashHistory } from 'vue-router'
import { getCurrentSession } from '@features/authentication/service/get-current-session'
import { hasLocalAccess } from '@features/authentication/service/has-local-access'
import DataSourcePage from '@pages/data-source'
import LoginPage from '@pages/login'
import PasswordResetPage from '@pages/password-reset'
import SettingsPage from '@pages/settings'
import { getActiveStore, getNavigatorOnline } from '@shared/lib'
import { useNetworkStatusStore } from '@shared/store/network'

import { monitorInformation, MONITORING_EVENTS } from './monitoring'

const routes = [
  {
    path: '/',
    redirect: { name: 'datasource' }
  },
  {
    path: '/datasource',
    name: 'datasource',
    component: DataSourcePage
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
    component: LoginPage
  },
  {
    path: '/passwordreset',
    name: 'passwordreset',
    meta: { guestOnly: true },
    component: PasswordResetPage
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
    component: SettingsPage
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const SESSION_CHECK_TIMEOUT_MS = 1200

function isOfflineModeEnabled(): boolean {
  const navigatorOffline = !getNavigatorOnline()
  const activeStore = getActiveStore()

  if (!activeStore) {
    return navigatorOffline
  }

  const storeOffline = !useNetworkStatusStore(activeStore).isOnline
  return navigatorOffline || storeOffline
}

async function getCurrentSessionWithTimeout() {
  return await Promise.race([
    getCurrentSession(),
    new Promise<null>((resolve) => {
      globalThis.setTimeout(() => resolve(null), SESSION_CHECK_TIMEOUT_MS)
    })
  ])
}

router.afterEach((to, from) => {
  monitorInformation(MONITORING_EVENTS.ROUTE_CHANGED, {
    from: from.name,
    to: to.name
  })
})

router.beforeEach(async (to) => {
  const requiresAuth = Boolean(to.meta.requiresAuth)
  const guestOnly = Boolean(to.meta.guestOnly)
  const isOffline = isOfflineModeEnabled()

  if (requiresAuth) {
    const session = await getCurrentSessionWithTimeout()

    if (session || (await hasLocalAccess())) {
      return
    }

    return {
      name: 'login',
      query: { redirect: to.fullPath }
    }
  }

  // Never block guest-route navigation in offline mode.
  if (guestOnly && isOffline) {
    return
  }

  if (guestOnly) {
    const session = await getCurrentSessionWithTimeout()

    if (session || (await hasLocalAccess())) {
      return { name: 'dashboard' }
    }
  }
})

export default router
