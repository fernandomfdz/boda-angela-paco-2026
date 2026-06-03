import guests from '../../data/guests.json'
import type { Guest } from '~/types/guest'

const guestMap = guests as Record<string, Guest>

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const expected = config.adminPassword
  const cookie = getCookie(event, 'admin_auth')

  if (!expected || !cookie || cookie !== expected) {
    throw createError({ statusCode: 401, message: 'No autorizado' })
  }

  return guestMap
})
