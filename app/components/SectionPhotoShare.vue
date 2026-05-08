<template>
  <section class="py-32 relative" id="comparte">
    <div class="max-w-6xl mx-auto px-4 relative z-10">
      <div ref="headerRef" class="text-center mb-12 opacity-0 translate-y-6">
        <p
          class="font-sans text-xs tracking-[0.4em] uppercase opacity-60 mb-3"
          :style="{ color: 'var(--c-secondary)' }"
        >
          Opción B · Dots
        </p>
        <h2 class="text-4xl md:text-6xl font-serif text-wedding-accent mb-6">
          Comparte tus fotos
        </h2>
        <p class="text-lg md:text-xl font-light max-w-2xl mx-auto opacity-80 leading-relaxed">
          Vivamos este día desde todos los ángulos. Sube las fotos que hagas
          para que entre todos formemos nuestro álbum.
        </p>
      </div>

      <!-- Iframe embebido -->
      <div
        ref="frameRef"
        class="glass-dark rounded-2xl overflow-hidden mb-10 max-w-4xl mx-auto opacity-0 translate-y-8"
        style="border: 1px solid var(--c-border); box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.45);"
      >
        <div v-if="!frameLoaded" class="w-full flex items-center justify-center" style="height: 200px; background: var(--c-glass-bg);">
          <p class="font-serif italic opacity-60 text-sm">Cargando álbum compartido…</p>
        </div>
        <iframe
          :src="dotsUrl"
          allow="camera; microphone; clipboard-write; fullscreen; accelerometer; gyroscope; autoplay"
          loading="lazy"
          referrerpolicy="no-referrer"
          title="Álbum compartido — sube tus fotos"
          class="w-full block"
          style="height: min(80vh, 760px); border: 0; background: var(--c-surface);"
          @load="frameLoaded = true"
        />
      </div>

      <!-- CTA + QR -->
      <div ref="ctaRef" class="flex flex-col md:flex-row gap-10 md:gap-16 items-center justify-center max-w-4xl mx-auto opacity-0 translate-y-8">
        <a
          :href="dotsUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-medium tracking-[0.2em] uppercase text-sm transition-all duration-300"
          :style="{
            backgroundColor: 'var(--c-accent)',
            color: 'var(--c-bg)',
          }"
        >
          Abrir en pantalla completa
          <Icon name="lucide:external-link" class="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>

        <div class="flex items-center gap-5">
          <div
            class="rounded-xl p-3 flex-shrink-0"
            style="background: #FFFFFF; box-shadow: 0 8px 24px rgba(0,0,0,0.2);"
          >
            <img
              src="/qr-photos.svg"
              alt="Código QR para subir fotos al álbum"
              class="block w-24 h-24 md:w-28 md:h-28"
              width="112"
              height="112"
            />
          </div>
          <p class="font-serif italic text-sm md:text-base max-w-[220px] opacity-80 leading-snug">
            Escanea con la cámara de tu móvil para subir fotos al instante
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const dotsUrl =
  'https://web.dotstheapp.com/a?group=2190341&dlBy=angela.vigueras95&code=6WEEdg4l'

const frameLoaded = ref(false)

const headerRef = ref<HTMLElement | null>(null)
const frameRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)

let ctx: gsap.Context

onMounted(() => {
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

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>
