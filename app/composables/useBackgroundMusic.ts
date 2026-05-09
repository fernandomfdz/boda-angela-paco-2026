import { ref } from 'vue'

const isPlaying = ref(false)
const hasEnded = ref(false)
let audio: HTMLAudioElement | null = null

export const useBackgroundMusic = () => {
  if (import.meta.client && !audio) {
    audio = new Audio('/intro.mp3')
    audio.addEventListener('ended', () => {
      isPlaying.value = false
      hasEnded.value = true
    })
    audio.addEventListener('play', () => {
      isPlaying.value = true
      hasEnded.value = false
    })
    audio.addEventListener('pause', () => {
      isPlaying.value = false
    })

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

  return {
    isPlaying,
    hasEnded,
    play,
    pause,
    toggle
  }
}
