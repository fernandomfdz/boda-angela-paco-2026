<template>
  <section class="py-32 relative overflow-hidden" id="fotos">
    <div class="max-w-6xl mx-auto px-4 relative z-10">
      
      <div ref="titleRef" class="text-center mb-16 opacity-0 translate-y-10">
        <h2 class="text-4xl md:text-6xl font-serif text-wedding-accent mb-4">La Galería</h2>
        <p class="text-lg md:text-xl font-sans tracking-widest uppercase opacity-70">Momentos para recordar</p>
      </div>

      <!-- Masonry Parallax Grid -->
      <div ref="gridContainer" class="flex gap-4 md:gap-6 h-[800px] md:h-[600px] overflow-hidden justify-center relative mask-image-bottom-fade">
        
        <!-- Left Column -->
        <div class="flex flex-col gap-4 md:gap-6 w-1/3 max-w-[300px] parallax-col" data-speed="0.8">
          <div class="w-full aspect-[3/4] rounded-2xl overflow-hidden glass-light p-1 group">
             <div class="w-full h-full bg-gradient-to-br from-white/10 to-transparent rounded-xl flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div class="w-full aspect-square rounded-2xl overflow-hidden glass-light p-1 group">
             <div class="w-full h-full bg-gradient-to-bl from-white/10 to-transparent rounded-xl flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div class="w-full aspect-[3/4] rounded-2xl overflow-hidden glass-light p-1 group">
             <div class="w-full h-full bg-gradient-to-tr from-white/10 to-transparent rounded-xl flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>

        <!-- Center Column -->
        <div class="flex flex-col gap-4 md:gap-6 w-1/3 max-w-[300px] parallax-col -mt-24" data-speed="1.2">
          <div class="w-full aspect-square rounded-2xl overflow-hidden glass-light p-1 group">
             <div class="w-full h-full bg-gradient-to-b from-white/10 to-transparent rounded-xl flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div class="w-full aspect-[3/4] rounded-2xl overflow-hidden glass-light p-1 group">
             <div class="w-full h-full bg-gradient-to-t from-white/10 to-transparent rounded-xl flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div class="w-full aspect-video rounded-2xl overflow-hidden glass-light p-1 group">
             <div class="w-full h-full bg-gradient-to-tl from-white/10 to-transparent rounded-xl flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="flex flex-col gap-4 md:gap-6 w-1/3 max-w-[300px] parallax-col" data-speed="0.9">
          <div class="w-full aspect-[4/3] rounded-2xl overflow-hidden glass-light p-1 group">
             <div class="w-full h-full bg-gradient-to-tr from-white/10 to-transparent rounded-xl flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div class="w-full aspect-square rounded-2xl overflow-hidden glass-light p-1 group">
             <div class="w-full h-full bg-gradient-to-bl from-white/10 to-transparent rounded-xl flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div class="w-full aspect-[3/4] rounded-2xl overflow-hidden glass-light p-1 group">
             <div class="w-full h-full bg-gradient-to-br from-white/10 to-transparent rounded-xl flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>
      </div>

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
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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
        }
      })
    }

    const columns = gsap.utils.toArray('.parallax-col')
    columns.forEach((col: any) => {
      const speed = parseFloat(col.dataset.speed || '1')
      gsap.to(col, {
        y: () => `${-150 * speed}px`,
        ease: 'none',
        scrollTrigger: {
          trigger: gridContainer.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      })
    })
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>
