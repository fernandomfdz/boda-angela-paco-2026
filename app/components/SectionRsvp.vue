<template>
  <section class="py-32 relative min-h-screen flex items-center justify-center -mt-20 z-20" id="rsvp">
    <div ref="containerRef" class="w-full max-w-3xl mx-auto px-4 relative z-10 glass-dark rounded-[2.5rem] p-8 md:p-12 lg:p-16 opacity-0 translate-y-20">
      
      <div class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-serif text-wedding-accent mb-4">Confirmar Asistencia</h2>
        <p class="text-lg font-light opacity-80">Por favor, indícanos si podremos contar contigo en este día tan especial.</p>
      </div>

      <form @submit.prevent="submitRsvp" class="space-y-8">
        
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

        <button type="submit" class="w-full py-5 rounded-xl bg-wedding-accent text-wedding-dark font-medium text-lg tracking-[0.2em] uppercase hover:bg-[#E5C07B] transition-colors relative overflow-hidden group">
          <span class="relative z-10 font-bold">Enviar Confirmación</span>
          <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
        </button>

      </form>
    </div>
  </section>
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

const containerRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context

onMounted(() => {
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

const submitRsvp = () => {
  // Console log for now, next step will implement API connection
  console.log('Sending RSVP:', form.value)
  alert('Formulario listo. Próximamente se conectará con SQLite.')
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
