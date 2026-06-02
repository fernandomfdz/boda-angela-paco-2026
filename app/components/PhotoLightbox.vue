<template>
  <Teleport to="body">
    <Transition name="lightbox-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      :aria-label="`Foto ${currentIndex + 1} de ${photos.length}`"
      @click.self="close"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
    >
      <!-- Close button -->
      <button
        type="button"
        class="absolute top-4 right-4 md:top-6 md:right-6 w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
        aria-label="Cerrar"
        @click="close"
      >
        <Icon name="lucide:x" class="w-6 h-6" />
      </button>

      <!-- Prev button -->
      <button
        v-if="photos.length > 1"
        type="button"
        class="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
        aria-label="Foto anterior"
        @click.stop="prev"
      >
        <Icon name="lucide:chevron-left" class="w-7 h-7" />
      </button>

      <!-- Image -->
      <img
        :key="currentSrc"
        :src="currentSrc"
        :alt="`Foto ${currentIndex + 1}`"
        class="max-h-[88vh] max-w-[92vw] object-contain rounded-lg shadow-2xl select-none"
        draggable="false"
      />

      <!-- Next button -->
      <button
        v-if="photos.length > 1"
        type="button"
        class="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
        aria-label="Foto siguiente"
        @click.stop="next"
      >
        <Icon name="lucide:chevron-right" class="w-7 h-7" />
      </button>

      <!-- Counter -->
      <p
        v-if="photos.length > 1"
        class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-xs md:text-sm tracking-widest"
      >
        {{ currentIndex + 1 }} / {{ photos.length }}
      </p>
    </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps<{
  photos: string[]
  startIndex: number
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const currentIndex = ref(props.startIndex)

watch(
  () => [props.open, props.startIndex] as const,
  ([open, idx]) => {
    if (open) currentIndex.value = idx
  },
)

const currentSrc = computed(() => props.photos[currentIndex.value] ?? '')

const next = () => {
  if (!props.photos.length) return
  currentIndex.value = (currentIndex.value + 1) % props.photos.length
}

const prev = () => {
  if (!props.photos.length) return
  currentIndex.value = (currentIndex.value - 1 + props.photos.length) % props.photos.length
}

const close = () => emit('close')

const onKeydown = (e: KeyboardEvent) => {
  if (!props.open) return
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowRight') next()
  else if (e.key === 'ArrowLeft') prev()
}

let prevBodyOverflow = ''
watch(
  () => props.open,
  (open) => {
    if (typeof document === 'undefined') return
    if (open) {
      prevBodyOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', onKeydown)
    } else {
      document.body.style.overflow = prevBodyOverflow
      document.removeEventListener('keydown', onKeydown)
    }
  },
)

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = prevBodyOverflow
    document.removeEventListener('keydown', onKeydown)
  }
})

let touchStartX = 0
const onTouchStart = (e: TouchEvent) => {
  touchStartX = e.changedTouches[0]?.clientX ?? 0
}
const onTouchEnd = (e: TouchEvent) => {
  const endX = e.changedTouches[0]?.clientX ?? 0
  const dx = endX - touchStartX
  if (Math.abs(dx) < 40) return
  if (dx < 0) next()
  else prev()
}
</script>

<style scoped>
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.2s ease;
}
.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}
</style>
