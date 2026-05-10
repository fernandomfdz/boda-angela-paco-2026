<template>
  <section ref="sectionRef" id="historia" class="relative bg-wedding-dark text-wedding-light">
    <!-- Sticky child handles the scroll-lock natively (no GSAP pin → no transform jitter) -->
    <div class="sticky top-0 h-dvh w-full overflow-hidden flex flex-col">

      <!-- Ambient gradient -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-wedding-dark to-transparent z-20"></div>
        <div class="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-wedding-dark to-transparent z-20"></div>
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vmax] h-[120vmax] opacity-40"
          style="background: radial-gradient(circle, color-mix(in srgb, var(--color-wedding-accent) 8%, transparent) 0%, transparent 60%);"
        ></div>
      </div>

      <!-- Persistent header (year + chapter label + progress) -->
      <header class="relative z-30 pt-8 md:pt-12 px-6 md:px-12 shrink-0 pointer-events-none">
        <div class="max-w-7xl mx-auto flex items-end justify-between gap-4 md:gap-12">
          <div class="flex flex-col gap-1 flex-1 min-w-0">
            <p class="text-[10px] md:text-xs font-sans tracking-[0.4em] uppercase opacity-50">Nuestra Historia</p>
            <div class="relative h-7 md:h-9 mt-1">
              <p
                v-for="(scene, i) in scenes"
                :key="`label-${i}`"
                :ref="el => { labelRefs[i] = el as HTMLElement }"
                class="absolute inset-0 text-base md:text-2xl font-serif italic text-wedding-accent/95 truncate"
                style="will-change: opacity;"
              >
                {{ scene.label }}
              </p>
            </div>
          </div>
          <div class="relative h-12 md:h-20 w-24 md:w-48 shrink-0">
            <div
              v-for="(scene, i) in scenes"
              :key="`year-${i}`"
              :ref="el => { yearRefs[i] = el as HTMLElement }"
              class="absolute right-0 top-0 font-serif italic text-wedding-accent text-5xl md:text-7xl leading-none"
              style="will-change: opacity;"
            >
              {{ scene.year }}
            </div>
          </div>
        </div>
        <div class="max-w-7xl mx-auto mt-4 md:mt-6 relative">
          <div class="h-px bg-white/10 w-full"></div>
          <div ref="progressBar" class="absolute top-0 left-0 h-px w-full bg-wedding-accent origin-left scale-x-0" style="will-change: transform;"></div>
        </div>
      </header>

      <!-- Scenes -->
      <div class="relative flex-1 min-h-0 z-10">
        <div
          v-for="(scene, i) in scenes"
          :key="`scene-${i}`"
          :ref="el => { sceneRefs[i] = el as HTMLElement }"
          class="scene absolute inset-0 px-4 md:px-12 py-4 md:py-8 flex items-center"
          style="will-change: opacity;"
        >
          <div class="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16 items-center">

            <!-- Image collage -->
            <div
              :ref="el => { collageRefs[i] = el as HTMLElement }"
              class="image-collage relative w-full aspect-[5/4] max-h-[42vh] mx-auto order-1
                     md:w-auto md:h-[55vh] md:max-h-none md:aspect-[4/5]"
            >
              <div
                v-for="(img, imgIdx) in scene.images"
                :key="imgIdx"
                :ref="el => { imageRefs[`${i}-${imgIdx}`] = el as HTMLElement }"
                class="image-tile absolute glass-dark rounded-xl overflow-hidden p-1.5 md:p-2 shadow-2xl"
                :style="img.position"
              >
                <NuxtImg
                  :src="img.src"
                  :alt="`${scene.label} - ${imgIdx + 1}`"
                  class="w-full h-full object-cover rounded-lg block"
                  loading="lazy"
                />
              </div>
            </div>

            <!-- Text panel -->
            <div class="text-panel order-2 grid">
              <p
                v-for="(fragment, fIdx) in scene.fragments"
                :key="fIdx"
                :ref="el => { fragmentRefs[`${i}-${fIdx}`] = el as HTMLElement }"
                class="fragment col-start-1 row-start-1 text-base md:text-2xl leading-relaxed font-light"
                style="will-change: opacity, transform;"
              >
                {{ fragment }}
              </p>
            </div>

          </div>
        </div>
      </div>

      <!-- Scroll hint (visible only at the very start) -->
      <div ref="scrollHint" class="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 pointer-events-none">
        <span class="text-[9px] md:text-[10px] tracking-[0.3em] uppercase opacity-50">Sigue</span>
        <span class="text-lg opacity-40 animate-bounce">↓</span>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* On mobile, the collage is too small to show 4 overlapping photos at once,
   so each image fills the container and we cycle through them per fragment.
   `!important` is needed to override the inline `:style="img.position"` that
   drives the desktop collage layout. */
