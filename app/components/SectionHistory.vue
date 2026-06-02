<template>
  <section id="historia" class="relative py-24 md:py-32 text-wedding-light overflow-x-clip">
    <!-- Ambient gradient -->
    <div class="absolute inset-0 pointer-events-none">
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vmax] h-[120vmax] opacity-30"
        style="background: radial-gradient(circle, color-mix(in srgb, var(--color-wedding-accent) 8%, transparent) 0%, transparent 60%);"
      ></div>
    </div>

    <div class="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
      <header ref="headerRef" class="text-center mb-12 md:mb-20 opacity-0 translate-y-10">
        <p class="text-[10px] md:text-xs font-sans tracking-[0.4em] uppercase opacity-50 mb-3">Nuestra Historia</p>
        <h2 class="text-4xl md:text-6xl font-serif text-wedding-accent">El camino hasta aquí</h2>
      </header>

      <div ref="contentRef" class="flex flex-col gap-16 md:gap-24 opacity-0 translate-y-10">
        <article v-for="(chapter, cIdx) in chapters" :key="cIdx" class="flex flex-col gap-6 md:gap-10">

          <div class="flex items-baseline gap-4 border-b border-wedding-accent/20 pb-3">
            <span class="font-serif italic text-wedding-accent text-3xl md:text-5xl leading-none">{{ chapter.year }}</span>
            <span class="font-sans italic text-wedding-accent/80 text-sm md:text-base">{{ chapter.label }}</span>
          </div>

          <!-- Mobile: interleaved photo / paragraph / photo / paragraph -->
          <div class="md:hidden flex flex-col gap-6">
            <template v-for="i in Math.max(chapter.photos.length, chapter.paragraphs.length)" :key="i">
              <figure
                v-if="chapter.photos[i - 1]"
                class="glass-dark rounded-2xl overflow-hidden p-1.5 shadow-2xl cursor-pointer transition-transform active:scale-[0.98] mx-auto w-full max-w-[18rem]"
                @click="openLightbox(cIdx, i - 1)"
              >
                <NuxtImg
                  :src="chapter.photos[i - 1]"
                  :alt="`${chapter.label} - foto ${i}`"
                  class="w-full max-h-[55vh] object-cover rounded-xl block"
                  loading="lazy"
                />
              </figure>
              <p
                v-if="chapter.paragraphs[i - 1]"
                class="text-base leading-relaxed font-light opacity-85 text-center"
              >
                {{ chapter.paragraphs[i - 1] }}
              </p>
            </template>
          </div>

          <!-- Desktop: two columns, photos and text alternate sides per chapter -->
          <div class="hidden md:grid md:grid-cols-2 md:gap-12 md:items-start">
            <div
              class="flex flex-col gap-4"
              :class="cIdx % 2 === 0 ? 'md:order-1' : 'md:order-2'"
            >
              <figure
                v-for="(src, pIdx) in chapter.photos"
                :key="pIdx"
                class="glass-dark rounded-2xl overflow-hidden p-2 shadow-2xl cursor-pointer transition-transform hover:scale-[1.01]"
                @click="openLightbox(cIdx, pIdx)"
              >
                <NuxtImg
                  :src="src"
                  :alt="`${chapter.label} - foto ${pIdx + 1}`"
                  class="w-full h-auto object-cover rounded-xl block"
                  loading="lazy"
                />
              </figure>
            </div>
            <div
              class="flex flex-col gap-6 md:sticky md:top-24 self-start"
              :class="cIdx % 2 === 0 ? 'md:order-2' : 'md:order-1'"
            >
              <p
                v-for="(paragraph, pIdx) in chapter.paragraphs"
                :key="pIdx"
                class="text-lg leading-relaxed font-light opacity-85"
              >
                {{ paragraph }}
              </p>
            </div>
          </div>

        </article>
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

const photo = (n: number) => `/images/historia/${n}.jpeg`

const lastPhoto = () => `/images/story/4/1.jpeg`

const chapters: Chapter[] = [
  {
    year: '2017',
    label: 'El comienzo',
    paragraphs: [
      'Todo comenzó en un lugar inesperado, como suelen empezar las mejores historias. En el año 2017, Ángela inició su etapa profesional en Primafrio, sin imaginar que aquel lugar de trabajo le presentaría a su compañero Paco, el cual llevaría allí unos años trabajando.',
      'Entre primeros saludos, ordenadores, un entorno cotidiano de trabajo, rutas de transporte, pequeñas conversaciones, y muchas risas, Paco y Ángela, a los años de trabajar allí, se fueron haciendo muy buenos amigos.',
      'Se iban de vacaciones, se escribían y se contaban muchas cosas, se reían siempre juntos, fue en ese entorno cotidiano pero a la vez, lleno de un destino que aún no conocían.',
    ],
    photos: [photo(1), photo(2), photo(3)],
  },
  {
    year: '2021',
    label: 'Octubre · La primera cita',
    paragraphs: [
      '2021 aquí fue cuando realmente todo empezó. Paco propuso a Ángela ir a Cartagena, y fue allí donde surgió su primera cita.',
      'Pasaron un día mágico, pero cada uno se volvió a su casa con muchos nervios, sin pensar en aquel entonces, que a partir de ahí podrían empezar algo...',
    ],
    photos: [photo(4), photo(5)],
  },
  {
    year: '2021',
    label: '4 de diciembre · Cuando todo empezó',
    paragraphs: [
      'Ángela quería visitar la torre de la catedral, nunca lo había hecho. Fue allí donde, en su trabajo, Paco la pilló viéndolo y le propuso ir.',
      'Pasaron un gran día, y fue el día que cambiaría sus vidas. Rodeados de historia y una vista inolvidable, tras esta cita comenzó una relación que día a día ha ido acompañada de ilusión, complicidad y sueños compartidos, y un amor que no ha dejado de crecer.',
      'Desde ese instante, nunca se han separado. Cada día juntos ha sido un capítulo más de una historia que ya estaba escrita con cariño, respeto y una conexión que no ha dejado de crecer nunca.',
      'Con el tiempo esa conexión se ha hecho más fuerte, hasta que un día se dieron cuenta de que esta historia merecía ser para siempre.',
    ],
    photos: [photo(6), photo(7), photo(8), photo(9)],
  },
  {
    year: '2025',
    label: 'El sí',
    paragraphs: [
      'Y un día, en un lugar mágico, justo al inicio de toda esta historia... ese día llegó.',
      'Llegó el sí quiero.',
    ],
    photos: [photo(10), photo(11), lastPhoto()],
  },
]

// Flat list of all photos across chapters, in order, for lightbox navigation.
const allPhotos = computed(() => chapters.flatMap((c) => c.photos))

// Cumulative offset of each chapter's first photo within `allPhotos`.
const chapterOffsets = chapters.reduce<number[]>((acc, ch, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1]! + chapters[i - 1]!.photos.length)
  return acc
}, [])

const lightboxIndex = ref<number | null>(null)
const openLightbox = (chapterIdx: number, photoIdx: number) => {
  lightboxIndex.value = (chapterOffsets[chapterIdx] ?? 0) + photoIdx
}

const headerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  ctx = gsap.context(() => {
    if (headerRef.value) {
      gsap.to(headerRef.value, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: headerRef.value, start: 'top 85%' },
      })
    }
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
