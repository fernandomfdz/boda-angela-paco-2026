<template>
  <div class="fixed inset-0 overflow-hidden pointer-events-none bg-wedding-dark">
    <!-- Image layer -->
    <img 
      src="/images/image.png" 
      alt="Wedding Background" 
      class="inset-0 z-10 w-full h-full object-cover"
    />
    
    <!-- Canvas for fireworks and stars -->
    <canvas ref="canvasRef" class="absolute z-9 inset-0 z-10 w-full h-full mix-blend-screen opacity-80 block"></canvas>
    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationFrameId: number

let width = 0
let height = 0
const TWO_PI = Math.PI * 2

// Colores más llamativos y variados
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

class Star {
  x: number
  y: number
  size: number
  blinkOffset: number

  constructor() {
    this.x = Math.random() * window.innerWidth
    this.y = Math.random() * window.innerHeight * 0.8 // Más estrellas arriba
    this.size = Math.random() * 1.5 + 0.2
    this.blinkOffset = Math.random() * 100
  }

  draw(ctx: CanvasRenderingContext2D, time: number) {
    // Parpadeo suave
    const alpha = 0.2 + 0.8 * Math.abs(Math.sin(time * 0.001 + this.blinkOffset))
    ctx.globalAlpha = alpha
    ctx.fillStyle = '#FFF5D1'
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, TWO_PI)
    ctx.fill()
  }
}

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
    this.targetY = Math.random() * (height * 0.4) + height * 0.1
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
      
      ctx.globalAlpha = this.trailAlpha
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
let stars: Star[] = []

const initStars = () => {
  stars = []
  const numStars = width < 768 ? 50 : 150
  for (let i = 0; i < numStars; i++) {
    stars.push(new Star())
  }
}

const draw = (time: number) => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Limpiamos todo el canvas con clearRect para eliminar los artifacts ("pantalla quemada")
  // El trail ahora lo hacen las propias partículas recordando su historia
  ctx.clearRect(0, 0, width, height)
  
  ctx.globalCompositeOperation = 'lighter'

  // Dibujar estrellas
  for (const star of stars) {
    star.draw(ctx, time)
  }

  if (Math.random() < 0.02 && fireworks.length < 5) {
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
  if (ctx) ctx.scale(pixelRatio, pixelRatio)
  
  initStars()
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
