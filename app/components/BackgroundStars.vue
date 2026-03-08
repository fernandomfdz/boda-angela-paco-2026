<template>
  <canvas
    ref="canvasRef"
    class="absolute z-10 inset-0 w-full h-screen mix-blend-screen opacity-80 block"
  ></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationFrameId: number

let width = 0
let height = 0
let lastWidth = 0 // Used to track width changes to fix mobile scroll jitter
const TWO_PI = Math.PI * 2

class Star {
  x: number
  y: number
  size: number
  blinkOffset: number

  constructor() {
    this.x = Math.random() * width
    this.y = Math.random() * height // Ocupa toda la pantalla (h-screen)
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

class ShootingStar {
  x: number
  y: number
  vx: number
  vy: number
  length: number
  alpha: number
  fadeRate: number
  thickness: number

  constructor() {
    this.x = Math.random() * width
    this.y = Math.random() * height * 0.5 // Start primarily in the top half
    this.vx = (Math.random() + 1) * 3 // Horizontal speed rightwards
    this.vy = (Math.random() + 0.5) * 2 // Vertical speed downwards
    this.length = Math.random() * 150 + 50
    this.alpha = 1
    this.fadeRate = Math.random() * 0.015 + 0.005
    this.thickness = Math.random() * 2 + 2
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.alpha -= this.fadeRate
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha <= 0) return

    ctx.globalAlpha = this.alpha
    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    ctx.lineTo(this.x - this.vx * this.length * 0.1, this.y - this.vy * this.length * 0.1) // Draw trailing line based on velocity
    
    // Create subtle gradient for shooting star trail
    const gradient = ctx.createLinearGradient(this.x, this.y, this.x - this.vx * this.length * 0.1, this.y - this.vy * this.length * 0.1)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    
    ctx.strokeStyle = gradient
    ctx.lineWidth = this.thickness
    ctx.stroke()
  }
}


let stars: Star[] = []
let shootingStars: ShootingStar[] = []

const initStars = () => {
  stars = []
  const numStars = width < 768 ? 100 : 250 // Ajustado el número
  for (let i = 0; i < numStars; i++) {
    stars.push(new Star())
  }
}


const draw = (time: number) => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, width, height)
  ctx.globalCompositeOperation = 'lighter'

  // Dibujar estrellas estáticas
  for (const star of stars) {
    star.draw(ctx, time)
  }

  // Generar estrellas fugaces ocasionalmente
  if (Math.random() < 0.005 && shootingStars.length < 3) {
    shootingStars.push(new ShootingStar())
  }

  // Actualizar y dibujar estrellas fugaces
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const s = shootingStars[i]
    if (s) {
      s.update()
      s.draw(ctx)
      if (s.alpha <= 0) {
        shootingStars.splice(i, 1)
      }
    }
  }

  animationFrameId = requestAnimationFrame(draw)
}

const handleResize = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const currentWidth = window.innerWidth
  const currentHeight = window.innerHeight

  // Only re-initialize if width changes to prevent jumpy stars on mobile scroll (where address bar hides/shows changing height only)
  if (currentWidth !== lastWidth) {
      width = currentWidth
      lastWidth = currentWidth
      height = currentHeight
      
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
      
      canvas.width = width * pixelRatio
      canvas.height = height * pixelRatio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.scale(pixelRatio, pixelRatio)
      
      initStars()
  } else {
      // Just update height for the canvas style, but don't re-init stars
      height = currentHeight
      lastWidth = currentWidth

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = width * pixelRatio
      canvas.height = height * pixelRatio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
         ctx.setTransform(1, 0, 0, 1, 0, 0); 
         ctx.scale(pixelRatio, pixelRatio)
      }
      
  }
}


onMounted(() => {
  lastWidth = 0 // Force initial setup
  handleResize()
  window.addEventListener('resize', handleResize, { passive: true })
  animationFrameId = requestAnimationFrame(draw)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animationFrameId)
})
</script>
