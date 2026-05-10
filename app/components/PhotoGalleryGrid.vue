<template>
  <div class="photo-gallery-grid mt-24 relative">
    <div class="text-center mb-10">
      <h3 class="font-serif text-3xl md:text-4xl text-wedding-accent mb-3">Galería de los Invitados</h3>
      <p class="font-sans text-sm opacity-70 tracking-wide uppercase">Fotos y vídeos subidos por vosotros</p>
      
      <button 
        v-if="photos.length > 0"
        @click="downloadAll"
        :disabled="isDownloading"
        class="mt-6 inline-flex items-center gap-2 px-6 py-2 rounded-full font-sans text-sm tracking-widest uppercase bg-black/5 hover:bg-black/10 transition-colors"
      >
        <Icon v-if="isDownloading" name="lucide:loader-2" class="animate-spin text-lg" />
        <Icon v-else name="lucide:download" class="text-lg" />
        {{ isDownloading ? `Descargando... (${downloadProgress}%)` : 'Descargar Todo' }}
      </button>
    </div>

    <div v-if="pending" class="flex justify-center py-12">
      <Icon name="lucide:loader-2" class="animate-spin text-3xl opacity-50" />
    </div>

    <div v-else-if="error" class="text-center py-12 text-red-500 font-sans">
      No se pudo cargar la galería.
    </div>

    <div v-else-if="photos.length === 0" class="text-center py-12 opacity-60 font-serif italic">
      Aún no hay fotos. ¡Sé el primero en subir una!
    </div>

    <div v-else class="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      <div v-for="(photo, index) in photos" :key="photo.key" class="break-inside-avoid relative group overflow-hidden rounded-xl bg-black/5 cursor-pointer" @click="openLightbox(index)">
        <video
          v-if="isVideo(photo.key)"
          :src="`/api/gallery/image/${photo.key}`"
          class="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
          muted loop playsinline autoplay
        ></video>
        <img
          v-else
          :src="`/api/gallery/image/${photo.key}`"
          loading="lazy"
          class="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
          alt="Archivo compartido"
        />
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
          <Icon v-if="isVideo(photo.key)" name="lucide:play" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity text-4xl drop-shadow-md" />
        </div>
      </div>
    </div>

    <!-- Lightbox simple -->
    <Teleport to="body">
      <div v-if="selectedPhoto" class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm" @click="closeLightbox">
        <button @click="closeLightbox" class="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10">
          <Icon name="lucide:x" class="text-3xl" />
        </button>
        <!-- Botón Anterior -->
        <button
          v-if="selectedIndex > 0"
          @click.stop="prevPhoto"
          class="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-10 p-2"
        >
          <Icon name="lucide:chevron-left" class="text-4xl md:text-6xl drop-shadow-lg" />
        </button>

        <!-- Botón Siguiente -->
        <button
          v-if="selectedIndex < photos.length - 1"
          @click.stop="nextPhoto"
          class="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-10 p-2"
        >
          <Icon name="lucide:chevron-right" class="text-4xl md:text-6xl drop-shadow-lg" />
        </button>

        <video
          v-if="isVideo(selectedPhoto.key)"
          :key="selectedPhoto.key"
          :src="`/api/gallery/image/${selectedPhoto.key}`"
          class="max-w-full max-h-full object-contain rounded-sm"
          controls autoplay
          @click.stop
        ></video>
        <img
          v-else
          :key="selectedPhoto.key"
          :src="`/api/gallery/image/${selectedPhoto.key}`"
          class="max-w-full max-h-full object-contain rounded-sm"
          @click.stop
        />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const { data, pending, error, refresh } = useFetch('/api/gallery')

const photos = computed(() => data.value?.photos || [])

const selectedIndex = ref<number | null>(null)
const isDownloading = ref(false)
const downloadProgress = ref(0)

const selectedPhoto = computed(() => {
  if (selectedIndex.value === null) return null
  return photos.value[selectedIndex.value]
})

const isVideo = (key: string) => {
  return /\.(mp4|webm|ogg|mov)$/i.test(key)
}

const openLightbox = (index: number) => {
  selectedIndex.value = index
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', handleKeydown)
}

const closeLightbox = () => {
  selectedIndex.value = null
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown)
}

const nextPhoto = () => {
  if (selectedIndex.value !== null && selectedIndex.value < photos.value.length - 1) {
    selectedIndex.value++
  }
}

const prevPhoto = () => {
  if (selectedIndex.value !== null && selectedIndex.value > 0) {
    selectedIndex.value--
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (selectedIndex.value === null) return
  if (e.key === 'ArrowRight') nextPhoto()
  if (e.key === 'ArrowLeft') prevPhoto()
  if (e.key === 'Escape') closeLightbox()
}

const downloadAll = async () => {
  if (photos.value.length === 0 || isDownloading.value) return
  
  isDownloading.value = true
  downloadProgress.value = 0
  const zip = new JSZip()
  
  try {
    let completed = 0
    const total = photos.value.length
    
    // Fetch and add each file to zip
    await Promise.all(photos.value.map(async (photo: any) => {
      try {
        const response = await fetch(`/api/gallery/image/${photo.key}`)
        const blob = await response.blob()
        zip.file(photo.key, blob)
        completed++
        downloadProgress.value = Math.round((completed / total) * 100)
      } catch (err) {
        console.error(`Error fetching ${photo.key}`, err)
      }
    }))
    
    // Generate zip
    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, 'boda-angela-paco-galeria.zip')
  } catch (error) {
    console.error('Error creating zip:', error)
    alert('Hubo un error al intentar descargar los archivos.')
  } finally {
    isDownloading.value = false
    downloadProgress.value = 0
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// Exponer método para que el padre pueda recargar la galería
defineExpose({
  refresh
})
</script>
