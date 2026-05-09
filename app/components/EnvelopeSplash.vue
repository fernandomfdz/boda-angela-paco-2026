<template>
  <div
    ref="overlayRef"
    class="fixed inset-0 z-50 flex items-center justify-center px-6 py-10"
    :style="{ backgroundColor: 'var(--c-bg)' }"
    role="dialog"
    aria-modal="true"
    aria-labelledby="envelope-title"
  >
    <!-- Sobre (proporción tipo C5/A5: 7:5 horizontal — sobre real con carta) -->
    <div
      v-show="stage === 'closed' || stage === 'opening'"
      ref="envelopeRef"
      class="relative mx-auto"
      style="width: min(92vw, 720px); aspect-ratio: 7 / 5;"
    >
      <!-- Cuerpo del sobre -->
      <div
        class="absolute inset-0 rounded-sm shadow-2xl"
        :style="{
          background: 'linear-gradient(160deg, var(--c-surface) 0%, color-mix(in srgb, var(--c-surface) 90%, var(--c-secondary) 10%) 100%)',
          border: '1px solid color-mix(in srgb, var(--c-text) 22%, transparent)',
          boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.35), 0 0 0 1px color-mix(in srgb, var(--c-text) 6%, transparent) inset',
        }"
      ></div>

      <!-- Solapa superior (V apuntando al centro, animada) -->
      <div
        ref="flapRef"
        class="absolute inset-x-0 top-0 h-1/2 origin-top"
        style="clip-path: polygon(0 0, 100% 0, 50% 100%); transform-style: preserve-3d; backface-visibility: hidden; background: linear-gradient(180deg, color-mix(in srgb, var(--c-surface) 96%, var(--c-text) 4%) 0%, color-mix(in srgb, var(--c-surface) 84%, var(--c-text) 16%) 100%); filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));"
      ></div>

      <!-- Borde de la solapa superior (líneas en V que delimitan el doblez) -->
      <svg
        class="absolute inset-x-0 top-0 w-full h-1/2 pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        style="color: color-mix(in srgb, var(--c-text) 22%, transparent);"
      >
        <polyline
          points="0,0 50,100 100,0"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          vector-effect="non-scaling-stroke"
        />
      </svg>

      <!-- Sello de cera dorado (SVG skeuomórfico) — centrado por flex para no chocar con GSAP -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <button
          ref="sealRef"
          type="button"
          class="seal-btn pointer-events-auto w-16 h-16 md:w-36 md:h-36 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--c-accent)] rounded-full"
          style="aspect-ratio: 1 / 1; flex-shrink: 0; background: transparent; border: 0; padding: 0;"
          :disabled="stage !== 'closed'"
          :aria-label="`Abrir invitación para ${recipientName}`"
          @click="open"
        >
          <svg
            viewBox="0 0 200 200"
            class="block w-full h-full overflow-visible"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <!-- Borde ondulado (anillo de cera) -->
              <radialGradient id="petalGrad" cx="35%" cy="28%" r="78%">
                <stop offset="0%" stop-color="#FFF3C4" />
                <stop offset="22%" stop-color="#F2D472" />
                <stop offset="55%" stop-color="#C99A2C" />
                <stop offset="82%" stop-color="#7A5A14" />
                <stop offset="100%" stop-color="#3D2D08" />
              </radialGradient>

              <!-- Stamp interior (cara visible del sello) -->
              <radialGradient id="stampGrad" cx="42%" cy="34%" r="72%">
                <stop offset="0%" stop-color="#F4D77A" />
                <stop offset="50%" stop-color="#C99A2C" />
                <stop offset="100%" stop-color="#7A5A14" />
              </radialGradient>

              <!-- Sombra direccional del recess (más oscura arriba donde el pétalo proyecta sombra,
                   más clara abajo donde rebota luz desde el borde del stamp) -->
              <linearGradient id="recessGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stop-color="#5C4612" stop-opacity="0.55" />
                <stop offset="55%" stop-color="#7A5A14" stop-opacity="0.30" />
                <stop offset="100%" stop-color="#E8C547" stop-opacity="0.20" />
              </linearGradient>

              <!-- Highlight superior izquierdo del stamp -->
              <radialGradient id="highlightGrad" cx="32%" cy="22%" r="45%">
                <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.55" />
                <stop offset="60%" stop-color="#FFFFFF" stop-opacity="0.05" />
                <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
              </radialGradient>

              <!-- Sombra proyectada del sello completo -->
              <filter id="sealDropShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#3D2D08" flood-opacity="0.55" />
              </filter>

              <!-- Sombra interior del stamp (efecto recessed) -->
              <filter id="innerShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" />
                <feOffset dx="0" dy="2" result="offsetblur" />
                <feFlood flood-color="#3D2D08" flood-opacity="0.7" />
                <feComposite in2="offsetblur" operator="in" />
                <feComposite in2="SourceGraphic" operator="arithmetic" k2="-1" k3="1" />
                <feComposite in="SourceGraphic" operator="over" />
              </filter>
            </defs>

            <!-- Anillo ondulado exterior (los pétalos de cera) -->
            <path :d="sealPath" fill="url(#petalGrad)" filter="url(#sealDropShadow)" />

            <!-- Recess (anillo de sombra suave entre pétalos y stamp) -->
            <circle cx="100" cy="100" r="68" fill="url(#recessGrad)" />

            <!-- Cara del stamp (parte plana grabada) -->
            <circle cx="100" cy="100" r="65" fill="url(#stampGrad)" />

            <!-- Highlight superior izquierdo del stamp -->
            <circle cx="100" cy="100" r="65" fill="url(#highlightGrad)" />

            <!-- Bisel superior tenue (sombra del pétalo cayendo en el stamp) -->
            <path
              d="M 35 100 A 65 65 0 0 1 165 100"
              fill="none"
              stroke="#3D2D08"
              stroke-width="1"
              stroke-opacity="0.35"
              stroke-linecap="round"
            />

            <!-- Bisel inferior cálido (luz rebotada del oro) -->
            <path
              d="M 35 100 A 65 65 0 0 0 165 100"
              fill="none"
              stroke="#FFE5A0"
              stroke-width="1"
              stroke-opacity="0.5"
              stroke-linecap="round"
            />

            <!-- Texto "Abrir" -->
            <text
              x="100"
              y="113"
              text-anchor="middle"
              font-family="Cormorant Garamond, ui-serif, Georgia, serif"
              font-style="italic"
              font-weight="500"
              font-size="44"
              fill="#3D2D08"
              style="letter-spacing: 0.5px; paint-order: stroke fill;"
              stroke="#FFE5A0"
              stroke-width="0.4"
              stroke-opacity="0.5"
            >Abrir</text>
          </svg>
        </button>
      </div>

      <!-- Texto dentro del sobre — centrado en la mitad inferior, debajo del sello -->
      <div
        ref="addressRef"
        class="absolute left-0 right-0 text-center px-6 pointer-events-none select-none"
        style="bottom: 12%;"
      >
        <p
          id="envelope-title"
          class="font-serif italic text-md"
          :style="{ color: 'var(--c-secondary)' }"
        >
          Invitación para
        </p>
        <p
          class="font-serif tracking-wide text-2xl"
          :style="{ color: 'var(--c-text)' }"
        >
          {{ recipientName }}
        </p>
      </div>
    </div>

    <!-- Carta -->
    <div
      v-show="stage === 'opening' || stage === 'letter'"
      ref="letterRef"
      class="absolute inset-0 flex items-center justify-center p-4 md:p-10 pointer-events-none"
    >
      <article
        class="relative w-full max-w-xl rounded-lg shadow-2xl px-6 py-10 md:px-12 md:py-14 pointer-events-auto"
        :style="{
          backgroundColor: 'var(--c-surface)',
          border: '1px solid var(--c-border)',
        }"
      >
        <div
          class="absolute inset-x-0 -top-px mx-auto h-px opacity-60"
          style="background: linear-gradient(to right, transparent, var(--c-accent), transparent);"
        ></div>

        <p
          class="font-serif italic text-center text-sm md:text-base tracking-[0.3em] uppercase mb-6"
          :style="{ color: 'var(--c-accent)' }"
        >
          Ángela &amp; Paco
        </p>

        <h2
          class="font-serif text-3xl md:text-4xl text-center mb-8"
          :style="{ color: 'var(--c-text)' }"
        >
          {{ greeting }},
        </h2>

        <div class="space-y-5 font-serif text-lg md:text-xl leading-relaxed text-center" :style="{ color: 'var(--c-text)' }">
          <p
            v-for="(paragraph, idx) in paragraphs"
            :key="idx"
            class="whitespace-pre-line"
          >
            {{ paragraph }}
          </p>
        </div>

        <div class="mt-10 flex justify-center">
          <button
            type="button"
            class="group inline-flex items-center gap-3 px-8 py-3 rounded-full text-sm md:text-base tracking-[0.2em] uppercase font-sans cursor-pointer transition-all duration-300"
            :style="{
              backgroundColor: 'var(--c-accent)',
              color: 'var(--c-bg)',
            }"
            @click="close"
          >
            Entrar
            <Icon name="lucide:arrow-right" class="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import type { Guest } from '~/types/guest'

