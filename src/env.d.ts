declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** Route is only for signed-out users (e.g. login); signed-in users are redirected. */
    guestOnly?: boolean
    /** Route requires a Supabase session. */
    requiresAuth?: boolean
  }
}