@media (max-width: 767px) {
  .image-tile {
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100% !important;
    height: 100% !important;
    aspect-ratio: auto !important;
  }
}
</style>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * SectionHistory — experiencia narrativa con scroll lock.
 *
 * Implementación:
 *   El "scroll lock" es nativo del navegador via `position: sticky` en el hijo
 *   directo (no usamos pin de GSAP, porque combinado con `overflow-x: hidden` en
 *   body genera jitter de subpíxel en macOS).
 *   La altura de la <section> se calcula en JS (~9 viewports) para dar suficiente
 *   distancia de scroll. ScrollTrigger lee el progreso desde top-top a bottom-bottom
 *   y dirige una timeline scrub que cambia el contenido del hijo sticky.
 *
 * Cómo añadir más imágenes a una escena:
 *   Añade un objeto a `images` con `position` (top/left/right/bottom/width/aspectRatio
 *   en %), `rotation` (grados) y `z` (z-index). Las imágenes se posicionan en `.image-collage`.
 *
 * Cómo añadir / dividir texto:
 *   Cada string de `fragments` se muestra como un fragmento que aparece y desaparece
 *   con scroll. Cuanto más largo el array, más larga será la escena (y por tanto
 *   más alta la sección).
 */

interface SceneImage {
  src: string
  position: Record<string, string>
  rotation: number
  z: number
  /**
   * Mobile only. When this image is the active one in the cycle, the collage
   * container animates to a portrait (4/5) frame instead of the default
   * landscape (5/4) frame, giving prominence to vertical photos. Has no
   * effect on desktop (the collage layout is unchanged).
   */
  tall?: boolean
}

interface Scene {
  year: string
  label: string
  fragments: string[]
  images: SceneImage[]
}

