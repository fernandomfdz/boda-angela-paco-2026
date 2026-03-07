<template>
  <section class="py-32 pb-0 relative min-h-screen flex items-center justify-center -mt-20 z-20 -scroll-m-36" id="rsvp">
    <div ref="containerRef" class="w-full max-w-3xl mx-auto px-4 relative z-10 glass-dark rounded-[2.5rem] p-8 md:p-12 lg:p-16 opacity-0 translate-y-20">
      
      <div v-if="!alreadySubmitted" class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-serif text-wedding-accent mb-4">Confirmar Asistencia</h2>
        <p class="text-lg font-light opacity-80">Por favor, indícanos si podremos contar contigo en este día tan especial.</p>
      </div>

      <!-- Mensaje de éxito si ya ha enviado el formulario -->
      <div v-if="alreadySubmitted" class="text-left animate-fade-in w-full rounded-2xl p-8 mx-auto">
        <Icon name="lucide:check-circle-2" class="w-16 h-16 text-2xl text-wedding-accent mx-auto block mb-6 opacity-90" />
        <h3 class="text-2xl font-serif text-wedding-accent mb-4 text-center">¡Ya tenemos tus datos!</h3>
        <p class="text-lg font-light opacity-80 mb-6 text-center">Muchas gracias por confirmar. Tenemos muchas ganas de celebrar este día tan especial contigo.</p>
        
        <div class="bg-black/20 p-6 rounded-xl border border-white/5 space-y-4">
          <!-- Old contact field in summary, now hidden if needed or kept simple -->
          <!-- We no longer have form.name, only guests -->
          <div>
            <span class="opacity-60 uppercase tracking-wider text-xs block mb-1">Teléfono</span>
            <p class="font-light">{{ form.contact }}</p>
          </div>
          <div class="border-t border-white/10 pt-4 mt-2">
            <span class="opacity-60 uppercase tracking-wider text-xs block mb-1">Asistencia</span>
            <p class="font-light">{{ form.attending ? 'Confirmada' : 'No asistiremos' }}</p>
          </div>
          <div v-if="form.attending && form.guests?.length > 0" class="border-t border-white/10 pt-4 mt-2">
            <span class="opacity-60 uppercase tracking-wider text-xs block mb-3">Invitados</span>
            <ul class="space-y-2">
              <li v-for="(g, i) in form.guests" :key="i" class="font-light flex items-center justify-between bg-black/20 px-4 py-2 rounded-lg border border-white/5">
                <span>{{ g.name }}</span>
                <span v-if="g.isChild" class="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-white/10 rounded-full">Niño/a</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <form v-else @submit.prevent="submitRsvp" class="space-y-8">
        
        <!-- Attendance Toggle -->
        <div class="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-8">
          <label class="flex items-center gap-3 cursor-pointer group bg-black/20 px-6 py-4 rounded-xl border transition-colors relative overflow-hidden" :class="form.attending ? 'border-wedding-accent/50 text-wedding-accent' : 'border-white/5 hover:border-white/20'">
            <div class="absolute inset-0 bg-wedding-accent/10 opacity-0 transition-opacity" :class="{'opacity-100': form.attending}"></div>
            <div class="relative flex items-center justify-center w-5 h-5 rounded-full border border-current transition-colors">
              <div class="w-2.5 h-2.5 rounded-full bg-current transition-transform scale-0" :class="{'scale-100': form.attending}"></div>
              <input type="radio" :value="true" v-model="form.attending" class="absolute opacity-0 w-0 h-0" />
            </div>
            <span class="tracking-widest uppercase text-sm font-medium relative z-10 w-full text-center">Sí, asistiremos</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer group bg-black/20 px-6 py-4 rounded-xl border transition-colors relative overflow-hidden" :class="!form.attending ? 'border-wedding-accent/50 text-wedding-accent' : 'border-white/5 hover:border-white/20'">
            <div class="absolute inset-0 bg-wedding-accent/10 opacity-0 transition-opacity" :class="{'opacity-100': !form.attending}"></div>
            <div class="relative flex items-center justify-center w-5 h-5 rounded-full border border-current transition-colors">
              <div class="w-2.5 h-2.5 rounded-full bg-current transition-transform scale-0" :class="{'scale-100': !form.attending}"></div>
              <input type="radio" :value="false" v-model="form.attending" class="absolute opacity-0 w-0 h-0" />
            </div>
            <span class="tracking-widest uppercase text-sm font-medium relative z-10 w-full text-center">No podremos</span>
          </label>
        </div>

        <div class="form-group flex flex-col gap-2 group">
          <label class="text-sm tracking-widest uppercase opacity-70 group-focus-within:text-wedding-accent transition-colors">Teléfono de Contacto</label>
          <input required type="number" v-model="form.contact" class="w-full bg-white/5 border-b border-white/20 px-4 py-3 rounded-t-md outline-none focus:bg-white/10 focus:border-wedding-accent transition-all font-light" placeholder="Para localizarte" />
        </div>

        <!-- Guests Info conditionally shown -->
        <div v-show="form.attending" class="space-y-6 animate-fade-in mt-6">
          
          <div v-for="(guest, index) in form.guests" :key="index" class="bg-black/20 border border-white/5 rounded-2xl p-6 relative group/guest transition-all hover:border-white/10">
            <button v-if="index > 0" type="button" @click="removeGuest(index)" class="absolute top-4 right-4 text-white/30 hover:text-red-400 opacity-0 group-hover/guest:opacity-100 transition-all focus:opacity-100 z-10 p-2" title="Eliminar invitado">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
            
            <h4 class="text-wedding-accent font-serif text-xl mb-6">Invitado {{ index + 1 }}</h4>
            
            <div class="grid grid-cols-1 gap-6">
              <div class="form-group flex flex-col gap-2 group">
                <label class="text-sm tracking-widest uppercase opacity-70 group-focus-within:text-wedding-accent transition-colors">Nombre y Apellidos</label>
                <input type="text" :required="form.attending" v-model="guest.name" class="w-full bg-white/5 border-b border-white/20 px-4 py-3 rounded-t-md outline-none focus:bg-white/10 focus:border-wedding-accent transition-all font-light" placeholder="Nombre completo" />
              </div>

              <div class="form-group flex flex-row items-center gap-3 group mt-1">
                <div class="relative flex items-center justify-center w-5 h-5 rounded border cursor-pointer transition-colors" :class="guest.isChild ? 'bg-wedding-accent border-wedding-accent' : 'border-white/30'">
                  <Icon v-if="guest.isChild" name="lucide:check" class="w-3.5 h-3.5 text-wedding-dark absolute pointer-events-none" />
                  <input type="checkbox" :id="'child-'+index" v-model="guest.isChild" class="absolute opacity-0 w-full h-full cursor-pointer z-10" />
                </div>
                <label :for="'child-'+index" class="text-sm tracking-widest uppercase opacity-90 cursor-pointer select-none">Es niño/a (Menú Infantil)</label>
              </div>

              <div class="form-group flex flex-col gap-2 group">
                <label class="text-sm tracking-widest uppercase opacity-70 group-focus-within:text-wedding-accent transition-colors">Alergias o Dietas Especiales</label>
                <input type="text" v-model="guest.allergies" class="w-full bg-white/5 border-b border-white/20 px-4 py-3 rounded-t-md outline-none focus:bg-white/10 focus:border-wedding-accent transition-all font-light" placeholder="Ej. Vegano, Intolerante a la lactosa, Ninguna" />
              </div>

              <div class="form-group flex flex-col gap-2 group">
                <label class="flex items-center gap-2 text-sm tracking-widest uppercase opacity-70 group-focus-within:text-wedding-accent transition-colors">
                  Petición Musical <Icon name="lucide:music" class="w-4 h-4" />
                </label>
                <input type="text" v-model="guest.song" class="w-full bg-white/5 border-b border-white/20 px-4 py-3 rounded-t-md outline-none focus:bg-white/10 focus:border-wedding-accent transition-all font-light" placeholder="Esa canción que no puede faltar" />
              </div>
            </div>
          </div>

          <div class="flex justify-center pt-4 pb-2">
            <button type="button" @click="addGuest" class="flex items-center gap-2 text-wedding-accent hover:text-wedding-dark hover:bg-wedding-accent transition-all px-6 py-3 border border-wedding-accent/50 hover:border-wedding-accent rounded-full text-sm tracking-widest uppercase font-medium">
              <Icon name="lucide:plus" class="w-4 h-4" /> Añadir otro invitado
            </button>
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
  contact: '',
  attending: true,
  message: '',
  guests: [
    { name: '', isChild: false, allergies: '', song: '' }
  ]
})

const addGuest = () => {
  form.value.guests.push({ name: '', isChild: false, allergies: '', song: '' })
}

const removeGuest = (index: number) => {
  if (form.value.guests.length > 1) {
    form.value.guests.splice(index, 1)
  }
}

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
