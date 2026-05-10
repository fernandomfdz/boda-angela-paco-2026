<template>
  <section class="py-32 relative" id="comparte-wedibox">
    <div class="max-w-6xl mx-auto px-4 relative z-10">
      <div ref="headerRef" class="text-center mb-12 opacity-0 translate-y-6">
        <p
          class="font-sans text-xs tracking-[0.4em] uppercase opacity-60 mb-3"
          :style="{ color: 'var(--c-secondary)' }"
        >
          Álbum Compartido
        </p>
        <h2 class="text-4xl md:text-6xl font-serif text-wedding-accent mb-6">
          Comparte tus fotos
        </h2>
        <p class="text-lg md:text-xl font-light max-w-2xl mx-auto opacity-80 leading-relaxed">
          Sube tus fotos directamente al álbum para que todos podamos recordarlo para siempre.
        </p>
      </div>

      <div class="max-w-4xl mx-auto opacity-0 translate-y-8" ref="contentRef">
        <PhotoUploadZone @uploaded="onPhotosUploaded" />
        <PhotoGalleryGrid ref="galleryRef" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const headerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const galleryRef = ref<any>(null)

const onPhotosUploaded = () => {
  if (galleryRef.value) {
    galleryRef.value.refresh()
  }
}

let ctx: gsap.Context

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  ctx = gsap.context(() => {
    const targets = [headerRef.value, contentRef.value].filter(Boolean) as HTMLElement[]
    if (targets.length === 0) return
    gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.18,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: headerRef.value,
        start: 'top 80%',
      },
    })
  })
})

onBeforeUnmount(() => {
  if (ctx) ctx.revert()
})
</script>
