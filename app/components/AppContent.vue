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

      <!-- History toggle (A vs B) -->
      <div id="historia" class="flex justify-center pt-16 md:pt-24">
        <div class="inline-flex items-center gap-1 glass-dark rounded-full p-1 text-xs uppercase tracking-widest">
          <button
            type="button"
            class="px-5 py-2 rounded-full transition cursor-pointer"
            :class="historyVariant === 'A'
              ? 'bg-wedding-accent text-wedding-dark'
              : 'opacity-70 hover:opacity-100'"
            @click="historyVariant = 'A'"
          >
            Versión A
          </button>
          <button
            type="button"
            class="px-5 py-2 rounded-full transition cursor-pointer"
            :class="historyVariant === 'B'
              ? 'bg-wedding-accent text-wedding-dark'
              : 'opacity-70 hover:opacity-100'"
            @click="historyVariant = 'B'"
          >
            Versión B
          </button>
        </div>
      </div>

      <SectionHistoryA v-if="historyVariant === 'A'" />
      <SectionHistoryB v-else />

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

const historyVariant = ref<'A' | 'B'>('B')
</script>
