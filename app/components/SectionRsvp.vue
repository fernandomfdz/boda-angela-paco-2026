<template>
  <section
    v-if="guest"
    class="py-32 pb-0 relative min-h-screen flex items-center justify-center -mt-20 z-20 -scroll-m-36"
    id="rsvp"
  >
    <div
      ref="containerRef"
      class="w-full max-w-3xl mx-auto px-4 relative z-10 glass-dark rounded-[2.5rem] p-8 md:p-12 lg:p-16 opacity-0 translate-y-20"
    >

      <!-- Cabecera personalizada -->
      <div v-if="!alreadySubmitted" class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-serif text-wedding-accent mb-4">Confirmar Asistencia</h2>
        <p class="text-lg font-light opacity-80">
          {{ guest.greeting || `Queridos ${guest.displayName}` }}, indícanos si podremos contar contigo.
        </p>
      </div>

      <!-- Mensaje de éxito -->
      <div v-if="alreadySubmitted" class="text-left animate-fade-in w-full rounded-2xl p-8 mx-auto">
        <Icon name="lucide:check-circle-2" class="w-16 h-16 text-2xl text-wedding-accent mx-auto block mb-6 opacity-90" />
        <h3 class="text-2xl font-serif text-wedding-accent mb-4 text-center">¡Ya tenemos tus datos!</h3>
        <p class="text-lg font-light opacity-80 mb-6 text-center">
          Muchas gracias por confirmar. Tenemos muchas ganas de celebrar este día tan especial contigo.
        </p>

        <div
          class="p-6 rounded-xl space-y-4"
          :style="{ backgroundColor: 'var(--c-card-bg)', border: '1px solid var(--c-card-border)' }"
        >
          <div>
            <span class="uppercase tracking-wider text-xs block mb-1" :style="{ color: 'var(--c-muted)' }">Teléfono</span>
            <p class="font-light">{{ form.contact }}</p>
          </div>
          <div class="pt-4 mt-2" :style="{ borderTop: '1px solid var(--c-card-border)' }">
            <span class="uppercase tracking-wider text-xs block mb-1" :style="{ color: 'var(--c-muted)' }">Asistencia</span>
            <p class="font-light">{{ form.attending ? 'Confirmada' : 'No asistiremos' }}</p>
          </div>
          <div
            v-if="form.attending && form.guests?.length > 0"
            class="pt-4 mt-2"
            :style="{ borderTop: '1px solid var(--c-card-border)' }"
          >
            <span class="uppercase tracking-wider text-xs block mb-3" :style="{ color: 'var(--c-muted)' }">Invitados</span>
            <ul class="space-y-2">
              <li
                v-for="(g, i) in form.guests"
                :key="i"
                class="font-light flex items-center justify-between px-4 py-2 rounded-lg"
                :style="{ backgroundColor: 'var(--c-card-bg)', border: '1px solid var(--c-card-border)' }"
              >
                <span>{{ g.name }}</span>
                <span
                  v-if="g.isChild"
                  class="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                  :style="{ backgroundColor: 'var(--c-input-bg-focus)' }"
                >Niño/a</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <form v-else @submit.prevent="submitRsvp" class="space-y-8">

        <!-- Toggle Asistencia -->
        <div class="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-8">
          <label
            class="flex items-center gap-3 cursor-pointer group px-6 py-4 rounded-xl border transition-colors relative overflow-hidden"
            :style="{
              backgroundColor: 'var(--c-card-bg)',
              borderColor: form.attending ? 'color-mix(in srgb, var(--c-accent) 50%, transparent)' : 'var(--c-card-border)',
              color: form.attending ? 'var(--c-accent)' : 'inherit',
            }"
          >
            <div
              class="absolute inset-0 transition-opacity"
              :style="{
                backgroundColor: 'color-mix(in srgb, var(--c-accent) 10%, transparent)',
                opacity: form.attending ? 1 : 0,
              }"
            ></div>
            <div class="relative flex items-center justify-center w-5 h-5 rounded-full border border-current transition-colors">
              <div class="w-2.5 h-2.5 rounded-full bg-current transition-transform" :style="{ transform: form.attending ? 'scale(1)' : 'scale(0)' }"></div>
              <input type="radio" :value="true" v-model="form.attending" class="absolute opacity-0 w-0 h-0" />
            </div>
            <span class="tracking-widest uppercase text-sm font-medium relative z-10 w-full text-center">Sí, asistiremos</span>
          </label>
          <label
            class="flex items-center gap-3 cursor-pointer group px-6 py-4 rounded-xl border transition-colors relative overflow-hidden"
            :style="{
              backgroundColor: 'var(--c-card-bg)',
              borderColor: !form.attending ? 'color-mix(in srgb, var(--c-accent) 50%, transparent)' : 'var(--c-card-border)',
              color: !form.attending ? 'var(--c-accent)' : 'inherit',
            }"
          >
            <div
              class="absolute inset-0 transition-opacity"
              :style="{
                backgroundColor: 'color-mix(in srgb, var(--c-accent) 10%, transparent)',
                opacity: !form.attending ? 1 : 0,
              }"
            ></div>
            <div class="relative flex items-center justify-center w-5 h-5 rounded-full border border-current transition-colors">
              <div class="w-2.5 h-2.5 rounded-full bg-current transition-transform" :style="{ transform: !form.attending ? 'scale(1)' : 'scale(0)' }"></div>
              <input type="radio" :value="false" v-model="form.attending" class="absolute opacity-0 w-0 h-0" />
            </div>
            <span class="tracking-widest uppercase text-sm font-medium relative z-10 w-full text-center">No podremos</span>
          </label>
        </div>

        <!-- Teléfono -->
        <div class="form-group flex flex-col gap-2 group">
          <label class="text-sm tracking-widest uppercase opacity-70 group-focus-within:text-wedding-accent transition-colors">Teléfono de Contacto</label>
          <input
            required
            type="tel"
            v-model="form.contact"
            class="rsvp-input w-full px-4 py-3 rounded-t-md outline-none transition-all font-light"
            placeholder="Para localizarte"
          />
        </div>

        <!-- Lista de invitados (nombres prellenados, sin add/remove) -->
        <div v-show="form.attending" class="space-y-6 animate-fade-in mt-6">
          <div
            v-for="(g, index) in form.guests"
            :key="index"
            class="rounded-2xl p-6 relative transition-colors"
            :style="{ backgroundColor: 'var(--c-card-bg)', border: '1px solid var(--c-card-border)' }"
          >
            <h4 class="text-wedding-accent font-serif text-xl mb-1">{{ g.name }}</h4>
            <p class="text-xs uppercase tracking-widest opacity-50 mb-6">Invitado {{ index + 1 }}</p>

            <div class="grid grid-cols-1 gap-6">

              <!-- Alergias -->
              <div class="form-group flex flex-col gap-2 group">
                <label class="text-sm tracking-widest uppercase opacity-70 group-focus-within:text-wedding-accent transition-colors">
                  Alergias o Dietas Especiales
                </label>
                <input
                  type="text"
                  v-model="g.allergies"
                  class="rsvp-input w-full px-4 py-3 rounded-t-md outline-none transition-all font-light"
                  placeholder="Ej. Vegano, Intolerante a la lactosa, Ninguna"
                />
              </div>

              <!-- Petición musical -->
              <div class="form-group flex flex-col gap-2 group">
                <label class="flex items-center gap-2 text-sm tracking-widest uppercase opacity-70 group-focus-within:text-wedding-accent transition-colors">
                  Petición Musical <Icon name="lucide:music" class="w-4 h-4" />
                </label>
                <input
                  type="text"
                  v-model="g.song"
                  class="rsvp-input w-full px-4 py-3 rounded-t-md outline-none transition-all font-light"
                  placeholder="Esa canción que no puede faltar"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Mensaje -->
        <div class="form-group flex flex-col gap-2 group">
          <label class="text-sm tracking-widest uppercase opacity-70 group-focus-within:text-wedding-accent transition-colors">Mensaje para los novios</label>
          <textarea
            rows="3"
            v-model="form.message"
            class="rsvp-input w-full px-4 py-3 rounded-t-md outline-none transition-all font-light resize-none"
            placeholder="Opcional..."
          ></textarea>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-5 rounded-xl font-medium text-lg tracking-[0.2em] uppercase transition-colors relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
          :style="{ backgroundColor: 'var(--c-accent)', color: 'var(--c-bg)' }"
        >
          <span class="relative z-10 font-bold">
            <template v-if="isSubmitting">Enviando...</template>
            <template v-else>Enviar Confirmación</template>
          </span>
          <div
            v-if="!isSubmitting"
            class="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
            style="background: rgba(255,255,255,0.20);"
          ></div>
        </button>

        <p v-if="isError" class="text-red-400 text-center mt-4 font-light">
          Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo más tarde o contáctanos directamente.
        </p>
      </form>
    </div>
  </section>

  <!-- Footer (siempre visible, exista o no la sección RSVP) -->
  <div class="w-full max-w-3xl text-center mx-auto px-4 relative z-10 rounded-[2.5rem] p-4 mt-12 mb-12">
    <p>Hecho con <Icon name="lucide:heart" class="w-4 h-4 text-red-500" /> por <a class="text-wedding-accent" target="blank_" href="https://www.instagram.com/fernandomfdz/">@fernandomfdz</a></p>
    <p>© {{ (new Date()).getFullYear() }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Guest } from '~/types/guest'

