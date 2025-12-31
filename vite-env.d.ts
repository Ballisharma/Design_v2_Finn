/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_WORDPRESS_URL: string
    readonly VITE_WC_CONSUMER_KEY: string
    readonly VITE_WC_CONSUMER_SECRET: string
    readonly VITE_WP_API_URL: string
    readonly VITE_JWT_SECRET?: string
    readonly VITE_WEBHOOK_SECRET?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
