<template>
  <ClientOnly>
    <div class="fixed bottom-4 left-4 z-40 flex flex-col md:flex-row-reverse items-center gap-3">
            <!-- Ondas de sonido discretas -->
      <div 
        class="flex items-end gap-[2px] h-4 opacity-0 transition-opacity duration-300"
        :class="{ 'opacity-80': music.isPlaying.value }"
      >
        <span class="w-[2px] bg-wedding-accent rounded-full animate-wave-1" :style="{ animationPlayState: music.isPlaying.value ? 'running' : 'paused' }"></span>
        <span class="w-[2px] bg-wedding-accent rounded-full animate-wave-2" :style="{ animationPlayState: music.isPlaying.value ? 'running' : 'paused' }"></span>
        <span class="w-[2px] bg-wedding-accent rounded-full animate-wave-3" :style="{ animationPlayState: music.isPlaying.value ? 'running' : 'paused' }"></span>
        <span class="w-[2px] bg-wedding-accent rounded-full animate-wave-4" :style="{ animationPlayState: music.isPlaying.value ? 'running' : 'paused' }"></span>
      </div>
      <button
        type="button"
        :aria-label="music.isPlaying.value ? 'Pausar música' : 'Reproducir música'"
        :title="music.isPlaying.value ? 'Pausar música' : 'Reproducir música'"
        class="w-11 h-11 rounded-full flex items-center justify-center glass-dark hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer"
        @click="music.toggle"
      >
        <Icon
          v-if="music.isPlaying.value"
          name="lucide:volume-2"
          class="w-5 h-5 text-wedding-accent"
        />
        <Icon
          v-else-if="music.hasEnded.value"
          name="lucide:rotate-ccw"
          class="w-5 h-5 text-wedding-accent"
        />
        <Icon
          v-else
          name="lucide:volume-x"
          class="w-5 h-5 text-wedding-accent"
        />
      </button>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useBackgroundMusic } from '~/composables/useBackgroundMusic'

const music = useBackgroundMusic()
</script>

<style scoped>
.animate-wave-1 {
  animation: wave 1.2s ease-in-out infinite;
}
.animate-wave-2 {
  animation: wave 1s ease-in-out infinite 0.1s;
}
.animate-wave-3 {
  animation: wave 1.3s ease-in-out infinite 0.2s;
}
.animate-wave-4 {
  animation: wave 1.1s ease-in-out infinite 0.3s;
}

@keyframes wave {
  0%, 100% { height: 4px; }
  50% { height: 16px; }
}
</style>
