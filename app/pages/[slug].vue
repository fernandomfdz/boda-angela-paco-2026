<template>
  <AppContent :guest="guest" />
</template>

<script setup lang="ts">
const route = useRoute()
const slug = String(route.params.slug)

const { guest, load } = useGuest()

try {
  await load(slug)
} catch (err) {
  throw createError({ statusCode: 404, message: 'Invitación no encontrada', fatal: true })
}

const personalTitle = guest.value
  ? `${guest.value.displayName}, queremos que nos acompañes el día de nuestra boda`
  : 'Ángela & Paco · ¡Nos casamos!'

const personalDescription = guest.value
  ? `${guest.value.displayName}, nos casamos el 30 de Septiembre de 2026. Nos haría muchísima ilusión que compartas con nosotros este día tan especial.`
  : 'Nos casamos el 30 de Septiembre de 2026. Acompáñanos en este día tan especial.'

useSeoMeta({
  title: personalTitle,
  ogTitle: personalTitle,
  twitterTitle: personalTitle,
  description: personalDescription,
  ogDescription: personalDescription,
  twitterDescription: personalDescription,
})
</script>
