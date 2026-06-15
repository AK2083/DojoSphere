import { createRouter, createWebHashHistory } from 'vue-router'
import { ensureLocalSessionFromOsUsername } from '@features/authentication/service/ensure-local-session'
import { getCurrentSession } from '@features/authentication/service/get-current-session'
import { getIsOtpActiveFromStorage } from '@features/authentication/service/register-storage'
import { useNetworkStatusStore } from '@features/status'
import LoginPage from '@pages/login'
import PasswordResetPage from '@pages/password-reset'
import SettingsPage from '@pages/settings'
import { getActiveStore, getNavigatorOnline } from '@shared/lib'

import { monitorInformation, MONITORING_EVENTS } from './monitoring'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    meta: { requiresAuth: true },
    component: () => import('@pages/dashboard')
  },
  {
    path: '/dashboard',
    redirect: { name: 'dashboard' }
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
    path: '/register',
    name: 'register',
    meta: { guestOnly: true },
    component: () => import('@pages/register')
  },
  {
    path: '/passwordreset',
    name: 'passwordreset',
    meta: { guestOnly: true },
    component: PasswordResetPage
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
    let session = await getCurrentSessionWithTimeout()

    if (!session) {
      await ensureLocalSessionFromOsUsername()
      session = await getCurrentSessionWithTimeout()
    }

    if (session) {
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
    const isPendingEmailVerification =
      to.name === 'emailverification' && getIsOtpActiveFromStorage()

    if (session && !isPendingEmailVerification) {
      return { name: 'dashboard' }
    }
  }
})

export default router
