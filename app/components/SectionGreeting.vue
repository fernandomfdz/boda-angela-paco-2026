<template>
  <section v-if="guest" class="py-24 md:py-32 relative overflow-hidden" id="saludo">
    <div class="max-w-4xl mx-auto px-4 relative z-10 text-center">
      <div ref="contentRef" class="opacity-0 translate-y-10">
        <h2 class="text-3xl md:text-5xl font-serif text-wedding-accent mb-6">
          ¡Hola {{ guest.displayName }}!
        </h2>
        <div class="space-y-6 mb-10 max-w-2xl mx-auto">
          <p 
            v-for="(paragraph, index) in greetingMessage" 
            :key="index"
            class="text-lg md:text-xl font-light opacity-80 leading-relaxed"
          >
            {{ paragraph }}
          </p>
        </div>
        <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a
            href="#rsvp"
            class="glass-light px-8 py-4 rounded-full bg-wedding-dark/30 text-bold text-sm md:text-base border-2 border-wedding-accent/30 tracking-[0.2em] uppercase transition-all duration-300 hover:bg-wedding-dark hover:border-wedding-accent group flex items-center gap-3 drop-shadow-2xl"
          >
            Confirmar Asistencia
            <Icon name="lucide:arrow-down" class="w-5 h-5 transition-transform group-hover:translate-y-1" />
          </a>
          <a
            href="#comparte-wedibox"
            class="glass-light px-8 py-4 rounded-full bg-transparent text-bold text-sm md:text-base border-2 border-transparent tracking-[0.2em] uppercase transition-all duration-300 hover:bg-white/5 hover:border-white/10 group flex items-center gap-3 drop-shadow-2xl opacity-80 hover:opacity-100"
          >
            Compartir Fotos
            <Icon name="lucide:camera" class="w-5 h-5 transition-transform group-hover:scale-110" />
          </a>
        </div>
      </div>
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

const isPlural = computed(() => {
  if (!props.guest) return false
  return props.guest.names.length > 1 || props.guest.allowedGuests > 1
})

const greetingMessage = computed(() => {
  if (isPlural.value) {
    return [
      'Hemos preparado esta web con mucho cariño, en primer lugar, para invitaros formalmente a nuestro gran día.',
      'Aquí encontraréis un pedacito de nuestra historia y todos los detalles del evento. Queremos atesorar cada instante de ese día para siempre, por eso nos haría muchísima ilusión que uséis esta misma web para compartir con nosotros todas las fotos que saquéis durante la boda.',
      'Explorad las secciones, ayudadnos a organizarlo todo y, lo más importante: ¡confirmad vuestra asistencia para que podamos pasarlo en grande!'
    ]
  } else {
    return [
      'Hemos preparado esta web con mucho cariño, en primer lugar, para invitarte formalmente a nuestro gran día.',
      'Aquí encontrarás un pedacito de nuestra historia y todos los detalles del evento. Queremos atesorar cada instante de ese día para siempre, por eso nos haría muchísima ilusión que uses esta misma web para compartir con nosotros todas las fotos que saques durante la boda.',
      'Explora las secciones, ayúdanos a organizarlo todo y, lo más importante: ¡confirma tu asistencia para que podamos pasarlo en grande!'
    ]
  }
})

const contentRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  
  ctx = gsap.context(() => {
    if (contentRef.value) {
      gsap.to(contentRef.value, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contentRef.value,
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
