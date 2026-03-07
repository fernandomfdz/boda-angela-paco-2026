<template>
  <section class="py-32 relative overflow-hidden" id="historia">
    <div class="max-w-5xl mx-auto px-4 relative z-10">
      
      <div ref="titleRef" class="text-center mb-24 opacity-0 translate-y-10">
        <h2 class="text-4xl md:text-6xl font-serif text-wedding-accent mb-4">Nuestra Historia</h2>
        <p class="text-lg md:text-xl font-sans tracking-widest uppercase opacity-70">El inicio de todo</p>
      </div>

      <div class="relative pb-20">
        <!-- Progressive Timeline Line -->
        <div class="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2"></div>
        <div ref="timelineLine" class="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-wedding-accent -translate-x-1/2 origin-top scale-y-0"></div>

        <!-- Milestone 1 -->
        <div class="milestone-item relative flex flex-col md:flex-row justify-between items-center mb-32 group">
          <div class="hidden md:flex w-5/12 justify-end pr-12">
            <div class="image-wrapper opacity-0 translate-y-10 w-full max-w-sm rounded-xl overflow-hidden glass-dark p-2 rotate-[2deg] transition-transform duration-500 hover:rotate-0 hover:scale-105">
              <!-- Placeholder for an image -->
              <div class="aspect-square bg-gradient-to-tr from-wedding-dark to-white/10 rounded-lg w-full flex items-center justify-center">
                 <Icon name="lucide:camera" class="w-12 h-12 opacity-20" />
              </div>
            </div>
          </div>
          
          <div class="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-wedding-dark border-2 border-wedding-accent -translate-x-1/2 z-10 milestone-dot opacity-0 scale-0"></div>
          
          <div class="w-full pl-16 md:pl-0 md:w-5/12 md:text-left flex flex-col items-start pt-8 md:pt-0">
            <div class="text-wrapper opacity-0 translate-y-10">
              <span class="text-wedding-accent font-serif text-3xl italic">2018</span>
              <h3 class="text-2xl md:text-4xl font-serif mt-2 mb-4">Nos Conocimos</h3>
              <p class="opacity-80 leading-relaxed font-light text-lg">Una tarde de verano cualquiera, una mirada que lo cambió todo. Desde ese día supimos que nuestras vidas seguirían el mismo camino, casi sin darnos cuenta.</p>
            </div>
          </div>
        </div>

        <!-- Milestone 2 -->
        <div class="milestone-item relative flex flex-col md:flex-row-reverse justify-between items-center mb-32 group">
          <div class="hidden md:flex w-5/12 justify-start pl-12">
            <div class="image-wrapper opacity-0 translate-y-10 w-full max-w-sm rounded-xl overflow-hidden glass-dark p-2 rotate-[-3deg] transition-transform duration-500 hover:rotate-0 hover:scale-105">
              <div class="aspect-square bg-gradient-to-tl from-wedding-dark to-white/10 rounded-lg w-full flex items-center justify-center">
                <Icon name="lucide:plane" class="w-12 h-12 opacity-20" />
              </div>
            </div>
          </div>
          
          <div class="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-wedding-dark border-2 border-wedding-accent -translate-x-1/2 z-10 milestone-dot opacity-0 scale-0"></div>
          
          <div class="w-full pl-16 md:pl-12 md:w-5/12 md:text-right flex flex-col md:items-end items-start pt-8 md:pt-0">
            <div class="text-wrapper opacity-0 translate-y-10">
              <span class="text-wedding-accent font-serif text-3xl italic">2021</span>
              <h3 class="text-2xl md:text-4xl font-serif mt-2 mb-4">El Primer Viaje</h3>
              <p class="opacity-80 leading-relaxed font-light text-lg">Esa escapada a la nieve donde confirmamos que éramos el equipo perfecto. Risas, frío y muchas anécdotas inolvidables.</p>
            </div>
          </div>
        </div>

        <!-- Milestone 3 -->
        <div class="milestone-item relative flex flex-col md:flex-row justify-between items-center group">
          <div class="hidden md:flex w-5/12 justify-end pr-12">
            <div class="image-wrapper opacity-0 translate-y-10 w-full max-w-sm rounded-xl overflow-hidden glass-dark p-2 rotate-[1deg] transition-transform duration-500 hover:rotate-0 hover:scale-105">
              <div class="aspect-[4/3] bg-gradient-to-br from-wedding-dark to-white/10 rounded-lg w-full flex items-center justify-center">
                <Icon name="lucide:heart" class="w-12 h-12 opacity-20" />
              </div>
            </div>
          </div>
          
          <div class="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-wedding-dark border-2 border-wedding-accent -translate-x-1/2 z-10 milestone-dot opacity-0 scale-0"></div>
          
          <div class="w-full pl-16 md:pl-0 md:w-5/12 md:text-left pt-8 md:pt-0">
            <div class="text-wrapper opacity-0 translate-y-10">
              <span class="text-wedding-accent font-serif text-3xl italic">2024</span>
              <h3 class="text-2xl md:text-4xl font-serif mt-2 mb-4">El "Sí, quiero"</h3>
              <p class="opacity-80 leading-relaxed font-light text-lg">En un rincón secreto frente al mar, la pregunta más importante encontró la respuesta que nos ha traído hasta este momento mágico.</p>
            </div>
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
const timelineLine = ref<HTMLElement | null>(null)

let ctx: gsap.Context

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  
  ctx = gsap.context(() => {
    // Title intro
    if (titleRef.value) {
      gsap.to(titleRef.value, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.value,
          start: 'top 80%',
        }
      })
    }

    // Timeline Line Progress (Scrub implementation for strict control over scroll)
    if (timelineLine.value) {
      gsap.to(timelineLine.value, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: timelineLine.value.parentElement,
          start: 'top 50%',
          end: 'bottom 50%',
          scrub: true
        }
      })
    }

    // Milestone Reveals (Staggered fade-up)
    const items = gsap.utils.toArray('.milestone-item')
    items.forEach((item: any) => {
      const dot = item.querySelector('.milestone-dot')
      const img = item.querySelector('.image-wrapper')
      const text = item.querySelector('.text-wrapper')

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top 75%',
        }
      })

      if (dot) {
        tl.to(dot, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' })
      }
      
      const elementsToAnimate = [img, text].filter(Boolean)
      if(elementsToAnimate.length > 0) {
        tl.to(elementsToAnimate, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2, // Time between image and text reveal
          ease: 'power2.out'
        }, '-=0.2') // Overlap slightly with dot animation
      }
    })
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>
