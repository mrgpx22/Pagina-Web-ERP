import { createClient } from '@supabase/supabase-js'
import { appConfig } from './config.js'

const sectionNames = {
  clientes: 'Clientes',
  analisis_competencia: 'Analisis Competencia',
  marketing: 'Campanyas de Marketing',
  ventas: 'Finanzas',
  proveedores: 'Proveedores',
  rrhh: 'RRHH',
  inteligencia_negocio: 'Inteligencia de Negocio',
  id: 'I+D',
  documentacion: 'Documentacion',
  produccion: 'Produccion',
}

const supabaseReady = Boolean(appConfig.SUPABASE_URL && appConfig.SUPABASE_ANON_KEY)
const supabase = supabaseReady
  ? createClient(appConfig.SUPABASE_URL, appConfig.SUPABASE_ANON_KEY)
  : null

if (!supabaseReady) {
  console.warn('[SUPABASE] Configuracion incompleta. Define las variables VITE_SUPABASE_*.')
}

function getCurrentSection() {
  const section = document.body?.dataset?.section?.trim()
  return sectionNames[section?.toLowerCase()] || section || 'Clientes'
}

function setProjectCounter(total) {
  const counter = document.getElementById('project-counter')
  if (!counter) return

  const value = Number.isFinite(total) ? total : 0
  counter.textContent = String(value)
  counter.setAttribute('aria-label', `Proyectos: ${value}`)
  counter.setAttribute('title', `Proyectos: ${value}`)
}

function isAbsoluteUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value)
}

function getStorageUrl(path) {
  if (!path) return ''
  if (isAbsoluteUrl(path)) return path
  if (!supabase) return ''

  const { data } = supabase.storage.from(appConfig.STORAGE_BUCKET).getPublicUrl(path)
  return data?.publicUrl || ''
}

function getYouTubeId(value) {
  const video = typeof value === 'string' ? value.trim() : ''
  if (!video) return ''
  if (/^[a-zA-Z0-9_-]{11}$/.test(video)) return video

  try {
    const url = new URL(video)
    const host = url.hostname.replace(/^www\./i, '').toLowerCase()

    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0] || ''
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : ''
    }

    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const queryId = url.searchParams.get('v')
      if (queryId && /^[a-zA-Z0-9_-]{11}$/.test(queryId)) return queryId

      const parts = url.pathname.split('/').filter(Boolean)
      const marker = ['embed', 'shorts', 'live', 'v'].find((part) => parts.includes(part))
      if (!marker) return ''

      const id = parts[parts.indexOf(marker) + 1] || ''
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : ''
    }
  } catch {
    return ''
  }

  return ''
}

