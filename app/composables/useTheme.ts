export type ThemeMode = 'system' | 'dark' | 'light'
export type ResolvedTheme = 'dark' | 'light'

const STORAGE_KEY = 'wedding_theme'

export const useTheme = () => {
  const mode = useState<ThemeMode>('theme-mode', () => 'system')
  const resolved = useState<ResolvedTheme>('theme-resolved', () => 'light')

  const apply = (next: ResolvedTheme) => {
    if (!import.meta.client) return
    document.documentElement.setAttribute('data-theme', next)
    resolved.value = next
  }

  const resolve = (m: ThemeMode): ResolvedTheme => {
    if (m !== 'system') return m
    if (typeof window === 'undefined' || !window.matchMedia) return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const setMode = (m: ThemeMode) => {
    mode.value = m
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, m)
      } catch {}
    }
    apply(resolve(m))
  }

  const toggle = () => setMode(resolved.value === 'dark' ? 'light' : 'dark')

  const init = () => {
    if (!import.meta.client) return
    let stored: ThemeMode = 'system'
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw === 'dark' || raw === 'light' || raw === 'system') stored = raw
    } catch {}
    mode.value = stored
    apply(resolve(stored))

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (mode.value === 'system') apply(resolve('system'))
    }
    if (mq.addEventListener) mq.addEventListener('change', onChange)
    else mq.addListener(onChange)
  }

  return { mode, resolved, setMode, toggle, init }
}
