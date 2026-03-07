<template>
  <section class="py-32 pb-0 relative min-h-screen flex items-center justify-center -mt-20 z-20 -scroll-m-36" id="rsvp">
    <div ref="containerRef" class="w-full max-w-3xl mx-auto px-4 relative z-10 glass-dark rounded-[2.5rem] p-8 md:p-12 lg:p-16 opacity-0 translate-y-20">
      
      <div class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-serif text-wedding-accent mb-4">Confirmar Asistencia</h2>
        <p class="text-lg font-light opacity-80">Por favor, indícanos si podremos contar contigo en este día tan especial.</p>
      </div>

      <!-- Mensaje de éxito si ya ha enviado el formulario -->
      <div v-if="alreadySubmitted" class="text-left animate-fade-in bg-white/5 border border-white/10 rounded-2xl p-8 max-w-lg mx-auto">
        <Icon name="lucide:check-circle-2" class="w-16 h-16 text-wedding-accent mx-auto block mb-6 opacity-90" />
        <h3 class="text-2xl font-serif text-wedding-accent mb-4 text-center">¡Ya tenemos tus datos!</h3>
        <p class="text-lg font-light opacity-80 mb-6 text-center">Muchas gracias por confirmar. Tenemos muchas ganas de celebrar este día tan especial contigo.</p>
        
        <div class="bg-black/20 p-6 rounded-xl border border-white/5 space-y-4">
          <div>
            <span class="opacity-60 uppercase tracking-wider text-xs block mb-1">Nombre</span>
            <p class="font-light">{{ form.name }}</p>
          </div>
          <div>
            <span class="opacity-60 uppercase tracking-wider text-xs block mb-1">Email / Teléfono</span>
            <p class="font-light">{{ form.contact }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 mt-2">
            <div>
              <span class="opacity-60 uppercase tracking-wider text-xs block mb-1">Asistencia</span>
              <p class="font-light">{{ form.attending ? 'Confirmada' : 'No asistiré' }}</p>
            </div>
            <div v-if="form.attending">
              <span class="opacity-60 uppercase tracking-wider text-xs block mb-1">Acompañantes</span>
              <p class="font-light">{{ form.adults }} ({{ form.children }} niños)</p>
            </div>
          </div>
        </div>
      </div>

      <form v-else @submit.prevent="submitRsvp" class="space-y-8">
        
        <!-- Basic Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="form-group flex flex-col gap-2 group">
            <label class="text-sm tracking-widest uppercase opacity-70 group-focus-within:text-wedding-accent transition-colors">Nombre y Apellidos</label>
            <input type="text" required v-model="form.name" class="w-full bg-white/5 border-b border-white/20 px-4 py-3 rounded-t-md outline-none focus:bg-white/10 focus:border-wedding-accent transition-all font-light" placeholder="Ej. Familia García Pérez" />
          </div>
          
          <div class="form-group flex flex-col gap-2 group">
            <label class="text-sm tracking-widest uppercase opacity-70 group-focus-within:text-wedding-accent transition-colors">Email o Teléfono</label>
            <input type="text" required v-model="form.contact" class="w-full bg-white/5 border-b border-white/20 px-4 py-3 rounded-t-md outline-none focus:bg-white/10 focus:border-wedding-accent transition-all font-light" placeholder="Para contactarte" />
          </div>
        </div>

        <!-- Additional Info conditionally shown -->
        <div v-show="form.attending" class="space-y-8 animate-fade-in">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="form-group flex flex-col gap-2 group">
              <label class="text-sm tracking-widest uppercase opacity-70 group-focus-within:text-wedding-accent transition-colors">Acompañantes Adultos</label>
              <input type="number" min="0" v-model="form.adults" class="w-full bg-white/5 border-b border-white/20 px-4 py-3 rounded-t-md outline-none focus:bg-white/10 focus:border-wedding-accent transition-all font-light" />
            </div>
            
            <div class="form-group flex flex-col gap-2 group">
              <label class="text-sm tracking-widest uppercase opacity-70 group-focus-within:text-wedding-accent transition-colors">Niños (Menú Infantil)</label>
              <input type="number" min="0" v-model="form.children" class="w-full bg-white/5 border-b border-white/20 px-4 py-3 rounded-t-md outline-none focus:bg-white/10 focus:border-wedding-accent transition-all font-light" />
            </div>
          </div>

          <div class="form-group flex flex-col gap-2 group">
            <label class="text-sm tracking-widest uppercase opacity-70 group-focus-within:text-wedding-accent transition-colors">Alergias o Dietas Especiales</label>
            <input type="text" v-model="form.allergies" class="w-full bg-white/5 border-b border-white/20 px-4 py-3 rounded-t-md outline-none focus:bg-white/10 focus:border-wedding-accent transition-all font-light" placeholder="Ej. Vegano, Intolerante a la lactosa, Ninguna" />
          </div>

          <div class="form-group flex flex-col gap-2 group">
            <label class="flex items-center gap-2 text-sm tracking-widest uppercase opacity-70 group-focus-within:text-wedding-accent transition-colors">
              Petición Musical <Icon name="lucide:music" class="w-4 h-4" />
            </label>
            <input type="text" v-model="form.song" class="w-full bg-white/5 border-b border-white/20 px-4 py-3 rounded-t-md outline-none focus:bg-white/10 focus:border-wedding-accent transition-all font-light" placeholder="Tu canción, o canciones, que te gustaría escuchar en la fiesta" />
          </div>

        </div>

        <div class="form-group flex flex-col gap-2 group">
          <label class="text-sm tracking-widest uppercase opacity-70 group-focus-within:text-wedding-accent transition-colors">Mensaje para los novios</label>
          <textarea rows="3" v-model="form.message" class="w-full bg-white/5 border-b border-white/20 px-4 py-3 rounded-t-md outline-none focus:bg-white/10 focus:border-wedding-accent transition-all font-light resize-none" placeholder="Opcional..."></textarea>
        </div>

        <button type="submit" :disabled="isSubmitting" class="w-full py-5 rounded-xl bg-wedding-accent text-wedding-dark font-medium text-lg tracking-[0.2em] uppercase hover:bg-[#E5C07B] transition-colors relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed">
          <span class="relative z-10 font-bold">
            <template v-if="isSubmitting">Enviando...</template>
            <template v-else>Enviar Confirmación</template>
          </span>
          <div v-if="!isSubmitting" class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
        </button>
        
        <p v-if="isError" class="text-red-400 text-center mt-4 font-light">Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo más tarde o contáctanos directamente.</p>

      </form>
    </div>
  </section>

        <div class="w-full max-w-3xl text-center mx-auto px-4 relative z-10 rounded-[2.5rem] p-4 mb-12 ">
          <p>Hecho con <Icon name="lucide:heart" class="w-4 h-4 text-red-500" /> por <a class="text-wedding-accent" target="blank_" href="https://www.instagram.com/fernandomfdz/">@fernandomfdz</a></p>
          <p>© {{ (new Date()).getFullYear() }}</p>
        </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const form = ref({
  name: '',
  contact: '',
  attending: true,
  adults: 0,
  children: 0,
  allergies: '',
  needsBus: false,
  song: '',
  message: ''
})

const isSubmitting = ref(false)
const alreadySubmitted = ref(false)
const isError = ref(false)

const containerRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context

onMounted(() => {
  // Check localStorage for previous submission
  if (import.meta.client) {
    const savedRsvp = localStorage.getItem('wedding_rsvp_submitted')
    if (savedRsvp === 'true') {
      alreadySubmitted.value = true
      const savedData = localStorage.getItem('wedding_rsvp_data')
      if (savedData) {
        try {
          Object.assign(form.value, JSON.parse(savedData))
        } catch (e) {
          console.error('Error parsing saved RSVP data', e)
        }
      }
    }
  }

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
        }
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
      body: form.value
    })
    
    alreadySubmitted.value = true
    if (import.meta.client) {
      localStorage.setItem('wedding_rsvp_submitted', 'true')
      localStorage.setItem('wedding_rsvp_data', JSON.stringify(form.value))
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
</style>