function getVideoSource(value) {
  const rawVideo = typeof value === 'string' ? value.trim() : ''
  if (!rawVideo) return { type: 'none', url: '' }

  const youtubeId = getYouTubeId(rawVideo)
  if (youtubeId) {
    return {
      type: 'youtube',
      url: `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
      watchUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
    }
  }

  const url = getStorageUrl(rawVideo)
  return url ? { type: 'video', url } : { type: 'none', url: '' }
}

function ensureYoutubeFrame(videoElement) {
  if (!videoElement?.parentElement) return null

  const existing = document.getElementById('modalYoutube')
  if (existing instanceof HTMLIFrameElement) return existing

  const frame = document.createElement('iframe')
  frame.id = 'modalYoutube'
  frame.title = 'Video de YouTube'
  frame.allow =
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
  frame.allowFullscreen = true
  frame.referrerPolicy = 'strict-origin-when-cross-origin'
  Object.assign(frame.style, {
    display: 'none',
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
    border: '0',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    background: '#000',
  })

  videoElement.parentElement.appendChild(frame)
  return frame
}

function createProjectFigure(project) {
  const figure = document.createElement('figure')
  figure.dataset.id = project.id || ''
  figure.dataset.name = project.name || ''
  figure.dataset.imagePath = project.image_path || ''
  figure.dataset.videoPath = project.video_path || ''
  figure.dataset.text = project.description || ''

  const card = document.createElement('div')
  card.className = `project-card${project.completed ? ' project-complete' : ''}`

  const image = document.createElement('img')
  image.src = getStorageUrl(project.image_path)
  image.alt = project.name || ''
  image.draggable = false

  const overlay = document.createElement('div')
  overlay.className = 'overlay'
  overlay.textContent = project.name || ''

  const completionFrame = document.createElement('div')
  completionFrame.className = 'completion-frame'

  card.append(image, overlay, completionFrame)
  figure.appendChild(card)

  return figure
}

function injectCarouselRangeStyles() {
  const style = document.createElement('style')
  style.innerHTML = `
    #carousel, #carousel figure, .project-card, .overlay, img {
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -webkit-user-drag: none;
      pointer-events: auto;
    }

    .carousel-scrollbar-container {
      width: 60%;
      max-width: 400px;
      margin: 40px auto 0;
      position: relative;
      z-index: 100;
      text-align: center;
      display: flex;
      justify-content: center;
    }

    .carousel-range {
      -webkit-appearance: none;
      width: 100%;
      height: 6px;
      background: rgba(15, 37, 51, 0.3);
      border-radius: 5px;
      outline: none;
      transition: background 0.3s;
      cursor: pointer;
    }

    .carousel-range:hover {
      background: rgba(15, 37, 51, 0.5);
    }

    .carousel-range::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 40px;
      height: 12px;
      border-radius: 10px;
      background: #f18918;
      box-shadow: 0 0 10px rgba(241, 137, 24, 0.5);
      transition: transform 0.1s;
    }

    .carousel-range::-webkit-slider-thumb:active {
      transform: scale(1.1);
    }
  `
  document.head.appendChild(style)
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
    'rgba(0, 69, 107, 0.45)',
    'rgba(241, 137, 24, 0.45)',
    'rgba(0, 42, 68, 0.5)',
  ]

  function resize() {
    width = canvas.width = window.innerWidth
    height = canvas.height = window.innerHeight
    const count = Math.floor((width * height) / 25000)
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
  }

  function draw() {
    context.clearRect(0, 0, width, height)

    particles.forEach((particle, index) => {
      particle.x += particle.vx
      particle.y += particle.vy

      if (particle.x < 0 || particle.x > width) particle.vx *= -1
      if (particle.y < 0 || particle.y > height) particle.vy *= -1

      context.beginPath()
      context.fillStyle = particle.color
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
      context.fill()

      particles.slice(index + 1).forEach((other) => {
        const distance = Math.hypot(particle.x - other.x, particle.y - other.y)
        if (distance >= 140) return

        context.strokeStyle = `rgba(0,69,107,${(1 - distance / 140) * 0.25})`
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

function startProjectCarousel() {
  const carousel = document.getElementById('carousel')
  const modal = document.getElementById('modal')
  const modalText = document.getElementById('modalText')
  const modalVideo = document.getElementById('modalVideo')
  const modalYoutube =
    modalVideo instanceof HTMLVideoElement ? ensureYoutubeFrame(modalVideo) : null

  if (!carousel) {
    console.warn('Carousel no encontrado. Script detenido.')
    return
  }

  let rotation = 0
  let range = null
  let isRangeDragging = false
  let dragStartX = 0
  let dragStartRotation = 0
  let isDragging = false
  let moved = false

  const figures = () => carousel.querySelectorAll('figure')
  const count = () => figures().length
  const angle = () => (count() ? 360 / count() : 0)
  const baseRadius = () => (window.innerWidth >= 3000 ? 900 : 520)
  const radius = () => {
    const total = count()
    if (total <= 11) return baseRadius()
    if (total <= 16) return baseRadius() + 80
    if (total <= 20) return baseRadius() + 140
    return baseRadius() + 200
  }

  function updateRange() {
    if (!range || isRangeDragging) return

    const step = angle()
    if (!step) return

    let value = (-rotation % 360)
    if (value < 0) value += 360

    let index = value / step
    if (index > count() - 0.1) index = 0
    range.value = index
  }

  function updateTransform() {
    carousel.style.transform = `translateZ(-${radius()}px) rotateY(${rotation}deg)`
    updateRange()
  }

  function positionFigures() {
    const allFigures = figures()
    if (!allFigures.length) return

    const step = angle()
    const currentRadius = radius()
    const scale = allFigures.length > 16 ? 0.85 : 1

    allFigures.forEach((figure, index) => {
      figure.style.transform = `rotateY(${index * step}deg) translateZ(${currentRadius}px) scale(${scale})`
    })
  }

  function goToProject(index) {
    const step = angle()
    if (!step) return

    const targetRotation = -(index * step)
    const currentRotation = rotation % 360
    let delta = targetRotation - currentRotation

    if (delta > 180) delta -= 360
    if (delta < -180) delta += 360

    rotation += delta
    updateTransform()
  }

  function rotateBy(direction) {
    const step = angle()
    if (!step) return

    rotation += direction * step
    updateTransform()
  }

  function createRange() {
    const existing = document.querySelector('.carousel-scrollbar-container')
    if (existing) {
      range = existing.querySelector('.carousel-range')
      if (range) range.max = Math.max(0, count() - 1)
      return
    }

    const container = document.createElement('div')
    container.className = 'carousel-scrollbar-container'

    range = document.createElement('input')
    range.type = 'range'
    range.min = '0'
    range.max = String(Math.max(0, count() - 1))
    range.value = '0'
    range.step = '0.01'
    range.className = 'carousel-range'

    range.addEventListener('input', (event) => {
      isRangeDragging = true
      const value = Number.parseFloat(event.target.value)
      rotation = rotation - (rotation % 360) - value * angle()
      updateTransform()
      isRangeDragging = false
    })

    range.addEventListener('change', (event) => {
      const value = Math.round(Number.parseFloat(event.target.value))
      goToProject(value)
      range.value = value
    })

    container.appendChild(range)

    const holder = document.querySelector('.container') || carousel.parentElement
    holder.appendChild(container)
  }

  function closeModal() {
    if (!modal) return

    modal.classList.remove('active')

    if (modalVideo instanceof HTMLVideoElement) {
      modalVideo.pause()
      modalVideo.src = ''
      modalVideo.style.display = 'none'
    }

    if (modalYoutube) {
      modalYoutube.src = ''
      modalYoutube.style.display = 'none'
    }
  }

  function openProjectModal(figure) {
    if (!modal || !modalText) return

    const videoSource = getVideoSource(figure.dataset.videoPath)
    const title = document.createElement('h3')
    title.textContent = figure.dataset.name || ''

    const separator = document.createElement('div')
    separator.className = 'modal-separator'

    const description = document.createElement('p')
    description.textContent = figure.dataset.text || ''

    modalText.replaceChildren(title, separator, description)

    if (videoSource.watchUrl) {
      const row = document.createElement('p')
      const link = document.createElement('a')
      link.href = videoSource.watchUrl
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.textContent = 'Ver en YouTube'
      row.appendChild(link)
      modalText.appendChild(row)
    }

    modal.classList.add('active')

    if (videoSource.type === 'youtube' && modalYoutube) {
      modalYoutube.style.display = 'block'
      modalYoutube.src = videoSource.url

      if (modalVideo instanceof HTMLVideoElement) {
        modalVideo.pause()
        modalVideo.src = ''
        modalVideo.style.display = 'none'
      }
      return
    }

    if (videoSource.type === 'video' && modalVideo instanceof HTMLVideoElement) {
      modalVideo.style.display = 'block'
      modalVideo.src = videoSource.url
      modalVideo.play().catch((error) => console.log('Autoplay blocked', error))

      if (modalYoutube) {
        modalYoutube.src = ''
        modalYoutube.style.display = 'none'
      }
      return
    }

    if (modalVideo instanceof HTMLVideoElement) {
      modalVideo.pause()
      modalVideo.src = ''
      modalVideo.style.display = 'none'
    }

    if (modalYoutube) {
      modalYoutube.src = ''
      modalYoutube.style.display = 'none'
    }
  }

  function bindFigures() {
    figures().forEach((figure, index) => {
      figure.onclick = () => {
        if (moved) return

        goToProject(index)
        setTimeout(() => openProjectModal(figure), 500)
      }
    })
  }

  async function loadProjects() {
    if (!supabase) {
      setProjectCounter(0)
      return
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('section_id', getCurrentSection())
      .order('position', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      setProjectCounter(0)
      return
    }

    const projects = data || []
    setProjectCounter(projects.length)
    carousel.innerHTML = ''
    rotation = 0

    projects.forEach((project) => {
      carousel.appendChild(createProjectFigure(project))
    })

    bindFigures()
    positionFigures()
    createRange()
    updateTransform()
  }

  carousel.addEventListener('mousedown', (event) => {
    dragStartX = event.clientX
    dragStartRotation = rotation
    isDragging = true
    moved = false
    carousel.style.cursor = 'grabbing'
  })

  window.addEventListener('mousemove', (event) => {
    if (!isDragging) return

    const delta = event.clientX - dragStartX
    if (Math.abs(delta) > 5) {
      moved = true
      rotation = dragStartRotation + delta * 0.4
      updateTransform()
    }
  })

  window.addEventListener('mouseup', () => {
    if (isDragging && moved) {
      const step = angle()
      if (step) rotation = -(Math.round(-rotation / step) * step)
      updateTransform()
    }

    isDragging = false
    carousel.style.cursor = 'default'
  })

  carousel.addEventListener('touchstart', (event) => {
    dragStartX = event.touches[0].clientX
    dragStartRotation = rotation
    isDragging = true
    moved = false
  })

  carousel.addEventListener('touchmove', (event) => {
    if (!isDragging) return

    const delta = event.touches[0].clientX - dragStartX
    if (Math.abs(delta) > 5) {
      moved = true
      rotation = dragStartRotation + delta * 0.4
      updateTransform()
    }
  })

  carousel.addEventListener('touchend', () => {
    if (isDragging && moved) {
      const step = angle()
      if (step) rotation = -(Math.round(-rotation / step) * step)
      updateTransform()
    }

    isDragging = false
  })

  modal?.addEventListener('click', (event) => {
    if (event.target === modal) closeModal()
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal()
    if (event.key === 'ArrowRight') rotateBy(1)
    if (event.key === 'ArrowLeft') rotateBy(-1)
  })

  loadProjects()
  window.addEventListener('resize', () => {
    positionFigures()
    updateTransform()
  })
}

injectCarouselRangeStyles()
startProjectCarousel()
startHeroCanvas()
