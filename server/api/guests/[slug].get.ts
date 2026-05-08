import guests from '../../data/guests.json'
import type { Guest } from '~/types/guest'

const guestMap = guests as Record<string, Guest>

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, message: 'Slug requerido' })
  }
  const guest = guestMap[slug]
  if (!guest) {
    throw createError({ statusCode: 404, message: 'Invitación no encontrada' })
  }
  return guest
})
