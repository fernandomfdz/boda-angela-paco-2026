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

const isPlural = (guest.value?.allowedGuests ?? 0) > 1

const personalTitle = guest.value
  ? isPlural
    ? `${guest.value.displayName}, tenemos algo que contaros…`
    : `${guest.value.displayName}, tenemos algo que contarte…`
  : 'Ángela & Paco · ¡Nos casamos!'

const personalDescription = guest.value
  ? isPlural
    ? `Un sobre con vuestro nombre os está esperando. Abridlo para descubrir lo que hay dentro.`
    : `Un sobre con tu nombre te está esperando. Ábrelo para descubrir lo que hay dentro.`
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
