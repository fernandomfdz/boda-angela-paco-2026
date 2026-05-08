<template>
  <section 
    ref="heroSection"
    class="relative min-h-screen h-dvh flex flex-col items-center justify-center px-4 overflow-hidden"
  >
    <!-- Background layers -->
     <div ref="heroImage" class="opacity-0 fixed top-0 z-1 w-full h-auto">
      <NuxtImg 
        src="/images/image.png" 
        alt="Wedding Background" 
        class=" w-full h-auto object-contain"
      />
    </div>
    
    <div ref="heroStars" class="opacity-0 fixed inset-0 z-2 pointer-events-none">
      <BackgroundStars />
    </div>

    <!-- Fireworks Canvas (not animated out of sequence, just there) -->
    <div class="fixed inset-0 z-3 pointer-events-none">
      <BackgroundCanvas :active="showFireworks" />
    </div>

    <!-- Hero Content -->
    <div 
      ref="heroContent" 
      class="text-center z-10 flex flex-col items-center max-w-4xl mx-auto w-full"
    >
      <p
        ref="elTitle"
        class="text-xl md:text-2xl font-serif tracking-widest uppercase mb-4 text-wedding-light opacity-0 drop-shadow-xl"
      >
        ¡Nos casamos!
      </p>
    

      <p
        v-if="guest"
        ref="elGuest"
        class="text-base font-serif italic tracking-wider mb-3 text-wedding-accent opacity-0 drop-shadow-xl"
      >
        Invitación para {{ guest.displayName }}
      </p>
      <h1 
        ref="elNames"
        class="flex gap-y-2 gap-x-6 flex-wrap items-baseline justify-center text-6xl md:text-8xl lg:text-9xl font-serif break-keep text-wedding-accent mb-4 tracking-wider opacity-0" 
      >
      <span class="w-full md:w-fit">Ángela</span>
      <span class="w-full md:w-fit leading-6 mt-3 md:mt-0 text-3xl md:text-6xl">&</span>
      <span class="w-full md:w-fit leading-9">Paco</span>
      </h1>
      
      <div ref="elPhoto" class="aspect-[4/3] size-64 md:size-80 rounded-full overflow-hidden mt-4 md:mt-8 opacity-0">
        <NuxtImg 
          src="/images/evento.jpeg" 
          alt="Wedding Background" 
          class="w-full h-full object-cover "
        />
      </div>
      <p 
        ref="elDate"
        class="text-xl md:text-2xl font-sans tracking-widest uppercase text-wedding-light opacity-0 drop-shadow-xl mt-4 md:mt-8"
      >
        {{ targetDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) }}
      </p>
      
      <!-- Countdown -->
      <div 
        ref="elCountdown"
        class="opacity-0 drop-shadow-2xl mt-8"
      >
        <ClientOnly>
          <template #default>
            <div class="flex md:gap-8 mb-8 md:mb-16 text-center text-wedding-light" style="font-variant-numeric: tabular-nums">
              <div class="flex flex-col items-center w-16">
                <span class="text-4xl md:text-6xl font-serif">{{ renderTimeRemaining.days }}</span>
                <span class="text-[10px] md:text-xs uppercase tracking-widest opacity-70 mt-2">Días</span>
              </div>
              <span class="text-3xl md:text-5xl font-serif opacity-30 mt-2">:</span>
              <div class="flex flex-col items-center w-16">
                <span class="text-4xl md:text-6xl font-serif">{{ renderTimeRemaining.hours }}</span>
                <span class="text-[10px] md:text-xs uppercase tracking-widest opacity-70 mt-2">Hrs</span>
              </div>
              <span class="text-3xl md:text-5xl font-serif opacity-30 mt-2">:</span>
              <div class="flex flex-col items-center w-16">
                <span class="text-4xl md:text-6xl font-serif">{{ renderTimeRemaining.minutes }}</span>
                <span class="text-[10px] md:text-xs uppercase tracking-widest opacity-70 mt-2">Min</span>
              </div>
              <span class="text-3xl md:text-5xl font-serif opacity-30 mt-2">:</span>
              <div class="flex flex-col items-center w-16">
                <span class="text-4xl md:text-6xl font-serif">{{ renderTimeRemaining.seconds }}</span>
                <span class="text-[10px] md:text-xs uppercase tracking-widest opacity-70 mt-2">Seg</span>
              </div>
            </div>
          </template>
          <template #fallback>
            <div class="flex gap-4 md:gap-8 mb-8 md:mb-16 text-center text-wedding-light">
              <div class="flex flex-col items-center w-20">
                <span class="text-4xl md:text-6xl font-serif">00</span>
                <span class="text-[10px] md:text-xs uppercase tracking-widest opacity-70 mt-2">Días</span>
              </div>
              <span class="text-3xl md:text-5xl font-serif opacity-30 mt-2">:</span>
              <div class="flex flex-col items-center w-20">
                <span class="text-4xl md:text-6xl font-serif">00</span>
                <span class="text-[10px] md:text-xs uppercase tracking-widest opacity-70 mt-2">Hrs</span>
              </div>
              <span class="text-3xl md:text-5xl font-serif opacity-30 mt-2">:</span>
              <div class="flex flex-col items-center w-20">
                <span class="text-4xl md:text-6xl font-serif">00</span>
                <span class="text-[10px] md:text-xs uppercase tracking-widest opacity-70 mt-2">Min</span>
              </div>
              <span class="text-3xl md:text-5xl font-serif opacity-30 mt-2 hidden sm:block">:</span>
              <div class="hidden sm:flex flex-col items-center w-20">
                <span class="text-4xl md:text-6xl font-serif">00</span>
                <span class="text-[10px] md:text-xs uppercase tracking-widest opacity-70 mt-2">Seg</span>
              </div>
            </div>
          </template>
        </ClientOnly>
      </div>
      
      <!-- CTA -->
      <div ref="elButton" class="opacity-0">
        <a
          v-if="guest && !alreadySubmitted"
          href="#rsvp"
          class="glass-light px-8 py-4 rounded-full bg-wedding-dark/30 text-bold text-sm md:text-base border-2 border-wedding-light/30 tracking-[0.2em] uppercase transition-all duration-300 hover:bg-wedding-dark hover:border-wedding-accent group flex items-center gap-3 drop-shadow-2xl"
        >
          Confirmar Asistencia
          <Icon name="lucide:arrow-right" class="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </a>
        <p v-if="alreadySubmitted" class="flex items-center gap-2 text-2xl">
          <Icon name="lucide:badge-check" class="text-green-600 text-2xl"></Icon>Ya te has registrado. ¡Gracias!
        </p>
      </div>
    </div>
    
    <!-- Scroll Indicator -->
    <div 
      ref="scrollIndicator"
      class="absolute bottom-10 mx-auto flex flex-col items-center z-10 opacity-0 animate-bounce cursor-pointer drop-shadow-lg"
      @click="scrollToHistory"
    >
      <span class="text-xs uppercase tracking-widest mb-2 opacity-80">Desliza</span>
      <Icon name="lucide:chevron-down" class="w-6 h-6" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Guest } from '~/types/guest'

