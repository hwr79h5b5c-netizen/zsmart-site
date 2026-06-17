/**
 * Diagnostic Canvas — rotating engine wireframe with
 * scanning animation and sensor data viz.
 */
import * as THREE from 'three'

export function initDiagCanvas() {
  const canvas = document.getElementById('diag-canvas')
  if (!canvas) return

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.toneMapping = THREE.ACESFilmicToneMapping

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
  camera.position.set(0, 1, 7)

  // Lights
  scene.add(new THREE.AmbientLight(0x050510, 2))
  const l = new THREE.DirectionalLight(0x00f0ff, 4)
  l.position.set(-4, 6, 4)
  scene.add(l)

  // Central engine-like geometry — cylinders + torus combo
  const group = new THREE.Group()
  scene.add(group)

  // Engine block base
  const blockGeo = new THREE.BoxGeometry(2, 1, 3)
  const blockMat = new THREE.MeshStandardMaterial({
    color: 0x112233,
    metalness: 0.9,
    roughness: 0.3,
    wireframe: false
  })
  group.add(new THREE.Mesh(blockGeo, blockMat))

  // Wireframe overlay
  const wireMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.15 })
  group.add(new THREE.Mesh(blockGeo, wireMat))

  // Cylinders (pistons)
  const pistonPositions = [[-0.7, 0.7, -0.8], [0, 0.7, -0.8], [0.7, 0.7, -0.8],
                            [-0.7, 0.7, 0.8], [0, 0.7, 0.8], [0.7, 0.7, 0.8]]
  pistonPositions.forEach(([x, y, z]) => {
    const cylGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.8, 16)
    const cylMat = new THREE.MeshStandardMaterial({ color: 0x334455, metalness: 0.95, roughness: 0.1 })
    const cyl = new THREE.Mesh(cylGeo, cylMat)
    cyl.position.set(x, y, z)
    group.add(cyl)

    // Neon ring at top of each piston
    const ringGeo = new THREE.TorusGeometry(0.23, 0.015, 8, 32)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2
    ring.position.set(x, y + 0.4, z)
    group.add(ring)
  })

  // Crankshaft
  const crankGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.5, 16)
  const crankMat = new THREE.MeshStandardMaterial({ color: 0x556677, metalness: 0.98, roughness: 0.05 })
  const crank = new THREE.Mesh(crankGeo, crankMat)
  crank.rotation.z = Math.PI / 2
  crank.position.y = -0.2
  group.add(crank)

  // Scan plane — a thin semi-transparent rect that travels up and down
  const scanGeo = new THREE.PlaneGeometry(4, 0.08)
  const scanMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.6, side: THREE.DoubleSide })
  const scanPlane = new THREE.Mesh(scanGeo, scanMat)
  scene.add(scanPlane)

  // Grid
  const grid = new THREE.GridHelper(20, 20, 0x00f0ff, 0x001122)
  grid.position.y = -2
  grid.material.opacity = 0.15
  grid.material.transparent = true
  scene.add(grid)

  // Particles
  const pCount = 800
  const pPos = new Float32Array(pCount * 3)
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 12
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 8
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 12
  }
  const pGeo = new THREE.BufferGeometry()
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
  const pMat = new THREE.PointsMaterial({ size: 0.04, color: 0x00f0ff, transparent: true, opacity: 0.4 })
  scene.add(new THREE.Points(pGeo, pMat))

  // Animate HUD bars when in view
  let hudsAnimated = false
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !hudsAnimated) {
      hudsAnimated = true
      document.querySelectorAll('.hud-fill').forEach(fill => {
        const pct = fill.dataset.pct
        setTimeout(() => { fill.style.width = pct + '%' }, 200)
      })
    }
  })
  const diagSection = document.getElementById('diagnostic')
  if (diagSection) observer.observe(diagSection)

  // Resize
  function onResize() {
    const w = canvas.clientWidth, h = canvas.clientHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  window.addEventListener('resize', onResize)

  let t = 0
  function animate() {
    requestAnimationFrame(animate)
    t += 0.01

    group.rotation.y = t * 0.4
    group.rotation.x = Math.sin(t * 0.3) * 0.15

    // Scan plane animation
    scanPlane.position.y = Math.sin(t * 1.2) * 1.5
    scanPlane.rotation.y = t * 0.2
    scanMat.opacity = 0.4 + Math.sin(t * 3) * 0.2

    renderer.render(scene, camera)
  }
  animate()
}
