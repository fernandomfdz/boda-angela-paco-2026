<template>
  <div class="relative min-h-screen font-sans bg-wedding-dark text-wedding-light overflow-x-hidden">
    
    <main class="w-full relative min-h-screen">
      <!-- Hero Section -->
      <BackgroundCanvas />
      <section 
        ref="heroSection"
        class="relative h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
      >
        <div 
          ref="heroContent" 
          class="text-center z-10 flex flex-col items-center max-w-4xl mx-auto w-full"
        >
        <p class="text-xl md:text-2xl font-serif tracking-widest uppercase mb-4 text-wedding-light opacity-90 drop-shadow-xl">
            ¡Nos casamos!
          </p>
          <h1 class="text-6xl md:text-8xl lg:text-9xl font-serif text-wedding-accent mb-4 tracking-wider" style="text-shadow: 0 0 40px rgba(0,0,0,0.8);">
            Ángela & Paco
          </h1>
          <p class="text-xl md:text-2xl font-sans tracking-widest uppercase md:mb-16 mb-8 text-wedding-light opacity-90 drop-shadow-xl">
            {{ targetDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) }}
          </p>
          
          <!-- Countdown -->
          <div class="flex gap-4 md:gap-8 mb-8 md:mb-16 text-center text-wedding-light drop-shadow-2xl">
            <div class="flex flex-col items-center w-20">
              <span class="text-4xl md:text-6xl font-serif">{{ timeRemaining.days }}</span>
              <span class="text-[10px] md:text-xs uppercase tracking-widest opacity-70 mt-2">Días</span>
            </div>
            <span class="text-3xl md:text-5xl font-serif opacity-30 mt-2">:</span>
            <div class="flex flex-col items-center w-20">
              <span class="text-4xl md:text-6xl font-serif">{{ timeRemaining.hours }}</span>
              <span class="text-[10px] md:text-xs uppercase tracking-widest opacity-70 mt-2">Hrs</span>
            </div>
            <span class="text-3xl md:text-5xl font-serif opacity-30 mt-2">:</span>
            <div class="flex flex-col items-center w-20">
              <span class="text-4xl md:text-6xl font-serif">{{ timeRemaining.minutes }}</span>
              <span class="text-[10px] md:text-xs uppercase tracking-widest opacity-70 mt-2">Min</span>
            </div>
            <span class="text-3xl md:text-5xl font-serif opacity-30 mt-2 hidden sm:block">:</span>
            <div class="flex flex-col items-center w-20 hidden sm:flex">
              <span class="text-4xl md:text-6xl font-serif">{{ timeRemaining.seconds }}</span>
              <span class="text-[10px] md:text-xs uppercase tracking-widest opacity-70 mt-2">Seg</span>
            </div>
          </div>
          
          <!-- CTA -->
          <a 
            href="#rsvp" 
            class="glass-light px-8 py-4 rounded-full text-bold text-sm md:text-base tracking-[0.2em] uppercase transition-all duration-300 hover:bg-wedding-accent group flex items-center gap-3 drop-shadow-2xl"
          >
            Confirmar Asistencia
            <Icon name="lucide:arrow-right" class="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
        
        <!-- Scroll Indicator -->
        <div 
          ref="scrollIndicator"
          class="absolute bottom-10 mx-auto flex flex-col items-center z-10 opacity-70 animate-bounce cursor-pointer drop-shadow-lg"
          @click="scrollToHistory"
        >
          <span class="text-xs uppercase tracking-widest mb-2 opacity-80">Desliza</span>
          <Icon name="lucide:chevron-down" class="w-6 h-6" />
        </div>
      </section>

      <!-- Sections Backdrop (Obscures the canvas smoothly as we go down) -->
      <div class="relative z-10 bg-wedding-dark/50 backdrop-blur-sm border-t border-wedding-accent/20">
        <SectionHistory id="historia" />
        <SectionLocation id="ubicacion" />
        <SectionParty id="fiesta" />
        <SectionPhotos id="fotos" />
        <SectionRsvp id="rsvp" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const heroSection = ref<HTMLElement | null>(null)
const heroContent = ref<HTMLElement | null>(null)
const scrollIndicator = ref<HTMLElement | null>(null)

// Target Date
const targetDate = new Date('2026-08-30T18:00:00')

const timeRemaining = ref({
  days: '00',
  hours: '00',
  minutes: '00',
  seconds: '00'
})

let timerInterval: ReturnType<typeof setInterval>

const updateCountdown = () => {
  const now = new Date()
  const difference = targetDate.getTime() - now.getTime()

  if (difference <= 0) {
    timeRemaining.value = { days: '00', hours: '00', minutes: '00', seconds: '00' }
    if (timerInterval) clearInterval(timerInterval)
    return
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)

  timeRemaining.value = {
    days: days.toString().padStart(2, '0'),
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0')
  }
}

const scrollToHistory = () => {
  const el = document.getElementById('historia')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

let ctx: gsap.Context

onMounted(() => {
  updateCountdown()
  timerInterval = setInterval(updateCountdown, 1000)

  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    // Hero Parallax Setup
    if (heroSection.value && heroContent.value) {
      // Content moves up faster mapping exactly to scroll scrubbing
      gsap.to(heroContent.value, {
        y: '-40%',
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection.value,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      })
      
      // Fade out scroll indicator quickly
      gsap.to(scrollIndicator.value, {
        opacity: 0,
        y: 20,
        scrollTrigger: {
          trigger: heroSection.value,
          start: 'top top',
          end: 'top -20%',
          scrub: true
        }
      })
    }
  })
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
  if (ctx) ctx.revert()
})


  useHead({
    title: 'Ángela & Paco - ¡Nos casamos!',
    meta: [
      { name: 'description', content: 'Ángela & Paco - ¡Nos casamos!' },
      { hid: 'og-description', property: 'og:description', content: 'Ángela & Paco - ¡Nos casamos!'},
      { hid: 'twitter-card', property: 'twitter:card', content: '/opengraph-image.png' },
      { hid: 'og-title', property: 'og:title', content: 'Ángela & Paco - ¡Nos casamos!'},
      { hid: 'og-type', property: 'og:type', content: 'website' },
      { hid: 'og-image', property: 'og:image', content: 'https://boda.pacosarabia.com/opengraph-image.jpg'},
    ]
  });

  useSeoMeta({
    title: 'Ángela & Paco - ¡Nos casamos!',
    ogTitle: 'Ángela & Paco - ¡Nos casamos!',
    description: 'Ángela & Paco - ¡Nos casamos!',
    ogDescription: 'Ángela & Paco - ¡Nos casamos!',
    ogImage: 'https://boda.pacosarabia.com/opengraph-image.jpg',
    ogUrl: 'https://boda.pacosarabia.com',
    ogSiteName: 'Ángela & Paco - ¡Nos casamos!',
    ogType: 'website',
    ogImageType: 'image/jpeg',
    ogImageWidth: '1200',
    ogImageHeight: '600',
    ogLocale: 'es_ES',
    twitterCreator: '@fernandomfdz',
    twitterTitle: 'Ángela & Paco - ¡Nos casamos!',
    twitterImage: 'https://boda.pacosarabia.com/opengraph-image.jpg',
    twitterDescription: 'Ángela & Paco - ¡Nos casamos!',
    twitterCard: 'summary_large_image',
    
    
  })
</script>