const props = defineProps<{
  guest?: Guest | null
}>()

const heroSection = ref<HTMLElement | null>(null)
const heroContent = ref<HTMLElement | null>(null)
const scrollIndicator = ref<HTMLElement | null>(null)

// Animation refs
const heroImage = ref<HTMLElement | null>(null)
const heroStars = ref<HTMLElement | null>(null)
const elNames = ref<HTMLElement | null>(null)
const elTitle = ref<HTMLElement | null>(null)
const elGuest = ref<HTMLElement | null>(null)
const elDate = ref<HTMLElement | null>(null)
const elCountdown = ref<HTMLElement | null>(null)
const elButton = ref<HTMLElement | null>(null)
const elPhoto = ref<HTMLElement | null>(null)

const alreadySubmitted = ref(false)
const showFireworks = ref(false)

// Target Date (Constructed safely to avoid iOS Safari NaN parse issues)
// 30 de Agosto de 2026, 18:00:00 -> Month is 0-indexed (7 = August)
const targetDate = new Date(2026, 7, 29, 18, 0, 0)
const targetTime = targetDate.getTime()

// Ensure reactive "now" works perfectly after hydration
const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | null = null

const renderTimeRemaining = computed(() => {
    const diff = targetTime - now.value
    if (diff <= 0 || isNaN(diff)) {
        return { days: '00', hours: '00', minutes: '00', seconds: '00' }
    }

    const days = Math.floor(diff / 86400000)
    const hours = Math.floor((diff % 86400000) / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)

    return {
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
    }
})

const scrollToHistory = () => {
  const el = document.getElementById('historia')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

let ctx: gsap.Context

onMounted(() => {
  // Check localStorage for previous submission (per-slug, solo si hay guest)
  if (import.meta.client && props.guest?.slug) {
    const key = `wedding_rsvp_submitted_${props.guest.slug}`
    if (localStorage.getItem(key) === 'true') {
      alreadySubmitted.value = true
    }
  }
  
  // Update time and establish interval explicitly
  now.value = Date.now()
  timer = setInterval(() => {
    now.value = Date.now()
  }, 1000)

  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    
    // 1. Initial Load Sequence
    const tl = gsap.timeline()
    
    // Slow sequential fade in
      tl.to(heroStars.value, { opacity: 1, duration: 1, ease: "power2.inOut" })
        .to(heroImage.value, { opacity: 1, duration: 2, ease: "power2.inOut" },"-=1" )
         // Start overlapping
        .to(elNames.value, { opacity: 1, y: 0, duration: 2, ease: "power2.out" })
        .to(elPhoto.value, { opacity: 1, y: 0, duration: 2, ease: "power2.out" }, "-=0.5")
        .to(elDate.value, { opacity: 1, y: 0, duration: 2, ease: "power2.out" }, "-=0.5")
        .to(elTitle.value, { opacity: 1, y: 0, duration: 2, ease: "power2.out" }, "-=0.5")
      if (elGuest.value) {
        tl.to(elGuest.value, { opacity: 1, y: 0, duration: 1.4, ease: "power2.out" }, "-=1.2")
      }
      tl.to(elCountdown.value, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=1")
        .to(elButton.value, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=1")
        .to(scrollIndicator.value, { opacity: 0.7, duration: 1 }, "-=1")
      .call(() => { showFireworks.value = true })
  })
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (ctx) ctx.revert()
})
</script>
