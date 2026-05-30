/// <reference types="vite/client" />
import 'vue-router'

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}

declare module 'vue-router' {
  interface RouteMeta {
    guestOnly?: boolean
    requiresAuth?: boolean
  }
}

export interface IElectronAPI {
  getUsers: () => Promise<any[]>
  addUser: (user: { name: string; data: any }) => Promise<any>
  dbHealthcheck: () => Promise<{ ok: boolean; version: string }>
}

declare global {
  interface Window {
    api: IElectronAPI
  }
}