// Estilos del sello (hover/active sin transform para no romper GSAP)

const props = defineProps<{
  guest?: Guest | null
}>()

const emit = defineEmits<{
  (e: 'dismiss'): void
}>()

type Stage = 'closed' | 'opening' | 'letter' | 'closing'
const stage = ref<Stage>('closed')

const overlayRef = ref<HTMLElement | null>(null)
const envelopeRef = ref<HTMLElement | null>(null)
const flapRef = ref<HTMLElement | null>(null)
const sealRef = ref<HTMLButtonElement | null>(null)
const addressRef = ref<HTMLElement | null>(null)
const letterRef = ref<HTMLElement | null>(null)

// Path ondulado del sello de cera: 11 pétalos con variación sinusoidal
// y leve irregularidad para que no se vea simétrico-artificial.
const sealPath = (() => {
  const N = 220
  const petals = 11
  const cx = 100
  const cy = 100
  const r0 = 88
  const amp = 7
  let d = ''
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * Math.PI * 2
    // Onda principal + pequeña variación de segundo orden para asimetría natural
    const r = r0 + amp * Math.cos(petals * t) + 1.6 * Math.sin(petals * 2 * t + 0.7)
    const x = cx + r * Math.cos(t - Math.PI / 2)
    const y = cy + r * Math.sin(t - Math.PI / 2)
    d += (i === 0 ? 'M' : ' L') + x.toFixed(2) + ',' + y.toFixed(2)
  }
  return d + ' Z'
})()