const scenes: Scene[] = [
  // — Capítulo 1 · 2017 ———————————————————————————————————————————
  {
    year: '2017',
    label: 'El comienzo',
    fragments: [
      'Todo comenzó en un lugar inesperado, como suelen empezar las mejores historias.',
      'En el año 2017, Ángela inició su etapa profesional en Primafrio, sin imaginar que aquel lugar de trabajo le presentaría a su compañero Paco, el cual llevaría allí unos años trabajando.',
      'Entre primeros saludos, ordenadores, un entorno cotidiano de trabajo, rutas de transporte, pequeñas conversaciones, y muchas risas, Paco y Ángela, a los años de trabajar allí, se fueron haciendo muy buenos amigos.',
      'Se iban de vacaciones, se escribían y se contaban muchas cosas, se reían siempre juntos, fue en ese entorno cotidiano pero a la vez, lleno de un destino que aún no conocían.',
    ],
    images: [
      { src: '/images/story/1/1.jpeg', position: { top: '4%',  left:  '4%',  width: '48%', aspectRatio: '3/4' }, rotation: -5, z: 2 },
      { src: '/images/story/1/2.jpeg', position: { top: '8%',  right: '6%',  width: '42%', aspectRatio: '1/1' }, rotation:  4, z: 1 },
      { src: '/images/story/1/3.jpeg', position: { bottom: '4%',  left:  '22%', width: '50%', aspectRatio: '4/3' }, rotation:  2, z: 3 },
      { src: '/images/story/1/4.jpeg', position: { bottom: '32%', right: '6%',  width: '34%', aspectRatio: '3/4' }, rotation: -8, z: 0, tall: true },
    ],
  },
  // — Capítulo 2 · Octubre 2021 ———————————————————————————————————
  {
    year: '2021',
    label: 'Octubre · La primera cita',
    fragments: [
      '2021 aquí fue cuando realmente todo empezó. Paco, propuso a Ángela ir a Cartagena, y fue allí, donde surgió su primera cita.',
      'Pasaron un día mágico, pero cada uno se volvió a su casa con muchos nervios, sin pensar en aquel entonces, que a partir de ahí podrían empezar algo...',
    ],
    images: [
      { src: '/images/story/2/1.jpeg', position: { top: '6%',  left:  '4%',  width: '52%', aspectRatio: '4/3' }, rotation:  3, z: 1 },
      { src: '/images/story/2/2.jpeg', position: { top: '4%',  right: '6%',  width: '38%', aspectRatio: '3/4' }, rotation: -5, z: 2 },

    ],
  },
  // — Capítulo 3 · 4 de diciembre 2021 ———————————————————————————
  {
    year: '2021',
    label: '4 de diciembre · Cuando todo empezó',
    fragments: [
      'Ángela quería visitar la torre de la catedral, nunca lo había hecho, fue allí donde en su trabajo, Paco la pillo viéndolo, y le propuso ir.',
      'Pasaron un gran día, y fue el día que que cambiaría sus vidas.',
      'Rodeados de historia y una vista inolvidable, tras esta cita comenzó una relación, que día a día ha ido acompañada de ilusión, complicidad y sueños compartidos, y un amor que día a día ha ido creciendo.',
      'Desde ese instante, nunca se han separado.',
      'Cada día juntos ha sido un capítulo más de una historia',
      'Una historia, que ya estaba escrita con cariño, respeto y una conexión que no ha dejado de crecer nunca.',
      'Con el tiempo esa conexión se ha hecho mas fuerte.',
      'Hasta que un día se dieron cuenta que esta historia merecía ser para siempre.',
    ],
    images: [
      { src: '/images/story/3/1.jpeg', position: { top: '5%',  left:  '12%', width: '50%', aspectRatio: '3/4' }, rotation: -4, z: 2 },
      { src: '/images/story/3/2.jpeg', position: { top: '14%', right: '4%',  width: '40%', aspectRatio: '4/3' }, rotation:  5, z: 1 },
      { src: '/images/story/3/3.jpeg', position: { bottom: '20%', left:  '4%', width: '34%', aspectRatio: '1/1' }, rotation: -6, z: 0 },
      { src: '/images/story/3/4.jpeg', position: { bottom: '4%', right: '14%', width: '50%', aspectRatio: '4/5' }, rotation: 3, z: 3 },
      { src: '/images/story/3/5.jpeg', position: { top: '5%',  left:  '12%', width: '50%', aspectRatio: '3/4' }, rotation: -4, z: 2 },
      { src: '/images/story/3/6.jpeg', position: { top: '14%', right: '4%',  width: '40%', aspectRatio: '4/3' }, rotation:  5, z: 1 },
      { src: '/images/story/3/7.jpeg', position: { bottom: '20%', left:  '4%', width: '34%', aspectRatio: '1/1' }, rotation: -6, z: 0 },
      { src: '/images/story/3/8.jpeg', position: { bottom: '4%',  right: '14%', width: '50%', aspectRatio: '4/5' }, rotation:  3, z: 3 },
    ],
  },
  // — Capítulo 4 · 2025 ——————————————————————————————————————————
  // TODO: cuando el novio tenga el texto del "sí" completo, sustituir el fragment placeholder.
  {
    year: '2025',
    label: 'El sí',
    fragments: [
      'Y un día, en un lugar mágico, justo al inicio de toda esta historia... Ese día llegó.',
      'Llegó el si quiero.',
    ],
    images: [
      { src: '/images/story/4/1.jpeg', position: { top: '6%',  left:  '20%', width: '60%', aspectRatio: '1/1' }, rotation:  0, z: 2 },
      { src: '/images/story/4/2.jpeg', position: { top: '34%', right: '2%',  width: '28%', aspectRatio: '3/4' }, rotation:  6, z: 1, tall: true },
    ],
  },
]

const immersive = useImmersiveMode()

const sectionRef = ref<HTMLElement | null>(null)
const progressBar = ref<HTMLElement | null>(null)
const scrollHint = ref<HTMLElement | null>(null)

const sceneRefs: (HTMLElement | null)[] = []
const yearRefs: (HTMLElement | null)[] = []
const labelRefs: (HTMLElement | null)[] = []
const fragmentRefs: Record<string, HTMLElement | null> = {}
const imageRefs: Record<string, HTMLElement | null> = {}
const collageRefs: (HTMLElement | null)[] = []

