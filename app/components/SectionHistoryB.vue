<template>
  <section id="historia-b" class="relative py-24 md:py-32 text-wedding-light overflow-x-clip">
    <!-- Ambient gradient -->
    <div class="absolute inset-0 pointer-events-none">
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vmax] h-[120vmax] opacity-30"
        style="background: radial-gradient(circle, color-mix(in srgb, var(--color-wedding-accent) 8%, transparent) 0%, transparent 60%);"
      ></div>
    </div>

    <div class="relative z-10 max-w-3xl mx-auto px-4 md:px-8">
      <header ref="headerRef" class="text-center mb-12 md:mb-20 opacity-0 translate-y-10">
        <p class="text-[10px] md:text-xs font-sans tracking-[0.4em] uppercase opacity-50 mb-3">Nuestra Historia</p>
        <h2 class="text-4xl md:text-6xl font-serif text-wedding-accent">El camino hasta aquí</h2>
      </header>

      <!-- All text first -->
      <div ref="textRef" class="flex flex-col gap-12 md:gap-16 opacity-0 translate-y-10">
        <article v-for="(chapter, cIdx) in chapters" :key="cIdx" class="flex flex-col gap-5 md:gap-6">
          <div class="flex items-baseline gap-4 border-b border-wedding-accent/20 pb-3">
            <span class="font-serif italic text-wedding-accent text-3xl md:text-5xl leading-none">{{ chapter.year }}</span>
            <span class="font-sans italic text-wedding-accent/80 text-sm md:text-base">{{ chapter.label }}</span>
          </div>
          <p
            v-for="(paragraph, pIdx) in chapter.paragraphs"
            :key="pIdx"
            class="text-base md:text-lg leading-relaxed font-light opacity-85 text-center md:text-left"
          >
            {{ paragraph }}
          </p>
        </article>
      </div>
    </div>

    <!-- All photos at the bottom, stacked in a single column in order -->
    <div class="relative z-10 max-w-2xl mx-auto px-4 md:px-8 mt-16 md:mt-24">
      <div ref="photosRef" class="flex flex-col gap-5 md:gap-8 opacity-0 translate-y-10">
        <figure
          v-for="(src, idx) in allPhotos"
          :key="idx"
          class="glass-dark rounded-2xl overflow-hidden p-2 shadow-2xl cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.98]"
          @click="lightboxIndex = idx"
        >
          <NuxtImg
            :src="src"
            :alt="`Foto ${idx + 1}`"
            class="w-full h-auto object-cover rounded-xl block"
            loading="lazy"
          />
        </figure>
      </div>
    </div>

    <PhotoLightbox
      :photos="allPhotos"
      :start-index="lightboxIndex ?? 0"
      :open="lightboxIndex !== null"
      @close="lightboxIndex = null"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Chapter {
  year: string
  label: string
  paragraphs: string[]
  photos: string[]
}

// TODO: rellenar las 11 URLs de las fotos. Pueden ser rutas locales
// (`/images/historia/1.jpeg`) o URLs absolutas a cualquier CDN.
const chapters: Chapter[] = [
  {
    year: '2017',
    label: 'El comienzo',
    paragraphs: [
      'Todo comenzó en un lugar inesperado, como suelen empezar las mejores historias. En el año 2017, Ángela inició su etapa profesional en Primafrio, sin imaginar que aquel lugar de trabajo le presentaría a su compañero Paco, el cual llevaba allí unos años trabajando.',
      'Entre primeros saludos, ordenadores, un entorno cotidiano de trabajo, rutas de transporte, pequeñas conversaciones, y muchas risas, Paco y Ángela, a los años de trabajar allí, se fueron haciendo muy buenos amigos.',
      'Durante las vacaciones, aunque había distancia, se escribían y se mantenía el contacto. Se contaban muchos cosas, se reían siempre juntos y fue en ese entorno cotidiano donde todo comenzó.',
    ],
    photos: [
      '/images/story/0.jpeg', // foto 1
      '/images/story/1.jpeg', // foto 2
      '/images/story/2.jpeg', // foto 3
    ],
  },
  {
    year: '2021',
    label: 'Octubre · La primera cita',
    paragraphs: [
      'Pasaron un día mágico, pero cada uno se volvió a su casa con muchos nervios, sin pensar en aquel entonces, que a partir de ahí podría empezar algo...',
    ],
    photos: [
      '/images/story/3.jpeg', // foto 4
      '/images/story/4.jpeg', // foto 5
    ],
  },
  {
    year: '2021',
    label: '4 de diciembre · Cuando todo empezó',
    paragraphs: [
      'Ángela quería visitar la torre de la catedral, ya que nunca lo había hecho. Fue allí donde, en su trabajo, Paco la pilló viendo ese plan y le propuso ir.',
      'Pasaron un gran día, y fue el día en el en realidad todo se inició. Rodeados de historia y una vista inolvidable, tras esta cita comenzó una relación que día a día ha ido acompañada de ilusión, complicidad y sueños compartidos, y un amor que no ha dejado de crecer.',
      'Desde ese instante, nunca se han separado. Cada día juntos ha sido un capítulo más de una historia que ya estaba escrita con cariño, respeto y una conexión que no ha dejado de crecer nunca.',
    ],
    photos: [
      '/images/story/5.jpeg', // foto 6
      '/images/story/6.jpeg', // foto 7
      '/images/story/7.jpeg', // foto 8
    ],
  },
  {
    year: '2025',
    label: 'El sí',
    paragraphs: [
      'Con el tiempo esa conexión se ha hecho más fuerte, hasta que un día Paco, en un lugar donde ambos dieron sus primeros pasos ya como pareja, dio el paso definitivo para sellar su amor.',
      'Llegó el sí quiero.',
    ],
    photos: [
      '/images/story/8.jpeg', // foto 9
      '/images/story/9.jpeg', // foto 10
      '/images/story/10.jpeg', // foto 11
    ],
  },
]

const allPhotos = computed(() => chapters.flatMap((c) => c.photos.filter(Boolean)))

const lightboxIndex = ref<number | null>(null)

const headerRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)
const photosRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  ctx = gsap.context(() => {
    for (const el of [headerRef.value, textRef.value, photosRef.value]) {
      if (!el) continue
      gsap.to(el, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      })
    }
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>
