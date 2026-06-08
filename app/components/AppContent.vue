<template>
  <main class="w-full relative min-h-screen">
    <HeroSection class="h-[670px] md:h-full" :guest="guest" />

    <div class="relative z-10 bg-wedding-dark/50 backdrop-blur-sm border-t border-wedding-accent/20">
      <SectionGreeting :guest="guest" />
      <SectionLocation id="ubicacion" />
      <SectionParty id="fiesta" />
      <SectionPhotoShareDots id="compartir-fotos" />
      <SectionRsvp id="rsvp" :guest="guest" />
      <SectionGifts id="regalos" />
      <SectionHistoryB id="historia" />
      <AppFooter />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Guest } from '~/types/guest'

defineProps<{
  guest?: Guest | null
}>()
</script>
