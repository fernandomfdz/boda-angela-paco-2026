import tailwindcss from '@tailwindcss/vite'
import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'

// Escanea /public/gallery en build/dev time. En Cloudflare Pages no hay fs en runtime,
// así que la lista queda bundleada via runtimeConfig.public.
const readGallery = (): string[] => {
  try {
    return readdirSync(resolve(process.cwd(), 'public/gallery'))
      .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
      .sort()
  } catch {
    return []
  }
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ["nitro-cloudflare-dev", '@nuxt/image', '@nuxt/icon'],
  nitro: {
    preset: "cloudflare_pages",

    prerender: {
      autoSubfolderIndex: false
    },

    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    },
  },
  runtimeConfig: {
    googleScriptUrl: process.env.GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbwLmHCFhoegdnPaNYJQ5DKGiMweqB8ygwr9dScP3RUj_2g3f37lSjnPrXIofL0XnwLp/exec',
    public: {
      gallery: readGallery(),
    },
  },
  app: {
    head: {
      script: [
        {
          // Aplica el tema antes del primer paint para evitar FOUC
          innerHTML: `(function(){try{var s=localStorage.getItem('wedding_theme');var m=(s==='dark'||s==='light')?s:(window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',m);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`,
          tagPosition: 'head',
        },
      ],
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  css: ['~/main.css'],
})