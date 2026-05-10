<template>
  <section class="py-32 relative" id="comparte-wedibox">
    <div class="max-w-6xl mx-auto px-4 relative z-10">
      <div ref="headerRef" class="text-center mb-12 opacity-0 translate-y-6">
        <h2 class="text-4xl md:text-6xl font-serif text-wedding-accent mb-6">
          Comparte tus fotos
        </h2>
        <p class="text-lg md:text-xl font-light max-w-2xl mx-auto opacity-80 leading-relaxed">
          Otra forma de hacerlo: sube directamente las fotos al álbum y
          consérvalas todas para siempre.
        </p>
      </div>

      <!-- Iframe Wedibox (auto-resize via postMessage) -->
      <div
        ref="frameRef"
        id="wedibox"
        class=" rounded-2xl overflow-hidden mb-10 max-w-4xl mx-auto opacity-0 translate-y-8"
        style="border: 1px solid var(--c-border);"
      >
        <div v-if="!frameLoaded" class="w-full flex items-center justify-center" style="height: 200px; background: var(--c-glass-bg);">
          <p class="font-serif italic opacity-60 text-sm">Cargando álbum compartido…</p>
        </div>
        <iframe
          ref="iframeRef"
          :src="wediboxUrl"
          allow="camera; microphone; clipboard-write; fullscreen"
          loading="lazy"
          referrerpolicy="no-referrer"
          title="Álbum compartido — Wedibox"
          class="w-full block"
          :style="{ height: frameHeight + 'px', border: 0, background: 'var(--c-surface)' }"
          @load="onFrameLoad"
        />
      </div>
    </div>
  </section>
</template>
<style>
#wedibox {
  body {
    background: transparent !important;
  }
}
.ng-star-inserted {
  background: transparent !important;
}
</style>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const EVENT_ID = 'dd124f3b-b39a-4687-9a9f-c163b585ea4b'
const wediboxUrl = `https://www.wedibox.com/w/e/${EVENT_ID}`

const frameLoaded = ref(false)
const frameHeight = ref(640) // altura inicial razonable hasta el primer postMessage

const headerRef = ref<HTMLElement | null>(null)
const frameRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)
const iframeRef = ref<HTMLIFrameElement | null>(null)

const onFrameLoad = () => {
  frameLoaded.value = true
}

// Réplica del auto-resize del widget oficial: el iframe envía
// {type: 'WEDIBOX_WIDGET_RESIZE', payload: {height}} via postMessage.
const onMessage = (event: MessageEvent) => {
  // event.origin no incluye path, comprobamos solo el host
  if (!event.origin.endsWith('wedibox.com')) return
  const data = event.data
  if (!data || typeof data !== 'object' || data.type !== 'WEDIBOX_WIDGET_RESIZE') return
  const h = data.payload?.height
  if (typeof h !== 'number' || h < 320) return
  // Asegurar que el mensaje viene de NUESTRO iframe
  if (iframeRef.value && iframeRef.value.contentWindow === event.source) {
    frameHeight.value = h
  }
}

let ctx: gsap.Context

onMounted(() => {
  window.addEventListener('message', onMessage, false)

  gsap.registerPlugin(ScrollTrigger)
  ctx = gsap.context(() => {
    const targets = [headerRef.value, frameRef.value, ctaRef.value].filter(Boolean) as HTMLElement[]
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
  window.removeEventListener('message', onMessage, false)
  if (ctx) ctx.revert()
})
</script>