const recipientName = computed(() => props.guest?.displayName ?? 'nuestros invitados')
const greeting = computed(() => props.guest?.greeting ?? 'Queridos invitados')
const fallbackMessage =
  'Nos casamos el 30 de Septiembre de 2026 y nos haría muchísima ilusión compartir este día tan especial contigo.\n\nCon todo el cariño,\nÁngela y Paco'
const paragraphs = computed(() => {
  const raw = props.guest?.message ?? fallbackMessage
  return raw.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
})

let prevBodyOverflow = ''
const lockScroll = () => {
  prevBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
}
const unlockScroll = () => {
  document.body.style.overflow = prevBodyOverflow
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const music = useBackgroundMusic()

const playSound = () => {
  try {
    const audio = new Audio('/letter-open.mp3')
    audio.play().catch(e => console.warn('Audio play failed:', e))
  } catch (err) {
    // Ignore audio errors gracefully
  }
}

const open = () => {
  if (stage.value !== 'closed') return
  stage.value = 'opening'

  if (prefersReducedMotion()) {
    playSound()
    gsap.set(letterRef.value, { opacity: 0 })
    stage.value = 'letter'
    gsap.to(letterRef.value, { opacity: 1, duration: 0.3, ease: 'power2.out' })
    return
  }

  const tl = gsap.timeline({
    onComplete: () => { stage.value = 'letter' },
  })

  tl.to(sealRef.value, { scale: 0.9, duration: 0.1, ease: 'power2.in' })
    .to(sealRef.value, { scale: 1.15, rotate: -18, opacity: 0, duration: 0.5, ease: 'power2.out' })
    .to(flapRef.value, { rotateX: -180, duration: 0.9, ease: 'power2.inOut' }, '-=0.2')
    .to(addressRef.value, { opacity: 0, duration: 0.4, ease: 'power2.out' }, '-=0.6')
    .fromTo(
      letterRef.value,
      { opacity: 0, y: 70, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out', onStart: playSound },
      '-=0.4',
    )
    .to(envelopeRef.value, { opacity: 0, scale: 0.92, duration: 0.5, ease: 'power2.inOut' }, '-=0.7')
}

const close = () => {
  if (stage.value === 'closing') return
  stage.value = 'closing'

  if (prefersReducedMotion()) {
    emit('dismiss')
    return
  }

  gsap.to(overlayRef.value, {
    opacity: 0,
    duration: 0.6,
    ease: 'power2.inOut',
    onComplete: () => emit('dismiss'),
  })
}

onMounted(() => {
  lockScroll()
  gsap.set(letterRef.value, { opacity: 0, y: 70, scale: 0.95 })
  if (envelopeRef.value) {
    envelopeRef.value.style.perspective = '1200px'
  }
})

onBeforeUnmount(() => {
  unlockScroll()
})
</script>

<style scoped>
.seal-btn {
  transition: filter 200ms ease;
  filter: drop-shadow(0 6px 14px rgba(168, 132, 31, 0.35));
}
.seal-btn:hover:not(:disabled) {
  filter: drop-shadow(0 10px 22px rgba(212, 175, 55, 0.55)) brightness(1.06);
}
.seal-btn:active:not(:disabled) {
  filter: drop-shadow(0 4px 10px rgba(168, 132, 31, 0.45)) brightness(0.96);
}
</style>