const props = defineProps<{
  guest?: Guest | null
}>()

interface GuestFormEntry {
  name: string
  isChild: boolean
  allergies: string
  song: string
}

interface RsvpForm {
  slug: string
  displayName: string
  contact: string
  attending: boolean
  message: string
  guests: GuestFormEntry[]
}

const buildInitialForm = (): RsvpForm => ({
  slug: props.guest?.slug ?? '',
  displayName: props.guest?.displayName ?? '',
  contact: '',
  attending: true,
  message: '',
  guests: (props.guest?.names ?? []).map((name) => ({
    name,
    isChild: false,
    allergies: '',
    song: '',
  })),
})

const form = ref<RsvpForm>(buildInitialForm())

const isSubmitting = ref(false)
const alreadySubmitted = ref(false)
const isError = ref(false)

const containerRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context

const storageKeys = () => {
  const slug = props.guest?.slug ?? 'generic'
  return {
    submitted: `wedding_rsvp_submitted_${slug}`,
    data: `wedding_rsvp_data_${slug}`,
  }
}

const restoreFromStorage = () => {
  if (!import.meta.client || !props.guest) return
  const { submitted, data } = storageKeys()
  if (localStorage.getItem(submitted) === 'true') {
    alreadySubmitted.value = true
    const saved = localStorage.getItem(data)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<RsvpForm>
        Object.assign(form.value, parsed)
      } catch (e) {
        console.error('Error parsing saved RSVP data', e)
      }
    }
  }
}

