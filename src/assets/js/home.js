import { appConfig } from './config.js'

function openRoute(route) {
  if (typeof route === 'string' && route) {
    window.location.href = route
  }
}

function bindModuleCards() {
  document.addEventListener('click', (event) => {
    const target = event.target

    if (!(target instanceof Element)) return

    const button = target.closest('button[data-route]')
    if (!button) return

    openRoute(button.getAttribute('data-route'))
  })
}

function setProjectCounter(total) {
  const counter = document.getElementById('project-counter')
  if (!counter) return

  const value = Number.isFinite(total) ? total : 0
  counter.textContent = String(value)
  counter.setAttribute('aria-label', `Proyectos: ${value}`)
  counter.setAttribute('title', `Proyectos: ${value}`)
}

async function loadProjectCounter() {
  if (!appConfig.SUPABASE_URL || !appConfig.SUPABASE_ANON_KEY) {
    setProjectCounter(0)
    return
  }

  try {
    const response = await fetch(`${appConfig.SUPABASE_URL}/rest/v1/projects?select=id`, {
      headers: {
        apikey: appConfig.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${appConfig.SUPABASE_ANON_KEY}`,
      },
    })

    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const projects = await response.json()
    setProjectCounter(Array.isArray(projects) ? projects.length : 0)
  } catch (error) {
    console.error('No se pudo obtener el total de proyectos:', error)
    setProjectCounter(0)
  }
}

function startHeroCanvas() {
  const canvas = document.getElementById('hero-canvas')
  if (!(canvas instanceof HTMLCanvasElement)) return

  const context = canvas.getContext('2d')
  if (!context) return

  let width = 0
  let height = 0
  let particles = []
  let frameId = null

  const colors = [
    'rgba(0, 42, 68, 0.7)',
    'rgba(0, 69, 107, 0.65)',
    'rgba(241, 137, 24, 0.55)',
    'rgba(242, 179, 91, 0.55)',
  ]

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min
  }

  function createParticles() {
    const count = Math.max(28, Math.min(90, Math.floor((width * height) / 20000)))

    particles = Array.from({ length: count }, () => ({
      x: randomBetween(0, width),
      y: randomBetween(0, height),
      vx: randomBetween(-0.35, 0.35),
      vy: randomBetween(-0.35, 0.35),
      radius: randomBetween(2.2, 4.6),
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
  }

  function resize() {
    width = canvas.width = window.innerWidth
    height = canvas.height = window.innerHeight
    createParticles()
  }

  function draw() {
    context.clearRect(0, 0, width, height)

    const maxDistance = Math.min(180, Math.max(120, width * 0.12))

    particles.forEach((particle, index) => {
      particle.x += particle.vx
      particle.y += particle.vy

      if (particle.x < -20 || particle.x > width + 20) particle.vx *= -1
      if (particle.y < -20 || particle.y > height + 20) particle.vy *= -1

      context.beginPath()
      context.fillStyle = particle.color
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
      context.fill()

      particles.slice(index + 1).forEach((other) => {
        const distance = Math.hypot(particle.x - other.x, particle.y - other.y)
        if (distance >= maxDistance) return

        context.strokeStyle = `rgba(0, 69, 107, ${(1 - distance / maxDistance) * 0.35})`
        context.lineWidth = 1
        context.beginPath()
        context.moveTo(particle.x, particle.y)
        context.lineTo(other.x, other.y)
        context.stroke()
      })
    })

    frameId = requestAnimationFrame(draw)
  }

  resize()
  draw()

  window.addEventListener('resize', () => {
    if (frameId) cancelAnimationFrame(frameId)
    resize()
    draw()
  })
}

bindModuleCards()
loadProjectCounter()
startHeroCanvas()
