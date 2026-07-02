/// <reference types="vite/client" />
import 'vue-router'

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string
  readonly VITE_PLAYWRIGHT_BROWSER_ONLY?: string
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}

declare module 'vue-router' {
  interface RouteMeta {
    activityLogging?: boolean
    guestOnly?: boolean
    requiredPermission?: {
      resource: string
      action: string
    }
    requiresAuth?: boolean
  }
}

import type { ElectronAPI } from '@shared/types/electron-api'

declare global {
  interface Window {
    api: ElectronAPI
  }
}
