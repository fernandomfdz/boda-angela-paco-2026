import type { Guest } from '~/types/guest'

export const useGuest = () => {
  const guest = useState<Guest | null>('current-guest', () => null)

  const load = async (slug: string) => {
    const { data, error } = await useFetch<Guest>(`/api/guests/${slug}`, {
      key: `guest-${slug}`,
    })
    if (error.value || !data.value) {
      guest.value = null
      throw createError({ statusCode: 404, message: 'Invitación no encontrada' })
    }
    guest.value = data.value
    return data.value
  }

  const clear = () => {
    guest.value = null
  }

  return { guest, load, clear }
}
