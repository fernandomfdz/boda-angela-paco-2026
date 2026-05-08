<template>
  <div class="relative min-h-screen font-sans bg-wedding-dark text-wedding-light overflow-x-hidden">
    <ThemeToggle />
    <EnvelopeReopenButton />
    <ClientOnly>
      <EnvelopeSplash v-if="envelope.isOpen.value" :guest="guest" @dismiss="envelope.dismiss" />
    </ClientOnly>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const envelope = useEnvelope()
const { guest } = useGuest()

onMounted(() => {
  envelope.checkSession()
})

useHead({
  title: 'Ángela & Paco - ¡Nos casamos!',
  meta: [
    { name: 'description', content: 'Ángela & Paco - ¡Nos casamos!' },
    { hid: 'og-description', property: 'og:description', content: 'Ángela & Paco - ¡Nos casamos!' },
    { hid: 'twitter-card', property: 'twitter:card', content: '/opengraph-image.png' },
    { hid: 'og-title', property: 'og:title', content: 'Ángela & Paco - ¡Nos casamos!' },
    { hid: 'og-type', property: 'og:type', content: 'website' },
    { hid: 'og-image', property: 'og:image', content: 'https://boda.pacosarabia.com/opengraph-image.jpg' },
  ],
})

useSeoMeta({
  ogImage: 'https://boda.pacosarabia.com/opengraph-image.jpg',
  ogUrl: 'https://boda.pacosarabia.com',
  ogSiteName: 'Ángela & Paco - ¡Nos casamos!',
  ogType: 'website',
  ogImageType: 'image/jpeg',
  ogImageWidth: '1200',
  ogImageHeight: '600',
  ogLocale: 'es_ES',
  twitterCreator: '@fernandomfdz',
  twitterTitle: 'Ángela & Paco - ¡Nos casamos!',
  twitterImage: 'https://boda.pacosarabia.com/opengraph-image.jpg',
  twitterDescription: 'Ángela & Paco - ¡Nos casamos!',
  twitterCard: 'summary_large_image',
})
</script>
