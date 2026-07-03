/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly NEXT_PUBLIC_SUPABASE_URL: string;
  readonly NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
