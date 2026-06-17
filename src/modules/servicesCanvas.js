/**
 * Services Canvas — floating 3D automotive diagnostic modules.
 * Each shape is a composite group built from primitives to resemble
 * a real car component: engine, oil drum, brake disc, wheel, etc.
 * Hover → explode scale + glow burst + tooltip.
 * Click → add to Service Bay.
 */
import * as THREE from 'three'
import { getServiceBay } from './serviceBay.js'

// ── Automotive shape builders ────────────────────────────────
function buildEngine(color) {
  // Engine block: box + 3 cylinder heads on top
  const g = new THREE.Group()
  const blockMat = mat(color, 0.95, 0.1)
  const block = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.55, 0.7), blockMat)
  g.add(block)
  for (let i = -1; i <= 1; i++) {
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.3, 16), mat(color, 0.9, 0.15))
    cyl.position.set(i * 0.32, 0.42, 0)
    g.add(cyl)
    // valve cover ring
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.02, 8, 24), emissiveMat(color))
    ring.rotation.x = Math.PI / 2
    ring.position.set(i * 0.32, 0.57, 0)
    g.add(ring)
  }
  // intake manifold
  const manifold = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.1, 10), mat(color, 0.98, 0.05))
  manifold.rotation.z = Math.PI / 2
  manifold.position.set(0, 0.15, 0.42)
  g.add(manifold)
  addEdges(g, color)
  return g
}

function buildOilDrum(color) {
  // Cylindrical drum + cap + level indicator line
  const g = new THREE.Group()
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.85, 32), mat(color, 0.85, 0.2)))
  // top cap
  g.add(obj(new THREE.CylinderGeometry(0.38, 0.38, 0.06, 32), mat(color, 0.95, 0.1), 0, 0.45, 0))
  // nozzle
  g.add(obj(new THREE.CylinderGeometry(0.07, 0.1, 0.25, 12), mat(color, 0.9, 0.1), 0, 0.6, 0))
  // fluid level ring
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.39, 0.018, 8, 48), emissiveMat(color))
  ring.rotation.x = Math.PI / 2
  ring.position.y = 0.1
  g.add(ring)
  addEdges(g, color)
  return g
}

function buildBrakeDisc(color) {
  // Vented disc rotor + caliper
  const g = new THREE.Group()
  // main disc
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.07, 48), mat(color, 0.95, 0.1)))
  // hub center
  g.add(obj(new THREE.CylinderGeometry(0.14, 0.14, 0.14, 16), mat(color, 0.98, 0.05), 0, 0, 0))
  // vent slots — 6 rectangular cutout indicators (rings)
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2
    const slot = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.22), emissiveMat(color))
    slot.position.set(Math.cos(angle) * 0.35, 0, Math.sin(angle) * 0.35)
    slot.rotation.y = angle
    g.add(slot)
  }
  // caliper
  const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.18, 0.38), mat(color, 0.88, 0.25))
  caliper.position.set(0.6, 0, 0)
  g.add(caliper)
  g.rotation.x = Math.PI / 2
  addEdges(g, color)
  return g
}

function buildWheel(color) {
  // Tyre profile + rim + spokes
  const g = new THREE.Group()
  // tyre
  g.add(new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.18, 20, 64), mat(0x222233, 0.3, 0.9)))
  // rim dish
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.07, 32), mat(color, 0.98, 0.05)))
  // 5 spokes
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.32), mat(color, 0.95, 0.1))
    spoke.position.set(Math.cos(angle) * 0.18, 0, Math.sin(angle) * 0.18)
    spoke.rotation.y = angle
    g.add(spoke)
  }
  // center cap with emissive ring
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.09, 16), emissiveMat(color))
  g.add(cap)
  g.rotation.x = Math.PI / 2
  addEdges(g, color)
  return g
}

