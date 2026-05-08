<template>
  <ClientOnly>
    <Transition name="fade">
      <button
        v-show="!envelope.isOpen.value"
        type="button"
        class="fixed bottom-4 right-4 z-30 h-11 px-4 rounded-full flex items-center gap-2 glass-dark hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer"
        aria-label="Volver a ver la invitación"
        title="Volver a ver la invitación"
        @click="envelope.reopen"
      >
        <Icon name="lucide:mail-open" class="w-4 h-4 text-wedding-accent" />
        <span class="font-serif italic text-sm text-wedding-accent hidden sm:inline">Ver invitación</span>
      </button>
    </Transition>
  </ClientOnly>
</template>

<script setup lang="ts">
const envelope = useEnvelope()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
