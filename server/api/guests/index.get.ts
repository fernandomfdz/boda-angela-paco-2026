import guests from '../../data/guests.json'
import type { Guest } from '~/types/guest'

const guestMap = guests as Record<string, Guest>

export default defineEventHandler(() => guestMap)
