<template>
  <section class="py-32 relative" id="regalos">
    <div class="max-w-3xl mx-auto px-4 relative z-10">
      <div ref="contentRef" class="opacity-0 translate-y-10 text-center">
        <h2 class="text-4xl md:text-6xl font-serif text-wedding-accent mb-4">Regalos</h2>
        <p class="text-lg md:text-xl font-light opacity-80 leading-relaxed max-w-2xl mx-auto mb-10">
          Vuestra compañía en este día es nuestro mejor regalo, pero si deseáis tener un detalle con nosotros y contribuir a nuestra nueva etapa juntos, ponemos a vuestra disposición este número de cuenta.
        </p>

        <div class="glass-dark rounded-3xl p-4 md:p-10 inline-flex flex-col gap-4 items-center w-full max-w-xl mx-auto">
          <p class="text-xs md:text-sm uppercase tracking-[0.3em] opacity-60">IBAN</p>
          <p class="font-sans text-md md:text-3xl tracking-wide select-all break-all">{{ iban }}</p>
          <button
            type="button"
            @click="copyIban"
            class="mt-2 px-6 py-3 cursor-pointer rounded-full border border-wedding-accent/30 text-sm uppercase tracking-widest transition-all duration-300 hover:bg-wedding-accent hover:text-wedding-dark inline-flex items-center gap-2"
          >
            <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="w-4 h-4" />
            {{ copied ? 'Copiado' : 'Copiar IBAN' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const iban = 'ES75 3005 0076 2223 3481 3017'
const copied = ref(false)

const copyIban = async () => {
  try {
    await navigator.clipboard.writeText(iban.replace(/\s+/g, ''))
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    copied.value = false
  }
}

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
        scrollTrigger: { trigger: contentRef.value, start: 'top 85%' },
      })
    }
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>
