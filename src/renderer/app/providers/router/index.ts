import { createRouter, createWebHashHistory } from 'vue-router'
import { ensureLocalSessionFromOsUsername } from '@features/authentication/service/ensure-local-session'
import { getCurrentSession } from '@features/authentication/service/get-current-session'
import { hasUserPermission } from '@features/authentication/service/has-user-permission'
import { isLocalAuthSession } from '@features/authentication/service/is-local-auth-session'
import { getIsOtpActiveFromStorage } from '@features/authentication/service/register-storage'
import { useNetworkStatusStore } from '@features/status'
import AccountPage from '@pages/account'
import AssociationFormPage from '@pages/association-form'
import AssociationsPage from '@pages/associations'
import DashboardPage from '@pages/dashboard'
import EmailVerificationPage from '@pages/email-verification'
import LoginPage from '@pages/login'
import ParticipantFormPage from '@pages/participant-form'
import ParticipantImportPage from '@pages/participant-import'
import ParticipantsPage from '@pages/participants'
import PasswordResetPage from '@pages/password-reset'
import RegisterPage from '@pages/register'
import SettingsPage from '@pages/settings'
import { ASSOCIATIONS_OVERVIEW_PERMISSION } from '@shared/constants/associations-overview-permission'
import { PARTICIPANTS_OVERVIEW_PERMISSION } from '@shared/constants/participants-overview-permission'
import { getActiveStore, getNavigatorOnline } from '@shared/lib'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    meta: { requiresAuth: true },
    component: DashboardPage
  },
  {
    path: '/dashboard',
    redirect: { name: 'dashboard' }
  },
  {
    path: '/emailverification',
    name: 'emailverification',
    meta: { guestOnly: true },
    component: EmailVerificationPage
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
    component: RegisterPage
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
    component: AccountPage
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsPage
  },
  {
    path: '/participants',
    name: 'participants',
    meta: {
      requiresAuth: true,
      requiredPermission: {
        resource: PARTICIPANTS_OVERVIEW_PERMISSION.resource,
        action: PARTICIPANTS_OVERVIEW_PERMISSION.actions.read
      }
    },
    component: ParticipantsPage
  },
  {
    path: '/participants/import',
    name: 'participant-import',
    meta: {
      requiresAuth: true,
      requiredPermission: {
        resource: PARTICIPANTS_OVERVIEW_PERMISSION.resource,
        action: PARTICIPANTS_OVERVIEW_PERMISSION.actions.create
      }
    },
    component: ParticipantImportPage
  },
  {
    path: '/participants/new',
    name: 'participant-create',
    meta: {
      requiresAuth: true,
      requiredPermission: {
        resource: PARTICIPANTS_OVERVIEW_PERMISSION.resource,
        action: PARTICIPANTS_OVERVIEW_PERMISSION.actions.create
      }
    },
    component: ParticipantFormPage
  },
  {
    path: '/participants/:id/edit',
    name: 'participant-edit',
    meta: {
      requiresAuth: true,
      requiredPermission: {
        resource: PARTICIPANTS_OVERVIEW_PERMISSION.resource,
        action: PARTICIPANTS_OVERVIEW_PERMISSION.actions.update
      }
    },
    component: ParticipantFormPage
  },
  {
    path: '/associations',
    name: 'associations',
    meta: {
      requiresAuth: true,
      requiredPermission: {
        resource: ASSOCIATIONS_OVERVIEW_PERMISSION.resource,
        action: ASSOCIATIONS_OVERVIEW_PERMISSION.actions.read
      }
    },
    component: AssociationsPage
  },
  {
    path: '/associations/new',
    name: 'association-create',
    meta: {
      requiresAuth: true,
      requiredPermission: {
        resource: ASSOCIATIONS_OVERVIEW_PERMISSION.resource,
        action: ASSOCIATIONS_OVERVIEW_PERMISSION.actions.create
      }
    },
    component: AssociationFormPage
  },
  {
    path: '/associations/:id/edit',
    name: 'association-edit',
    meta: {
      requiresAuth: true,
      requiredPermission: {
        resource: ASSOCIATIONS_OVERVIEW_PERMISSION.resource,
        action: ASSOCIATIONS_OVERVIEW_PERMISSION.actions.update
      }
    },
    component: AssociationFormPage
  }
]

/** Application router with authentication and offline navigation guards. */
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

async function isRequiredPermissionGranted(
  requiredPermission: { resource: string; action: string } | undefined
): Promise<boolean> {
  if (!requiredPermission) {
    return true
  }

  return hasUserPermission(requiredPermission.resource, requiredPermission.action)
}

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
      const allowed = await isRequiredPermissionGranted(to.meta.requiredPermission)

      if (!allowed) {
        return { name: 'dashboard' }
      }

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

    if (session && !isPendingEmailVerification && !isLocalAuthSession(session)) {
      return { name: 'dashboard' }
    }
  }
})

export default router