function buildGearbox(color) {
  // Transmission housing + 2 interlocking gears
  const g = new THREE.Group()
  g.add(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.5), mat(color, 0.9, 0.2)))
  // gear 1
  const gear1 = buildGear(color, 0.26, 8)
  gear1.position.set(-0.2, 0.2, 0.28)
  g.add(gear1)
  // gear 2 (smaller)
  const gear2 = buildGear(color, 0.16, 6)
  gear2.position.set(0.28, 0.1, 0.28)
  g.add(gear2)
  // output shaft
  g.add(obj(new THREE.CylinderGeometry(0.05, 0.05, 0.55, 12), mat(color, 0.98, 0.05), 0.38, 0, 0))
  addEdges(g, color)
  return g
}

function buildACUnit(color) {
  // Compressor body + fins + refrigerant line
  const g = new THREE.Group()
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.7, 24), mat(color, 0.88, 0.2)))
  // cooling fins
  for (let i = 0; i < 8; i++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.04, 0.04), mat(color, 0.9, 0.15))
    fin.position.y = -0.28 + i * 0.08
    g.add(fin)
  }
  // refrigerant coil
  const coil = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.035, 8, 40), emissiveMat(color))
  coil.rotation.x = Math.PI / 2
  coil.position.y = 0.42
  g.add(coil)
  addEdges(g, color)
  return g
}

function buildDetailingOrb(color) {
  // Polish orb — layered spheres + orbit ring
  const g = new THREE.Group()
  g.add(new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 32), mat(color, 0.98, 0.02)))
  // inner glow sphere
  const inner = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 24), emissiveMat(color))
  g.add(inner)
  // 3 orbit rings at different angles
  const angles = [0, Math.PI / 3, -Math.PI / 3]
  angles.forEach(a => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.018, 8, 64), emissiveMat(color))
    ring.rotation.x = a
    ring.rotation.z = a * 0.5
    g.add(ring)
  })
  return g
}

function buildSuspension(color) {
  // Coilover — spring coil + shock body
  const g = new THREE.Group()
  // shock absorber body
  g.add(obj(new THREE.CylinderGeometry(0.1, 0.1, 0.7, 16), mat(color, 0.95, 0.1), 0, 0, 0))
  // spring coil — stacked torus rings
  for (let i = 0; i < 10; i++) {
    const coil = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.04, 8, 24), mat(color, 0.85, 0.2))
    coil.rotation.x = Math.PI / 2
    coil.position.y = -0.3 + i * 0.065
    g.add(coil)
  }
  // top mount
  g.add(obj(new THREE.CylinderGeometry(0.22, 0.22, 0.06, 20), mat(color, 0.95, 0.1), 0, 0.37, 0))
  // bottom mount
  g.add(obj(new THREE.CylinderGeometry(0.16, 0.16, 0.06, 20), mat(color, 0.95, 0.1), 0, -0.38, 0))
  // neon accent ring at center
  const accent = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.02, 8, 32), emissiveMat(color))
  accent.rotation.x = Math.PI / 2
  g.add(accent)
  addEdges(g, color)
  return g
}

// ── Helper factories ─────────────────────────────────────────
function mat(color, metalness = 0.9, roughness = 0.15) {
  return new THREE.MeshStandardMaterial({ color, metalness, roughness })
}
function emissiveMat(color) {
  return new THREE.MeshStandardMaterial({
    color, emissive: color, emissiveIntensity: 1.2, metalness: 0.3, roughness: 0.4
  })
}
function obj(geo, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, material)
  m.position.set(x, y, z)
  return m
}
function buildGear(color, r, teeth) {
  const g = new THREE.Group()
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.07, 24), mat(color, 0.95, 0.1)))
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.07, 0.06), mat(color, 0.9, 0.15))
    tooth.position.set(Math.cos(a) * (r + 0.04), 0, Math.sin(a) * (r + 0.04))
    tooth.rotation.y = a
    g.add(tooth)
  }
  return g
}
function addEdges(group, color) {
  group.traverse(child => {
    if (child.isMesh) {
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(child.geometry, 25),
        new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.25 })
      )
      child.add(edges)
    }
  })
}

