import tailwindcss from '@tailwindcss/vite'
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
    googleScriptUrl: process.env.GOOGLE_SCRIPT_URL || '',
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  css: ['~/main.css'],
})