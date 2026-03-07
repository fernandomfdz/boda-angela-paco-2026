<template>
  <section class="py-32 relative" id="ubicacion">
    <div class="max-w-6xl mx-auto px-4 relative z-10 flex flex-col lg:flex-row gap-16 items-center">
      
      <!-- Text details -->
      <div ref="textRef" class="w-full lg:w-1/2 opacity-0 -translate-x-10">
        <h2 class="text-4xl md:text-6xl font-serif text-wedding-accent mb-12">Dónde y Cuándo</h2>
        
        <div class="mb-10 pl-6 border-l border-wedding-accent/30">
          <h3 class="text-2xl font-serif mb-2 text-white">Ceremonia</h3>
          <p class="text-lg font-light opacity-90 mb-1">Parroquia de San Nicolás</p>
          <p class="opacity-60 text-sm mb-4">Plaza de San Nicolás, 1, 46001 Valencia</p>
          <p class="text-wedding-accent/90 font-medium tracking-widest uppercase text-sm">18:00 hrs</p>
        </div>

        <div class="mb-12 pl-6 border-l border-wedding-accent/30">
          <h3 class="text-2xl font-serif mb-2 text-white">Celebración</h3>
          <p class="text-lg font-light opacity-90 mb-1">Finca El Teular</p>
          <p class="opacity-60 text-sm mb-4">Carretera de la Sierra, Km 4, 46980 Paterna</p>
          <p class="text-wedding-accent/90 font-medium tracking-widest uppercase text-sm">Desde las 20:00 hrs</p>
        </div>
        
        <div class="flex flex-wrap gap-4">
          <a href="#" class="px-6 py-3 glass-light rounded text-xs md:text-sm uppercase tracking-widest hover:bg-white/20 transition-colors flex items-center gap-2">
            <Icon name="lucide:map-pin" class="w-4 h-4" /> Ver en Google Maps
          </a>
        </div>
      </div>

      <!-- Map Graphic / Placeholder -->
      <div ref="mapRef" class="w-full lg:w-1/2 opacity-0 translate-x-10">
        <div class="glass-dark p-3 rounded-2xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-700">
          <div class="aspect-square lg:aspect-auto lg:h-[500px] w-full bg-gradient-to-br from-wedding-dark via-[rgba(20,20,20,1)] to-white/5 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">
            
            <!-- Abstract map lines or icon -->
            <Icon name="lucide:map" class="w-24 h-24 opacity-10 group-hover:scale-110 transition-transform duration-700 mb-4" />
            <span class="text-white/20 font-serif italic text-xl">Mapa Interactivo</span>
            
            <div class="absolute inset-0 opacity-20 mix-blend-overlay" style="background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0); background-size: 24px 24px;"></div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const textRef = ref<HTMLElement | null>(null)
const mapRef = ref<HTMLElement | null>(null)

let ctx: gsap.Context

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  
  ctx = gsap.context(() => {
    if (textRef.value && mapRef.value) {
      gsap.to([textRef.value, mapRef.value], {
        x: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: textRef.value,
          start: 'top 80%',
        }
      })
    }
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>
