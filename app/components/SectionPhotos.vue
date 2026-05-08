<template>
  <section class="py-32 relative overflow-hidden" id="fotos">
    <div class="max-w-6xl mx-auto px-4 relative z-10">

      <div ref="titleRef" class="text-center mb-16 opacity-0 translate-y-10">
        <h2 class="text-4xl md:text-6xl font-serif text-wedding-accent mb-4">La Galería</h2>
        <p class="text-lg md:text-xl font-sans tracking-widest uppercase opacity-70">Momentos para recordar</p>
      </div>

      <!-- Masonry Parallax Grid -->
      <div
        v-if="hasPhotos"
        ref="gridContainer"
        class="flex gap-4 md:gap-6 h-[800px] md:h-[600px] overflow-hidden justify-center relative mask-image-bottom-fade"
      >
        <div
          v-for="(col, colIdx) in columns"
          :key="colIdx"
          class="flex flex-col gap-4 md:gap-6 w-1/3 max-w-[300px] parallax-col"
          :class="colIdx === 1 ? '-mt-24' : ''"
          :data-speed="colSpeeds[colIdx]"
        >
          <div
            v-for="(photo, photoIdx) in col"
            :key="photo.src"
            class="w-full rounded-2xl overflow-hidden glass-light p-1 group"
            :class="aspectClass(colIdx, photoIdx)"
          >
            <NuxtImg
              :src="photo.src"
              :alt="photo.alt"
              loading="lazy"
              format="webp"
              fit="cover"
              class="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      </div>

      <p v-else class="text-center opacity-60 italic font-serif">Aún no hay fotos en la galería.</p>
    </div>
  </section>
</template>

<style scoped>
.mask-image-bottom-fade {
  mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const config = useRuntimeConfig()
const galleryFiles = (config.public.gallery as string[]) ?? []

const photos = computed(() =>
  galleryFiles.map((file, i) => ({
    src: `/gallery/${encodeURIComponent(file)}`,
    alt: `Foto ${i + 1} de Ángela y Paco`,
  })),
)

const hasPhotos = computed(() => photos.value.length > 0)

// Distribución round-robin en 3 columnas (mantiene balance visual)
const columns = computed(() => {
  const cols: { src: string; alt: string }[][] = [[], [], []]
  photos.value.forEach((p, i) => {
    cols[i % 3]!.push(p)
  })
  return cols
})

const colSpeeds = ['0.8', '1.2', '0.9']

// Variación de aspectos cíclica por celda — mantiene el feel "masonry"
// aunque las fotos vengan con dimensiones nativas distintas (cada cuadro
// recorta con object-cover según el aspecto asignado).
const aspectsByColumn: string[][] = [
  ['aspect-[3/4]', 'aspect-square', 'aspect-[3/4]'],
  ['aspect-square', 'aspect-[3/4]', 'aspect-video'],
  ['aspect-[4/3]', 'aspect-square', 'aspect-[3/4]'],
]
const aspectClass = (colIdx: number, photoIdx: number) => {
  const colPattern = aspectsByColumn[colIdx]!
  return colPattern[photoIdx % colPattern.length]
}

const titleRef = ref<HTMLElement | null>(null)
const gridContainer = ref<HTMLElement | null>(null)
let ctx: gsap.Context

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    if (titleRef.value) {
      gsap.to(titleRef.value, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.value,
          start: 'top 85%',
        },
      })
    }

    if (!hasPhotos.value || !gridContainer.value) return

    const cols = gsap.utils.toArray<HTMLElement>('.parallax-col')
    cols.forEach((col) => {
      const speed = parseFloat(col.dataset.speed || '1')
      gsap.to(col, {
        y: () => `${-150 * speed}px`,
        ease: 'none',
        scrollTrigger: {
          trigger: gridContainer.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    })
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>
