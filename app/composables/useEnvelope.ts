const KEY = 'wedding_envelope_opened_session'

export const useEnvelope = () => {
  const isOpen = useState<boolean>('envelope-open', () => true)

  const checkSession = () => {
    if (!import.meta.client) return
    try {
      if (sessionStorage.getItem(KEY) === 'true') {
        isOpen.value = true
      }
    } catch {}
  }

  const dismiss = () => {

    if (import.meta.client) {
      try {
        //sessionStorage.setItem(KEY, 'true')
      } catch {}
    }
    isOpen.value = false
  }

  const reopen = () => {
    if (import.meta.client) {
      try {
        sessionStorage.removeItem(KEY)
      } catch {}
    }
    isOpen.value = true
  }

  return { isOpen, checkSession, dismiss, reopen }
}
