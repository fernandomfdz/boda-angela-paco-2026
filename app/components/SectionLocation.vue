<template>
  <section class="py-32 relative" id="ubicacion">
    <div class="max-w-6xl mx-auto px-4 relative z-10 flex flex-col lg:flex-row gap-16 items-center">
      
      <!-- Text details -->
      <div ref="textRef" class="w-full opacity-0 -translate-x-10">
        <h2 class="text-4xl md:text-6xl font-serif text-wedding-accent mb-12">Dónde y Cuándo</h2>
        
        <div class="flex flex-col md:flex-row gap-8 items-start">
          <div class="md:mb-10 pl-6 border-l border-wedding-accent/30">
          <h3 class="text-2xl font-serif mb-2 text-white">Ceremonia</h3>
          <p class="text-lg font-light opacity-90 mb-1">Parroquia de San Andrés y Santa María de la Arrixaca</p>
          <p class="opacity-60 text-sm mb-4">Pl. de S. Agustín, 0, 30005 Murcia</p>
          <p class="text-wedding-accent/90 font-medium tracking-widest uppercase text-sm">18:00 hrs</p>
        </div>

          <div ref="mapRef1" id="map" class="w-full opacity-0 translate-x-10 mb-10">
            <div class="glass-dark rounded-2xl transform transition-transform duration-700">
              <div class="bg-gradient-to-br from-wedding-dark via-[rgba(20,20,20,1)] to-white/5 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">            
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3144.602702912803!2d-1.1412121871520193!3d37.98640017181559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6381f6fc04c0bb%3A0xe59a8e96951c9832!2sParroquia%20de%20San%20Andr%C3%A9s%20y%20Santa%20Mar%C3%ADa%20de%20la%20Arrixaca!5e0!3m2!1ses!2ses!4v1772886964562!5m2!1ses!2ses" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col md:flex-row gap-8 items-start">
          <div class="md:mb-12 pl-6 border-l border-wedding-accent/30">
            <h3 class="text-2xl font-serif mb-2 text-white">Celebración</h3>
          <p class="text-lg font-light opacity-90 mb-1">Parroquia de San Andrés y Santa María de la Arrixaca</p>
          <p class="opacity-60 text-sm mb-4">Pl. de S. Agustín, 0, 30005 Murcia</p>
          <p class="text-wedding-accent/90 font-medium tracking-widest uppercase text-sm">18:00 hrs</p>
          </div>
          
            <!-- Map Graphic / Placeholder -->
            <div ref="mapRef" id="map" class="w-full opacity-0 translate-x-10 mb-10">
              <div class="glass-dark rounded-2xl transform transition-transform duration-700">
                <div class="bg-gradient-to-br from-wedding-dark via-[rgba(20,20,20,1)] to-white/5 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">            
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3144.602702912803!2d-1.1412121871520193!3d37.98640017181559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6381f6fc04c0bb%3A0xe59a8e96951c9832!2sParroquia%20de%20San%20Andr%C3%A9s%20y%20Santa%20Mar%C3%ADa%20de%20la%20Arrixaca!5e0!3m2!1ses!2ses!4v1772886964562!5m2!1ses!2ses" width="100%" height="450" style="border:0;" allowfullscreen="true" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
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

const textRef = ref<HTMLElement | null>(null)
const mapRef = ref<HTMLElement | null>(null)
const mapRef1 = ref<HTMLElement | null>(null)

let ctx: gsap.Context

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  
  ctx = gsap.context(() => {
    if (textRef.value && mapRef.value && mapRef1.value) {
      gsap.to([textRef.value, mapRef.value, mapRef1.value], {
        x: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: textRef.value,
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
