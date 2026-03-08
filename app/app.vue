<template>
  <div class="relative min-h-screen font-sans bg-wedding-dark text-wedding-light overflow-x-hidden">
    
    <main class="w-full relative min-h-screen">
      <!-- Hero Section -->
      <HeroSection />

      <!-- Sections Backdrop (Obscures the canvas smoothly as we go down) -->
      <div class="relative z-10 bg-wedding-dark/50 backdrop-blur-sm border-t border-wedding-accent/20">
        <SectionHistory id="historia" />
        <SectionLocation id="ubicacion" />
        <SectionParty id="fiesta" />
        <SectionPhotos id="fotos" />
        <SectionRsvp id="rsvp" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  useHead({
    title: 'Ángela & Paco - ¡Nos casamos!',
    meta: [
      { name: 'description', content: 'Ángela & Paco - ¡Nos casamos!' },
      { hid: 'og-description', property: 'og:description', content: 'Ángela & Paco - ¡Nos casamos!'},
      { hid: 'twitter-card', property: 'twitter:card', content: '/opengraph-image.png' },
      { hid: 'og-title', property: 'og:title', content: 'Ángela & Paco - ¡Nos casamos!'},
      { hid: 'og-type', property: 'og:type', content: 'website' },
      { hid: 'og-image', property: 'og:image', content: 'https://boda.pacosarabia.com/opengraph-image.jpg'},
    ]
  });

  useSeoMeta({
    title: 'Ángela & Paco - ¡Nos casamos!',
    ogTitle: 'Ángela & Paco - ¡Nos casamos!',
    description: 'Ángela & Paco - ¡Nos casamos!',
    ogDescription: 'Ángela & Paco - ¡Nos casamos!',
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
