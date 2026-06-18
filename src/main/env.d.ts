interface ImportMetaEnv {
  readonly VITE_GLITCHTIP_DSN?: string
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