// ── Shape registry ───────────────────────────────────────────
const BUILDERS = {
  engine:     buildEngine,
  oilDrum:    buildOilDrum,
  brakeDisc:  buildBrakeDisc,
  wheel:      buildWheel,
  gearbox:    buildGearbox,
  acUnit:     buildACUnit,
  detailing:  buildDetailingOrb,
  suspension: buildSuspension
}

// ── Main init ────────────────────────────────────────────────
export function initServicesCanvas(services) {
  const canvas = document.getElementById('services-canvas')
  const tooltip = document.getElementById('service-tooltip')
  if (!canvas || !tooltip) return

  const wrap = document.getElementById('services-canvas-wrap')

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  renderer.shadowMap.enabled = false

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(52, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
  camera.position.set(0, 0, 11)

  // Lighting — warm key + cool fill for that garage feel
  scene.add(new THREE.AmbientLight(0x08081a, 4))
  const key = new THREE.DirectionalLight(0xffffff, 3)
  key.position.set(-6, 8, 6)
  scene.add(key)
  const fill = new THREE.DirectionalLight(0x00f0ff, 2.5)
  fill.position.set(6, -4, 4)
  scene.add(fill)
  const rim = new THREE.DirectionalLight(0x7b2fff, 1.5)
  rim.position.set(0, -6, -4)
  scene.add(rim)

  // ── Floating label sprites ────────────────────────────────
  // We'll overlay HTML labels instead of 3D sprites for crisp text

  // ── Build modules ─────────────────────────────────────────
  const modules = []
  const cols = 4
  const rows = Math.ceil(services.length / cols)
  const spacingX = 3.2
  const spacingY = 3.0

  services.forEach((svc, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const gx = (col - (cols - 1) / 2) * spacingX
    const gy = ((rows - 1) / 2 - row) * spacingY

    const builder = BUILDERS[svc.shape] || buildEngine
    const group = builder(svc.color)
    group.position.set(gx, gy, 0)
    group.userData = {
      svc,
      basePos: new THREE.Vector3(gx, gy, 0),
      hovered: false,
      floatOffset: Math.random() * Math.PI * 2,
      rotSpeed: { x: 0.003 + Math.random() * 0.003, y: 0.005 + Math.random() * 0.004 }
    }
    scene.add(group)

    // Per-module point light (off by default, lit on hover)
    const pointLight = new THREE.PointLight(svc.color, 0, 5)
    pointLight.position.set(gx, gy, 1)
    scene.add(pointLight)

    // ── Invisible hit sphere — large, catches hover from any angle ──
    const hitGeo = new THREE.SphereGeometry(1.1, 8, 8)
    const hitMat = new THREE.MeshBasicMaterial({ visible: false, side: THREE.FrontSide })
    const hitSphere = new THREE.Mesh(hitGeo, hitMat)
    hitSphere.userData.moduleRef = { group, pointLight }
    group.add(hitSphere) // moves with group automatically

    // Collect hit sphere (not visible meshes) for raycasting
    modules.push({ group, pointLight, hitSphere })
  })

  // ── Raycaster — uses hit spheres for reliable hover ──────
  const raycaster = new THREE.Raycaster()
  raycaster.params.Points = { threshold: 0.1 }
  const mouse = new THREE.Vector2()
  let hoveredGroup = null

  // Smooth tooltip position (lerped)
  let tipX = 0, tipY = 0, tipTX = 0, tipTY = 0
  let tooltipVisible = false

  function updateMouse(e) {
    const rect = canvas.getBoundingClientRect()
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  }

  function getTargetTooltipPos(e) {
    const rect = wrap.getBoundingClientRect()
    let tx = e.clientX - rect.left + 28
    let ty = e.clientY - rect.top - 24
    if (tx + 275 > rect.width) tx = e.clientX - rect.left - 285
    if (ty + 200 > rect.height) ty = e.clientY - rect.top - 200
    if (ty < 8) ty = 8
    return { tx, ty }
  }

  // Animate tooltip position smoothly
  function animTooltip() {
    requestAnimationFrame(animTooltip)
    tipX += (tipTX - tipX) * 0.18
    tipY += (tipTY - tipY) * 0.18
    tooltip.style.left = tipX + 'px'
    tooltip.style.top  = tipY + 'px'
  }
  animTooltip()

  wrap.addEventListener('mousemove', (e) => {
    updateMouse(e)
    raycaster.setFromCamera(mouse, camera)

    const hitSpheres = modules.map(m => m.hitSphere)
    const hits = raycaster.intersectObjects(hitSpheres, false)

    const hitMod = hits.length
      ? modules.find(m => m.hitSphere === hits[0].object)
      : null

    // Unhover previous
    if (hoveredGroup && hoveredGroup !== hitMod) {
      hoveredGroup.group.userData.hovered = false
      hoveredGroup = null
      tooltip.classList.add('hidden')
      tooltipVisible = false
    }

    if (hitMod) {
      // New hover
      if (hitMod !== hoveredGroup) {
        hoveredGroup = hitMod
        hoveredGroup.group.userData.hovered = true
        const svc = hoveredGroup.group.userData.svc
        tooltip.querySelector('.tooltip-title').textContent = svc.title
        tooltip.querySelector('.tooltip-desc').textContent  = svc.desc
        tooltip.querySelector('.tooltip-price').textContent = `${svc.price} ${svc.currency || 'Lei'}`
        tooltip.classList.remove('hidden')
        tooltipVisible = true
        tooltip.querySelector('.tooltip-add').onclick = () => getServiceBay().add(svc)

        // Snap position instantly on first show, then lerp follows
        const { tx, ty } = getTargetTooltipPos(e)
        tipX = tx; tipY = ty
        tipTX = tx; tipTY = ty
      }

      // Update target position every frame
      const { tx, ty } = getTargetTooltipPos(e)
      tipTX = tx; tipTY = ty
    }
  })

  wrap.addEventListener('mouseleave', () => {
    tooltip.classList.add('hidden')
    tooltipVisible = false
    if (hoveredGroup) { hoveredGroup.group.userData.hovered = false; hoveredGroup = null }
  })

  wrap.addEventListener('click', (e) => {
    updateMouse(e)
    raycaster.setFromCamera(mouse, camera)
    const hits = raycaster.intersectObjects(modules.map(m => m.hitSphere), false)
    if (hits.length) {
      const m = modules.find(mod => mod.hitSphere === hits[0].object)
      if (m) getServiceBay().add(m.group.userData.svc)
    }
  })

  // ── Resize ────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    const w = canvas.clientWidth, h = canvas.clientHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  })

  // ── Animate ───────────────────────────────────────────────
  let t = 0
  const _v3 = new THREE.Vector3()

  function animate() {
    requestAnimationFrame(animate)
    t += 0.008

    modules.forEach(({ group, pointLight }) => {
      const { basePos, hovered, floatOffset, rotSpeed } = group.userData

      // Gentle float
      group.position.y = basePos.y + Math.sin(t + floatOffset) * 0.12

      // Slow auto-rotation
      group.rotation.x += rotSpeed.x
      group.rotation.y += rotSpeed.y

      if (hovered) {
        // Scale up, push forward, blast light
        group.scale.lerp(_v3.set(1.35, 1.35, 1.35), 0.12)
        group.position.z += (1.2 - group.position.z) * 0.12
        pointLight.intensity += (4.0 - pointLight.intensity) * 0.12
      } else {
        group.scale.lerp(_v3.set(1, 1, 1), 0.1)
        group.position.z += (0 - group.position.z) * 0.08
        pointLight.intensity += (0 - pointLight.intensity) * 0.08
      }
      pointLight.position.set(group.position.x, group.position.y, group.position.z + 1)
    })

    renderer.render(scene, camera)
  }
  animate()
}
