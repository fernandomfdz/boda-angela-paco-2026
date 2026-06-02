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
        <div class="bento-item opacity-0 translate-y-10 glass-dark rounded-3xl p-8 md:col-span-1 md:row-span-1 flex flex-col justify-center relative overflow-hidden group">
          <Icon name="lucide:sparkles" class="absolute -right-10 -bottom-10 w-64 h-64 text-wedding-accent/5 group-hover:text-wedding-accent/10 transition-colors duration-700" />
          <h3 class="text-3xl font-serif text-wedding-accent mb-4 relative z-10">Dress Code</h3>
          <p class="opacity-80 leading-relaxed text-sm md:text-base relative z-10">Queremos que vengáis guapísimos, pero sobre todo, ¡cómodos para darlo todo en la pista de baile hasta el amanecer! El único requisito es que traigáis ganas de bailar (el color blanco se lo dejamos en exclusiva a la novia).</p>
        </div>

        <!-- Regalos -->
        <a href="#regalos" class="bento-item opacity-0 translate-y-10 glass-dark rounded-3xl p-8 flex flex-col justify-start group relative overflow-hidden hover:bg-wedding-accent/5 transition-colors duration-300">
          <h3 class="text-3xl font-serif text-wedding-accent mb-4 relative z-10">Regalos</h3>
          <p class="opacity-80 leading-relaxed text-sm md:text-base relative z-10 mb-3">Vuestra compañía es nuestro mejor regalo, pero si queréis tener un detalle, aquí os dejamos el número de cuenta.</p>
          <span class="mt-auto text-xs uppercase tracking-widest text-wedding-accent inline-flex items-center gap-2">
            Ver detalles
            <Icon name="lucide:arrow-down" class="w-4 h-4 transition-transform group-hover:translate-y-1" />
          </span>
        </a>

        <!-- Compartir Fotos -->
        <a href="#compartir-fotos" class="bento-item opacity-0 translate-y-10 glass-dark rounded-3xl p-8 flex flex-col justify-start group relative overflow-hidden hover:bg-wedding-accent/5 transition-colors duration-300">
          <h3 class="text-3xl font-serif text-wedding-accent mb-4 relative z-10">Compartir Fotos</h3>
          <p class="opacity-80 leading-relaxed text-sm md:text-base relative z-10 mb-3">Sube las fotos de la boda (ese día o después, ¡pero no te olvides de hacerlo!) y déjanos verlas todas juntas.</p>
          <span class="mt-auto text-xs uppercase tracking-widest text-wedding-accent inline-flex items-center gap-2">
            Subir fotos
            <Icon name="lucide:arrow-down" class="w-4 h-4 transition-transform group-hover:translate-y-1" />
          </span>
        </a>

        <!-- Playlist -->
        <div class="bento-item opacity-0 translate-y-10 glass-dark rounded-3xl md:col-span-3 flex flex-col items-center justify-between  group relative overflow-hidden bg-linear-to-r from-wedding-accent/15 to-transparent">
          <div class="flex flex-col gap-10 md:gap-6 items-start p-8">
            <div>
              <h3 class="text-3xl font-serif mb-2 flex items-center gap-3 text-wedding-accent transition-colors">
                Playlist Colaborativa
              </h3>
              <p class="opacity-70">Añade esas canciones que no pueden faltar en la fiesta.</p>
            </div>
            <a target="_blank" rel="noopener noreferrer" href="https://open.spotify.com/playlist/4j6WpzfBR821UqSIddbXZc?si=e14df2fb6b0d4e6f&pt=ce6f474fcdc626cc8b2452aaaddf1fb1" class="shrink-0 px-6 py-3 border border-wedding-accent/30 rounded-full text-sm uppercase tracking-widest hover:bg-wedding-accent hover:text-wedding-dark transition-all duration-300">
              Añadir Canciones
            </a>
          </div>

          <div class="w-full col-span-3 mx-auto">
            <iframe class="w-full" data-testid="embed-iframe" src="https://open.spotify.com/embed/playlist/4j6WpzfBR821UqSIddbXZc?utm_source=generator&theme=0" width="100%" height="650" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
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

const titleRef = ref<HTMLElement | null>(null)
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

    const items = gsap.utils.toArray('.bento-item')
    gsap.to(items, {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: items[0] as HTMLElement,
        start: 'top 85%',
      },
    })
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>
