/**
 * Service Bay — holographic panel where selected services snap together.
 * Renders a Three.js chassis build preview in the bay canvas.
 * Exposes getServiceBay() singleton for other modules.
 */
import * as THREE from 'three'

let bayInstance = null

export function getServiceBay() {
  return bayInstance
}

export function initServiceBay() {
  const panel = document.getElementById('service-bay')
  const backdrop = document.getElementById('bay-backdrop')
  const openBtn = document.getElementById('open-bay')
  const closeBtn = document.getElementById('close-bay')
  const bayItems = document.getElementById('bay-items')
  const bayPrice = document.getElementById('bay-price')
  const bayCountEls = document.querySelectorAll('.bay-count')
  const checkoutBtn = document.getElementById('checkout-btn')
  const bayCanvas = document.getElementById('bay-canvas')

  // ── Bay 3D Mini Scene ────────────────────────────────────
  let bayRenderer, bayScene, bayCamera, bayMeshes = [], bayAnimFrame

  function initBayCanvas() {
    if (!bayCanvas) return

    bayRenderer = new THREE.WebGLRenderer({ canvas: bayCanvas, antialias: true, alpha: true })
    bayRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    bayRenderer.setSize(bayCanvas.clientWidth, bayCanvas.clientHeight)

    bayScene = new THREE.Scene()
    bayCamera = new THREE.PerspectiveCamera(60, bayCanvas.clientWidth / bayCanvas.clientHeight, 0.1, 100)
    bayCamera.position.set(0, 0, 8)

    bayScene.add(new THREE.AmbientLight(0x050510, 2))
    const bl = new THREE.DirectionalLight(0x00f0ff, 3)
    bl.position.set(-3, 5, 5)
    bayScene.add(bl)
    const bl2 = new THREE.DirectionalLight(0x7b2fff, 2)
    bl2.position.set(3, -2, 3)
    bayScene.add(bl2)

    // Grid
    const grid = new THREE.GridHelper(20, 20, 0x00f0ff, 0x001122)
    grid.position.y = -2
    grid.material.opacity = 0.2
    grid.material.transparent = true
    bayScene.add(grid)

    let bayT = 0
    function bayAnimate() {
      bayAnimFrame = requestAnimationFrame(bayAnimate)
      bayT += 0.015

      bayMeshes.forEach((m, i) => {
        m.rotation.y = bayT + (i / bayMeshes.length) * Math.PI * 2
        m.rotation.x = Math.sin(bayT * 0.5 + i) * 0.3
        // Snap into orbit
        const angle = (i / Math.max(bayMeshes.length, 1)) * Math.PI * 2
        const radius = Math.min(2.5, 0.8 * bayMeshes.length)
        m.position.x += (Math.cos(angle + bayT * 0.2) * radius - m.position.x) * 0.05
        m.position.y += (Math.sin(bayT * 0.8 + i) * 0.5 - m.position.y) * 0.05
        m.position.z += (Math.sin(angle + bayT * 0.2) * radius * 0.3 - m.position.z) * 0.05
      })

      bayRenderer.render(bayScene, bayCamera)
    }
    bayAnimate()
  }

  initBayCanvas()

  // ── State ────────────────────────────────────────────────
  const items = new Map() // id → svc

  function updateBayCount() {
    const count = items.size
    bayCountEls.forEach(el => { el.textContent = count })
  }

  function renderItems() {
    bayItems.innerHTML = ''

    if (items.size === 0) {
      bayItems.innerHTML = `
        <div class="bay-empty">
          <span>⬡</span>
          Selectează servicii din modulele de mai sus pentru a construi pachetul tău personalizat.
        </div>
      `
      bayPrice.textContent = '0 Lei'
      return
    }

    let total = 0
    items.forEach((svc) => {
      total += svc.price
      const el = document.createElement('div')
      el.className = 'bay-item'
      el.innerHTML = `
        <span class="bay-item-icon">${svc.icon}</span>
        <span class="bay-item-name">${svc.title}</span>
        <span class="bay-item-price">${svc.price} ${svc.currency || 'Lei'}</span>
        <button class="bay-item-remove" data-id="${svc.id}" aria-label="Elimină">✕</button>
      `
      el.querySelector('.bay-item-remove').addEventListener('click', () => {
        bayInstance.remove(svc.id)
      })
      bayItems.appendChild(el)
    })

    bayPrice.textContent = `${total} Lei`
  }

  function syncBayMeshes() {
    // Clear old
    bayMeshes.forEach(m => bayScene.remove(m))
    bayMeshes = []

    const SHAPE_MAP = {
      torusKnot: () => new THREE.TorusKnotGeometry(0.4, 0.12, 80, 16, 2, 3),
      cylinder: () => new THREE.CylinderGeometry(0.3, 0.4, 0.7, 24),
      torus: () => new THREE.TorusGeometry(0.45, 0.15, 24, 60),
      ring: () => new THREE.TorusGeometry(0.5, 0.06, 12, 60),
      box: () => new THREE.BoxGeometry(0.6, 0.6, 0.6),
      octahedron: () => new THREE.OctahedronGeometry(0.5),
      icosahedron: () => new THREE.IcosahedronGeometry(0.5),
      dodecahedron: () => new THREE.DodecahedronGeometry(0.5)
    }

    items.forEach((svc) => {
      const geo = (SHAPE_MAP[svc.shape] || SHAPE_MAP.icosahedron)()
      const mat = new THREE.MeshStandardMaterial({
        color: svc.color,
        emissive: svc.color,
        emissiveIntensity: 0.8,
        metalness: 0.85,
        roughness: 0.2
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 2, 0)
      bayScene.add(mesh)
      bayMeshes.push(mesh)

      // Connecting line to origin
      const points = [mesh.position.clone(), new THREE.Vector3(0, 0, 0)]
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points)
      const lineMat = new THREE.LineBasicMaterial({ color: svc.color, transparent: true, opacity: 0.3 })
      const line = new THREE.Line(lineGeo, lineMat)
      bayScene.add(line)
    })
  }

  // ── Public API ───────────────────────────────────────────
  bayInstance = {
    add(svc) {
      items.set(svc.id, svc)
      updateBayCount()
      renderItems()
      syncBayMeshes()
      // Auto open bay
      panel.classList.remove('bay-closed')
      panel.classList.add('bay-open')
      backdrop.classList.add('active')
      // Highlight card
      document.querySelectorAll('.service-card').forEach(card => {
        if (card.dataset.id === svc.id) card.classList.add('selected')
      })
    },
    remove(id) {
      items.delete(id)
      updateBayCount()
      renderItems()
      syncBayMeshes()
      document.querySelectorAll('.service-card').forEach(card => {
        if (card.dataset.id === id) card.classList.remove('selected')
      })
    },
    has(id) {
      return items.has(id)
    }
  }

  // ── Panel open/close ─────────────────────────────────────
  openBtn.addEventListener('click', () => {
    panel.classList.remove('bay-closed')
    panel.classList.add('bay-open')
    backdrop.classList.add('active')
  })

  function closePanel() {
    panel.classList.remove('bay-open')
    panel.classList.add('bay-closed')
    backdrop.classList.remove('active')
  }
  closeBtn.addEventListener('click', closePanel)
  backdrop.addEventListener('click', closePanel)

  checkoutBtn.addEventListener('click', () => {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })
    closePanel()
  })

  // Init empty state
  renderItems()
}