// Si el guest cambia (navegación entre slugs), reinicializar
watch(() => props.guest?.slug, () => {
  form.value = buildInitialForm()
  alreadySubmitted.value = false
  restoreFromStorage()
})

onMounted(() => {
  restoreFromStorage()

  gsap.registerPlugin(ScrollTrigger)
  ctx = gsap.context(() => {
    if (containerRef.value) {
      gsap.to(containerRef.value, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.value,
          start: 'top 90%',
        },
      })
    }
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})

const submitRsvp = async () => {
  try {
    isSubmitting.value = true
    isError.value = false

    await $fetch('/api/rsvp', {
      method: 'POST',
      body: form.value,
    })

    alreadySubmitted.value = true
    if (import.meta.client) {
      const { submitted, data } = storageKeys()
      localStorage.setItem(submitted, 'true')
      localStorage.setItem(data, JSON.stringify(form.value))
    }
  } catch (error) {
    console.error('Error submitting RSVP:', error)
    isError.value = true
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.rsvp-input {
  background-color: var(--c-input-bg);
  border-bottom: 1px solid var(--c-input-border);
  color: inherit;
}
.rsvp-input::placeholder {
  color: var(--c-muted);
}
.rsvp-input:focus {
  background-color: var(--c-input-bg-focus);
  border-bottom-color: var(--c-accent);
}
</style>
