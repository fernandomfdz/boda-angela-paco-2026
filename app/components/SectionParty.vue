<template>
  <section class="py-32 relative" id="fiesta">
    <div class="max-w-6xl mx-auto px-4 relative z-10">
      
      <div ref="titleRef" class="text-center mb-20 opacity-0 translate-y-10">
        <h2 class="text-4xl md:text-6xl font-serif text-wedding-accent mb-4">La Fiesta</h2>
        <p class="text-lg md:text-xl font-sans tracking-widest uppercase opacity-70">Para no parar de bailar</p>
      </div>

      <!-- Bento Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
        
        <!-- Dress Code -->
        <div class="bento-item opacity-0 translate-y-10 glass-dark rounded-3xl p-8 md:col-span-2 md:row-span-2 flex flex-col justify-center relative overflow-hidden group">
          <Icon name="lucide:sparkles" class="absolute -right-10 -bottom-10 w-64 h-64 text-wedding-accent/5 group-hover:text-wedding-accent/10 transition-colors duration-700" />
          <h3 class="text-3xl font-serif text-wedding-accent mb-4 relative z-10">Dress Code</h3>
          <p class="text-xl font-light opacity-90 mb-2 relative z-10">Formal / Cocktail</p>
          <p class="opacity-70 leading-relaxed text-sm md:text-base relative z-10">Queremos que vengáis guapísimos, pero sobre todo, ¡cómodos para darlo todo en la pista de baile!</p>
        </div>

        <!-- Transporte -->
        <div class="bento-item opacity-0 translate-y-10 glass-dark rounded-3xl p-8 flex flex-col justify-center group relative overflow-hidden">
          <Icon name="lucide:bus" class="w-8 h-8 text-wedding-accent mb-4" />
          <h3 class="text-xl font-serif text-white mb-2">Transporte</h3>
          <p class="opacity-70 text-sm">Habrá servicio de autobuses desde Valencia centro (ida y vuelta).</p>
        </div>

        <!-- Alojamiento -->
        <div class="bento-item opacity-0 translate-y-10 glass-dark rounded-3xl p-8 flex flex-col justify-center group relative overflow-hidden">
          <Icon name="lucide:hotel" class="w-8 h-8 text-wedding-accent mb-4" />
          <h3 class="text-xl font-serif text-white mb-2">Alojamiento</h3>
          <p class="opacity-70 text-sm">Hoteles recomendados en la web con descuento para invitados.</p>
        </div>

        <!-- Playlist -->
        <div class="bento-item opacity-0 translate-y-10 glass-dark rounded-3xl p-8 md:col-span-3 flex flex-col md:flex-row items-center justify-between gap-6 group relative overflow-hidden">
          <div class="absolute inset-0 bg-linear-to-r from-wedding-accent/15 to-transparent transition-opacity duration-500"></div>
          <div>
            <h3 class="text-2xl font-serif text-white mb-2 flex items-center gap-3 hover:text-wedding-accent transition-colors">
              <Icon name="lucide:music" class="w-6 h-6 text-wedding-accent" /> Playlist Colaborativa
            </h3>
            <p class="opacity-70">Añade esas canciones que no pueden faltar en la fiesta.</p>
          </div>
          <a href="#" class="shrink-0 px-6 py-3 border border-wedding-accent/30 rounded-full text-sm uppercase tracking-widest hover:bg-wedding-accent hover:text-wedding-dark transition-all duration-300">
            Añadir Canciones
          </a>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const titleRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  
  ctx = gsap.context(() => {
    // Title animation
    if (titleRef.value) {
      gsap.to(titleRef.value, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.value,
          start: 'top 85%',
        }
      })
    }

    // Bento grid stagger
    const items = gsap.utils.toArray('.bento-item')
    gsap.to(items, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: items[0] as HTMLElement,
          start: 'top 85%',
        }
      }
    )
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>
