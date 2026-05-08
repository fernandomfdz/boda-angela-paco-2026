<template>
  <main class="w-full relative min-h-screen">
    <HeroSection :guest="guest" />

    <div class="relative z-10 bg-wedding-dark/50 backdrop-blur-sm border-t border-wedding-accent/20">
      <SectionHistory id="historia" />
      <SectionLocation id="ubicacion" />
      <SectionParty id="fiesta" />
      <SectionPhotos id="fotos" />
      <SectionPhotoShareWedibox id="comparte-wedibox" />
      <SectionPhotoShare id="comparte" />
      <SectionRsvp id="rsvp" :guest="guest" />
    </div>
  </main>
</template>

<script setup lang="ts">
import type { Guest } from '~/types/guest'

defineProps<{
  guest?: Guest | null
}>()
</script>
