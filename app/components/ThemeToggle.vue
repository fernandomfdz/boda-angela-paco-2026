<template>
  <button
    type="button"
    :aria-label="resolved === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'"
    :title="resolved === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'"
    class="fixed top-4 right-4 z-40 w-11 h-11 rounded-full flex items-center justify-center glass-dark hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer"
    @click="toggle"
  >
    <ClientOnly>
      <Icon
        v-if="resolved === 'dark'"
        name="lucide:sun"
        class="w-5 h-5 text-wedding-accent"
      />
      <Icon
        v-else
        name="lucide:moon"
        class="w-5 h-5 text-wedding-accent"
      />
      <template #fallback>
        <span class="block w-5 h-5" />
      </template>
    </ClientOnly>
  </button>
</template>

<script setup lang="ts">
const { resolved, toggle } = useTheme()
</script>
