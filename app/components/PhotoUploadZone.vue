<template>
  <div class="photo-upload-zone p-6 rounded-2xl" style="background: var(--c-surface); border: 1px dashed var(--c-border)">
    <!-- Drop Zone -->
    <label
      class="drop-zone flex flex-col items-center justify-center p-12 transition-all duration-300 cursor-pointer rounded-xl border-2"
      :class="[
        isDragging 
          ? 'bg-black/5 border-wedding-accent scale-[1.02] border-solid shadow-md' 
          : 'bg-transparent border-transparent border-dashed hover:bg-black/5 hover:border-black/20'
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
    >
      <input
        type="file"
        ref="fileInput"
        multiple
        accept="image/*,video/*"
        class="hidden"
        @change="onFileSelect"
      />
      <div class="pointer-events-none flex flex-col items-center">
        <Icon 
          name="lucide:image-plus" 
          class="text-4xl mb-4 transition-transform duration-300"
          :class="isDragging ? 'scale-125 text-wedding-accent opacity-100' : 'opacity-50'" 
        />
        <p class="font-serif text-lg mb-2" :class="isDragging ? 'text-wedding-accent' : ''">Arrastra tus fotos o vídeos aquí</p>
        <p class="text-sm opacity-60 font-sans tracking-wide">o haz clic para seleccionar</p>
      </div>
    </label>

    <!-- Preview Area -->
    <div v-if="previewFiles.length > 0" class="mt-8">
      <h3 class="font-serif text-xl mb-4 text-wedding-accent">Previsualización ({{ previewFiles.length }})</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div v-for="(file, index) in previewFiles" :key="index" class="relative group aspect-square rounded-xl overflow-hidden shadow-sm bg-black">
          <img v-if="file.type.startsWith('image/')" :src="file.url" class="object-cover w-full h-full" />
          <video v-else-if="file.type.startsWith('video/')" :src="file.url" class="object-cover w-full h-full" muted loop playsinline autoplay></video>
          <button
            @click.stop="removeFile(index)"
            class="absolute cursor-pointer top-0 right-0 bg-red-500 text-white p-1.5 shadow-md hover:bg-red-600 transition-colors"
            title="Eliminar"
          >
            <Icon name="lucide:x" class="text-sm" />
          </button>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-4">
        <button
          @click="clearFiles"
          class="cursor-pointer px-6 py-2 rounded-full font-sans text-sm tracking-widest uppercase opacity-70 hover:opacity-100 transition-opacity"
          :disabled="isUploading"
        >
          Cancelar
        </button>
        <button
          @click="uploadFiles"
          class="cursor-pointer px-8 py-2 rounded-full font-sans text-sm tracking-widest uppercase bg-wedding-accent text-white hover:opacity-90 transition-opacity flex items-center gap-2"
          :disabled="isUploading"
          style="background-color: var(--c-primary)"
        >
          <Icon v-if="isUploading" name="lucide:loader-2" class="animate-spin" />
          {{ isUploading ? 'Subiendo...' : 'Subir Archivos' }}
        </button>
      </div>

      <!-- Status Messages -->
      <p v-if="uploadSuccess" class="text-green-600 text-sm mt-4 text-center font-sans">
        ¡Archivos subidos correctamente!
      </p>
      <p v-if="uploadError" class="text-red-500 text-sm mt-4 text-center font-sans">
        {{ uploadError }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['uploaded'])

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const previewFiles = ref<{ file: File, url: string, type: string }[]>([])
const isUploading = ref(false)
const uploadSuccess = ref(false)
const uploadError = ref('')



const handleFiles = (files: FileList | File[]) => {
  uploadSuccess.value = false
  uploadError.value = ''
  
  for (const file of files) {
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      previewFiles.value.push({
        file,
        url: URL.createObjectURL(file),
        type: file.type
      })
    }
  }
}

const onDrop = (e: DragEvent) => {
  isDragging.value = false
  if (e.dataTransfer?.files) {
    handleFiles(e.dataTransfer.files)
  }
}

const onFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files) {
    handleFiles(target.files)
    // Reset input so selecting the same files again works
    target.value = ''
  }
}

const removeFile = (index: number) => {
  URL.revokeObjectURL(previewFiles.value[index].url)
  previewFiles.value.splice(index, 1)
}

const clearFiles = () => {
  previewFiles.value.forEach(p => URL.revokeObjectURL(p.url))
  previewFiles.value = []
  uploadSuccess.value = false
  uploadError.value = ''
}

const uploadFiles = async () => {
  if (previewFiles.value.length === 0) return

  isUploading.value = true
  uploadSuccess.value = false
  uploadError.value = ''

  const formData = new FormData()
  previewFiles.value.forEach(p => {
    formData.append('files', p.file)
  })

  try {
    const response = await $fetch('/api/gallery/upload', {
      method: 'POST',
      body: formData
    })

    if (response.success) {
      uploadSuccess.value = true
      // Avisar al padre y limpiar
      emit('uploaded')
      
      // Hacer scroll suave hacia la galería
      setTimeout(() => {
        const gallery = document.querySelector('.photo-gallery-grid')
        if (gallery) {
          gallery.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        clearFiles()
      }, 1500)
    }
  } catch (error: any) {
    console.error('Error uploading files:', error)
    uploadError.value = 'Ha ocurrido un error al subir los archivos. Inténtalo de nuevo.'
  } finally {
    isUploading.value = false
  }
}
</script>