// Aspect-ratio + max-height pairs used on mobile to animate the collage
// frame when a `tall: true` image cycles into focus.
const MOBILE_FRAME_DEFAULT = { aspectRatio: 0.8, maxHeight: '35vh' } // 5/4 landscape
const MOBILE_FRAME_TALL = { aspectRatio: 0.8, maxHeight: '45vh' }     // 4/5 portrait

let ctx: gsap.Context | null = null

// Each fragment occupies ~1.4 timeline units (fade in + hold + fade out),
// each scene-to-scene transition adds ~0.7 units.
const totalFragments = scenes.reduce((sum, s) => sum + s.fragments.length, 0)
const totalUnits = totalFragments * 1.4 + (scenes.length - 1) * 0.7
// 45vh per timeline unit → roughly one viewport per fragment of scroll.
const SECTION_HEIGHT_VH = Math.ceil(totalUnits * 45 + 100)

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  // Apply the section height that drives the scroll-lock duration.
  // The +100vh accounts for the sticky child sitting in the viewport.
  if (sectionRef.value) {
    sectionRef.value.style.height = `${SECTION_HEIGHT_VH}vh`
  }

  // Wait one frame so refs from v-for callbacks are populated
  requestAnimationFrame(() => {
    if (!sectionRef.value) return

    // On mobile, only one image of each scene is shown at a time and they
    // cycle as fragments advance (so all photos get a turn in the spotlight).
    // On desktop, the full collage is shown.
    const isMobile = window.matchMedia('(max-width: 767px)').matches

    ctx = gsap.context(() => {
      // — Initial states —————————————————————————————————————————
      // Images: apply rotation + z-index from data (no rotation on mobile,
      // since the photos fill the container via the CSS media query above).
      scenes.forEach((scene, sIdx) => {
        scene.images.forEach((img, imgIdx) => {
          const el = imageRefs[`${sIdx}-${imgIdx}`]
          if (!el) return
          if (isMobile) {
            // Only the first image of each scene starts visible; the rest
            // crossfade in as fragments advance.
            gsap.set(el, { rotation: 0, zIndex: img.z, opacity: imgIdx === 0 ? 1 : 0, force3D: true })
          } else {
            gsap.set(el, { rotation: img.rotation, zIndex: img.z, force3D: true })
          }
        })
      })

      // Scenes: only first visible
      sceneRefs.forEach((el, i) => {
        if (el) gsap.set(el, { opacity: i === 0 ? 1 : 0 })
      })

      // Collage frame: on mobile, start each scene's collage in the right
      // frame for its first image (default landscape vs tall portrait).
      if (isMobile) {
        scenes.forEach((scene, sIdx) => {
          const collageEl = collageRefs[sIdx]
          if (!collageEl || !scene.images[0]) return
          const frame = scene.images[0].tall ? MOBILE_FRAME_TALL : MOBILE_FRAME_DEFAULT
          gsap.set(collageEl, frame)
        })
      }

      // Year + label: only first visible
      yearRefs.forEach((el, i) => {
        if (el) gsap.set(el, { opacity: i === 0 ? 1 : 0 })
      })
      labelRefs.forEach((el, i) => {
        if (el) gsap.set(el, { opacity: i === 0 ? 1 : 0 })
      })

      // Fragments: only first of first scene visible. Use small y offset for rise effect.
      scenes.forEach((scene, sIdx) => {
        scene.fragments.forEach((_, fIdx) => {
          const el = fragmentRefs[`${sIdx}-${fIdx}`]
          if (!el) return
          const isFirst = sIdx === 0 && fIdx === 0
          gsap.set(el, { opacity: isFirst ? 1 : 0, y: isFirst ? 0 : 16, force3D: true })
        })
      })

      // — Master timeline (scrubbed by scroll over the whole section) ——
      const tl = gsap.timeline({
        defaults: { ease: 'none', overwrite: 'auto' },
        scrollTrigger: {
          trigger: sectionRef.value!,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          invalidateOnRefresh: true,
          // Hide global floating UI (theme/audio/envelope buttons) while the
          // user is inside the immersive section, so they don't compete with
          // the storytelling.
          onEnter: () => { immersive.value = true },
          onEnterBack: () => { immersive.value = true },
          onLeave: () => { immersive.value = false },
          onLeaveBack: () => { immersive.value = false },
        },
      })

      // Progress bar fills across the whole timeline
      if (progressBar.value) {
        tl.to(progressBar.value, { scaleX: 1, duration: totalUnits }, 0)
      }

      // Scroll hint fades out almost immediately
      if (scrollHint.value) {
        tl.to(scrollHint.value, { opacity: 0, duration: 0.4 }, 0)
      }

      // — Build per-scene segments ———————————————————————————————
      let cursor = 0

      scenes.forEach((scene, sIdx) => {
        const sceneEl = sceneRefs[sIdx]
        const yearEl = yearRefs[sIdx]
        const labelEl = labelRefs[sIdx]

        // Scene-to-scene crossfade (skip for first scene)
        if (sIdx > 0) {
          const prevSceneEl = sceneRefs[sIdx - 1]
          const prevYearEl = yearRefs[sIdx - 1]
          const prevLabelEl = labelRefs[sIdx - 1]

          if (prevSceneEl) tl.to(prevSceneEl, { opacity: 0, duration: 0.5 }, cursor)
          if (sceneEl) tl.to(sceneEl, { opacity: 1, duration: 0.5 }, cursor)

          if (prevYearEl) tl.to(prevYearEl, { opacity: 0, duration: 0.4 }, cursor)
          if (yearEl) tl.to(yearEl, { opacity: 1, duration: 0.4 }, cursor + 0.15)

          if (prevLabelEl) tl.to(prevLabelEl, { opacity: 0, duration: 0.4 }, cursor)
          if (labelEl) tl.to(labelEl, { opacity: 1, duration: 0.4 }, cursor + 0.15)

          cursor += 0.7
        }

        // Each fragment: fade in, hold, fade out (last of last scene stays visible)
        const imageCount = scene.images.length
        scene.fragments.forEach((_, fIdx) => {
          const fragEl = fragmentRefs[`${sIdx}-${fIdx}`]
          if (!fragEl) return

          const isFirstOfFirst = sIdx === 0 && fIdx === 0
          const isLastOverall = sIdx === scenes.length - 1 && fIdx === scene.fragments.length - 1

          // Fade in (the very first fragment is already visible)
          if (!isFirstOfFirst) {
            tl.to(fragEl, { opacity: 1, y: 0, duration: 0.4 }, cursor)

            // Mobile: rotate to the next image at the same time the new
            // fragment fades in. Cycles through with modulo so a scene with
            // more fragments than images (or fewer) still works.
            if (isMobile && imageCount > 0) {
              const incomingIdx = fIdx % imageCount
              const outgoingIdx = (fIdx - 1) % imageCount
              if (incomingIdx !== outgoingIdx) {
                const incomingEl = imageRefs[`${sIdx}-${incomingIdx}`]
                const outgoingEl = imageRefs[`${sIdx}-${outgoingIdx}`]
                if (outgoingEl) tl.to(outgoingEl, { opacity: 0, duration: 0.4 }, cursor)
                if (incomingEl) tl.to(incomingEl, { opacity: 1, duration: 0.4 }, cursor)

                // If the new image's `tall` flag differs from the previous,
                // animate the collage frame to match (portrait vs landscape).
                const incomingImg = scene.images[incomingIdx]
                const outgoingImg = scene.images[outgoingIdx]
                if (incomingImg && outgoingImg && Boolean(incomingImg.tall) !== Boolean(outgoingImg.tall)) {
                  const collageEl = collageRefs[sIdx]
                  if (collageEl) {
                    const frame = incomingImg.tall ? MOBILE_FRAME_TALL : MOBILE_FRAME_DEFAULT
                    tl.to(collageEl, { ...frame, duration: 0.4 }, cursor)
                  }
                }
              }
            }
          }
          cursor += 1.0 // hold

          // Fade out (unless final fragment of final scene)
          if (!isLastOverall) {
            tl.to(fragEl, { opacity: 0, y: -16, duration: 0.4 }, cursor)
            cursor += 0.4
          }
        })
      })
    }, sectionRef.value)
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
  immersive.value = false
})
</script>
