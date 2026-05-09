<template>
  <div class="absolute inset-0 overflow-hidden pointer-events-none w-full h-full">
    <!-- Canvas for fireworks only -->
    <canvas ref="canvasRef" class="absolute inset-0 z-20 w-full h-screen mix-blend-screen opacity-80"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  active: {
    type: Boolean,
    default: true
  }
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationFrameId: number

let width = 0
let height = 0
const TWO_PI = Math.PI * 2

const colors = [
  '#D4AF37', // Gold
  '#FFDF00', // Yellow
  '#FFC0CB', // Pink
  '#FFFFFF', // White
  '#E6C27A', // Champagne
  '#FF5E7E', // Bright Pink
  '#7E5EFF', // Purple
  '#5EFF7E', // Light Green
  '#FFB347', // Orange
  '#47B3FF'  // Light Blue
]

class Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  alpha: number
  decay: number
  size: number
  flickerSpeed: number
  time: number
  history: {x: number, y: number}[]

  constructor(x: number, y: number, color: string) {
    this.x = x
    this.y = y
    this.color = color
    const angle = Math.random() * TWO_PI
    const speed = Math.random() * 3 + 0.5 
    this.vx = Math.cos(angle) * speed
    this.vy = Math.sin(angle) * speed
    this.alpha = 1
    // Decaimiento mucho más rápido
    this.decay = Math.random() * 0.015 + 0.015
    this.size = Math.random() * 2 + 1
    this.flickerSpeed = Math.random() * 0.1 + 0.05
    this.time = Math.random() * 10
    this.history = []
  }

  update() {
    this.history.push({ x: this.x, y: this.y })
    if (this.history.length > 6) {
      this.history.shift()
    }

    this.x += this.vx
    this.y += this.vy
    this.vy += 0.02 // Gravedad ligeramente mayor
    this.alpha -= this.decay
    this.time += this.flickerSpeed
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.history.length < 2) return

    const currentAlpha = this.alpha * (0.8 + Math.sin(this.time) * 0.2)
    ctx.globalAlpha = Math.max(0, currentAlpha)
    
    // Dibujamos una línea en vez de un punto para el efecto trail (estela limpia)
    ctx.beginPath()
    ctx.moveTo(this.history[0].x, this.history[0].y)
    for (let i = 1; i < this.history.length; i++) {
      ctx.lineTo(this.history[i].x, this.history[i].y)
    }
    
    ctx.strokeStyle = this.color
    ctx.lineWidth = this.size
    ctx.lineCap = 'round'
    ctx.stroke()
  }
}

class Firework {
  x: number
  y: number
  targetX: number
  targetY: number
  vx: number
  vy: number
  color: string
  exploded: boolean
  particles: Particle[]
  trailAlpha: number
  history: {x: number, y: number}[]

  constructor() {
    this.x = Math.random() * (width * 0.8) + width * 0.1
    this.y = height + 10
    this.targetX = this.x + (Math.random() - 0.5) * 200
    this.targetY = Math.random() * (height * 0.33) // Explota en el primer tercio de la pantalla
    this.color = colors[Math.floor(Math.random() * colors.length)]
    this.exploded = false
    this.particles = []
    this.trailAlpha = 1
    this.history = []

    const dx = this.targetX - this.x
    const dy = this.targetY - this.y
    const timeToTarget = 80 + Math.random() * 40 // Sube más rápido
    
    this.vx = dx / timeToTarget
    this.vy = dy / timeToTarget
  }

  update() {
    if (!this.exploded) {
      this.history.push({ x: this.x, y: this.y })
      if (this.history.length > 10) this.history.shift()

      this.x += this.vx
      this.y += this.vy

      if (this.vy < 0 && this.y <= this.targetY) {
        this.explode()
      }
    } else {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i]
        p.update()
        if (p.alpha <= 0) {
          this.particles.splice(i, 1)
        }
      }
    }
  }

  explode() {
    this.exploded = true
    const particleCount = 40 + Math.random() * 20
    const mixColors = Math.random() > 0.3 // Aumentada probabilidad de colores mixtos
    const secondaryColor = colors[Math.floor(Math.random() * colors.length)]

    for (let i = 0; i < particleCount; i++) {
      const pColor = mixColors && Math.random() > 0.5 ? secondaryColor : this.color
      this.particles.push(new Particle(this.x, this.y, pColor))
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.exploded) {
      if (this.history.length < 2) return
      
      let dynamicAlpha = 0
      const firstThird = height * 0.33
      const secondThird = height * 0.66

      if (this.y > secondThird) {
        // Invisible en el 3er tercio (abajo)
        dynamicAlpha = 0 
      } else if (this.y > firstThird) {
        // Transición de 0 a 1 en el 2o tercio (medio)
        dynamicAlpha = 1 - ((this.y - firstThird) / (secondThird - firstThird))
      } else {
        // Totalmente visible en el 1er tercio (arriba)
        dynamicAlpha = 1
      }
      
      ctx.globalAlpha = this.trailAlpha * dynamicAlpha
      ctx.beginPath()
      ctx.moveTo(this.history[0].x, this.history[0].y)
      for (let i = 1; i < this.history.length; i++) {
        ctx.lineTo(this.history[i].x, this.history[i].y)
      }
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 1.5
      ctx.stroke()
    } else {
      for (const p of this.particles) {
        p.draw(ctx)
      }
    }
  }

  isDead() {
    return this.exploded && this.particles.length === 0
  }
}

let fireworks: Firework[] = []

const draw = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Limpiamos todo el canvas con clearRect para eliminar los artifacts ("pantalla quemada")
  // El trail ahora lo hacen las propias partículas recordando su historia
  ctx.clearRect(0, 0, width, height)
  
  ctx.globalCompositeOperation = 'lighter'

  // Generate fireworks sparingly
  if (props.active && Math.random() < 0.02 && fireworks.length < 5) {
    fireworks.push(new Firework())
  }

  for (let i = fireworks.length - 1; i >= 0; i--) {
    const f = fireworks[i]
    f.update()
    f.draw(ctx)
    if (f.isDead()) {
      fireworks.splice(i, 1)
    }
  }

  animationFrameId = requestAnimationFrame(draw)
}

const handleResize = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
  width = window.innerWidth
  height = window.innerHeight
  
  canvas.width = width * pixelRatio
  canvas.height = height * pixelRatio
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  
  const ctx = canvas.getContext('2d')
  if (ctx) {
      ctx.scale(pixelRatio, pixelRatio)
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize, { passive: true })
  animationFrameId = requestAnimationFrame(draw)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animationFrameId)
})
</script>
