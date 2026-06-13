import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'

function getSafeRedirectPath(redirect: unknown) {
  if (typeof redirect !== 'string') {
    return null
  }

  if (!redirect.startsWith('/') || redirect.startsWith('//')) {
    return null
  }

  return redirect
}

/**
 * Navigates to the dashboard or a safe redirect target from the current route query.
 *
 * @param router - Vue Router instance used for navigation.
 * @param route - Optional route containing a `redirect` query parameter.
 */
export async function navigateToDashboard(
  router: Router,
  route?: Pick<RouteLocationNormalizedLoaded, 'query'>
) {
  const redirect = getSafeRedirectPath(route?.query.redirect)

  if (redirect) {
    await router.push(redirect)
    return
  }

  await router.push({ name: 'dashboard' })
}
