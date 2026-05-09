import { ref } from 'vue'

const isPlaying = ref(false)
const hasEnded = ref(false)
const volume = ref(0.025)
let audio: HTMLAudioElement | null = null

const fixedTracks = ['/intro.mp3']
// Añade aquí las rutas de las canciones adicionales que sonarán aleatoriamente después de las fijas
const extraPlaylist: string[] = [
  '/the-night-we-met.mp3',
  '/you-belong-with-me.mp3',
  '/enchanted.mp3',
  "/halo.mp3"
]

// Cambia a true para reproducir aleatoriamente todas las canciones (incluyendo las fijas) desde el principio
const playRandomlyFromStart = true

const allTracks = [...fixedTracks, ...extraPlaylist]

const getRandomTrack = (fromAll = false) => {
  const pool = fromAll ? allTracks : extraPlaylist
  if (pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

const getFirstTrack = () => {
  return playRandomlyFromStart ? getRandomTrack(true) : (fixedTracks[0] || getRandomTrack(false))
}

let currentTrackIndex = 0

export const useBackgroundMusic = () => {
  if (import.meta.client && !audio) {
    const initialTrack = getFirstTrack()
    if (initialTrack) {
      audio = new Audio(initialTrack)
      audio.volume = volume.value

      audio.addEventListener('ended', () => {
        let nextTrack: string | null = null

        if (playRandomlyFromStart) {
          nextTrack = getRandomTrack(true)
        } else {
          currentTrackIndex++
          if (currentTrackIndex < fixedTracks.length) {
            nextTrack = fixedTracks[currentTrackIndex]
          } else {
            nextTrack = getRandomTrack(false)
          }
        }

        if (nextTrack) {
          if (audio) {
            audio.src = nextTrack
            audio.play().catch(error => {
              console.warn('Next track play failed:', error)
              isPlaying.value = false
            })
          }
        } else {
          isPlaying.value = false
          hasEnded.value = true
          currentTrackIndex = 0
          if (audio) {
            const restartTrack = getFirstTrack()
            if (restartTrack) audio.src = restartTrack
          }
        }
      })

      audio.addEventListener('play', () => {
        isPlaying.value = true
        hasEnded.value = false
      })

      audio.addEventListener('pause', () => {
        isPlaying.value = false
      })
    }

    window.addEventListener('beforeunload', () => {
      if (audio) {
        audio.pause()
      }
    })

    if (import.meta.hot) {
      import.meta.hot.dispose(() => {
        if (audio) {
          audio.pause()
          audio.src = ''
        }
      })
    }
  }

  let isWaitingForInteraction = false

  const play = () => {
    if (!audio) return
    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn('Music play failed (posiblemente por políticas de Autoplay):', error)
        if (!isWaitingForInteraction) {
          isWaitingForInteraction = true
          
          const startOnInteraction = () => {
            if (audio) {
              audio.play().catch(() => {})
            }
            isWaitingForInteraction = false
            document.removeEventListener('click', startOnInteraction)
            document.removeEventListener('touchstart', startOnInteraction)
            document.removeEventListener('keydown', startOnInteraction)
          }
          
          document.addEventListener('click', startOnInteraction, { passive: true })
          document.addEventListener('touchstart', startOnInteraction, { passive: true })
          document.addEventListener('keydown', startOnInteraction, { passive: true })
        }
      })
    }
  }

  const pause = () => {
    if (!audio) return
    audio.pause()
  }

  const toggle = () => {
    if (!audio) return
    if (audio.paused) {
      if (hasEnded.value) {
        audio.currentTime = 0
      }
      play()
    } else {
      pause()
    }
  }

  const setVolume = (val: number) => {
    const newVol = Math.max(0, Math.min(1, val))
    volume.value = newVol
    if (audio) {
      audio.volume = newVol
    }
  }

  return {
    isPlaying,
    hasEnded,
    volume,
    play,
    pause,
    toggle,
    setVolume
  }
}
