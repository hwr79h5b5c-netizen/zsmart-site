/**
 * Hero Canvas — Three.js scene with:
 * - Metallic/glass car engine block centerpiece
 * - Orbiting particle field
 * - Neon grid floor
 * - Mouse parallax rotation
 * - Custom metallic + emissive shaders via MeshStandardMaterial
 */
import * as THREE from 'three'

export function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas')
  if (!canvas) return

  // ── Renderer ──────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  // ── Scene & Camera ────────────────────────────────────────
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    200
  )
  camera.position.set(0, 2, 12)

  // ── Lighting ──────────────────────────────────────────────
  const ambient = new THREE.AmbientLight(0x0a0a1a, 2)
  scene.add(ambient)

  const keyLight = new THREE.DirectionalLight(0x00f0ff, 3)
  keyLight.position.set(-5, 8, 5)
  keyLight.castShadow = true
  scene.add(keyLight)

  const rimLight = new THREE.DirectionalLight(0x7b2fff, 2)
  rimLight.position.set(8, 2, -5)
  scene.add(rimLight)

  const fillLight = new THREE.PointLight(0xff3c6e, 1.5, 30)
  fillLight.position.set(0, -3, 5)
  scene.add(fillLight)

  // ── Materials ─────────────────────────────────────────────
  const neonMat = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    emissive: 0x00f0ff,
    emissiveIntensity: 2.5,
    metalness: 0.2,
    roughness: 0.3
  })
  const neonPurpleMat = new THREE.MeshStandardMaterial({
    color: 0x7b2fff,
    emissive: 0x7b2fff,
    emissiveIntensity: 2,
    metalness: 0.2,
    roughness: 0.3
  })

  // ── Helper material factories ────────────────────────────
  function makeChromatMat() {
    return new THREE.MeshStandardMaterial({
      color: 0x99aabb,
      metalness: 0.98,
      roughness: 0.05,
      envMapIntensity: 2
    })
  }

  function makeGlassMat() {
    return new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.07,
      roughness: 0.0,
      metalness: 0.0,
      side: THREE.BackSide,
      depthWrite: false
    })
  }

  // ── Main Hero Object — Stylised Engine Core ────────────────
  const heroGroup = new THREE.Group()
  scene.add(heroGroup)

  // Central torus knot — engine turbine feel
  const knotGeo = new THREE.TorusKnotGeometry(1.6, 0.45, 200, 32, 3, 5)
  const knotMesh = new THREE.Mesh(knotGeo, makeChromatMat())
  heroGroup.add(knotMesh)

  // Outer glass shell
  const shellGeo = new THREE.SphereGeometry(2.8, 64, 64)
  const shellMesh = new THREE.Mesh(shellGeo, makeGlassMat())
  heroGroup.add(shellMesh)

  // Neon rings
  for (let i = 0; i < 3; i++) {
    const ringGeo = new THREE.TorusGeometry(2.0 + i * 0.5, 0.025, 16, 120)
    const ring = new THREE.Mesh(ringGeo, i % 2 === 0 ? neonMat : neonPurpleMat)
    ring.rotation.x = Math.PI / 3 * i
    ring.rotation.y = Math.PI / 4 * i
    heroGroup.add(ring)
  }

  // Orbiting chrome spheres
  const orbitGroup = new THREE.Group()
  heroGroup.add(orbitGroup)
  const orbitColors = [0x00f0ff, 0x7b2fff, 0xff3c6e, 0xffaa00, 0x00ff88]
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2
    const radius = 3.5
    const sphereGeo = new THREE.SphereGeometry(0.18, 32, 32)
    const sphereMat = new THREE.MeshStandardMaterial({
      color: orbitColors[i],
      emissive: orbitColors[i],
      emissiveIntensity: 1.5,
      metalness: 0.8,
      roughness: 0.2
    })
    const sphere = new THREE.Mesh(sphereGeo, sphereMat)
    sphere.position.x = Math.cos(angle) * radius
    sphere.position.z = Math.sin(angle) * radius
    sphere.position.y = Math.sin(angle * 2) * 0.5
    orbitGroup.add(sphere)
  }

  // ── Grid Floor ────────────────────────────────────────────
  const gridHelper = new THREE.GridHelper(60, 40, 0x00f0ff, 0x001122)
  gridHelper.position.y = -4
  gridHelper.material.opacity = 0.3
  gridHelper.material.transparent = true
  scene.add(gridHelper)

  // ── Particle Field ────────────────────────────────────────
  const particleCount = 3000
  const positions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 80
    positions[i * 3 + 1] = (Math.random() - 0.5) * 40
    positions[i * 3 + 2] = (Math.random() - 0.5) * 60
  }
  const particleGeo = new THREE.BufferGeometry()
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const particleMat = new THREE.PointsMaterial({
    size: 0.06,
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true
  })
  const particles = new THREE.Points(particleGeo, particleMat)
  scene.add(particles)

  // ── Mouse Parallax ────────────────────────────────────────
  let mouseX = 0, mouseY = 0
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2
  })

  // ── Resize ────────────────────────────────────────────────
  function onResize() {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  window.addEventListener('resize', onResize)

  // ── Animation Loop ────────────────────────────────────────
  let t = 0
  function animate() {
    requestAnimationFrame(animate)
    t += 0.008

    // Rotate main object
    heroGroup.rotation.y = t * 0.4 + mouseX * 0.4
    heroGroup.rotation.x = Math.sin(t * 0.3) * 0.15 + mouseY * 0.2

    // Orbit group spins faster
    orbitGroup.rotation.y = t * 1.2
    orbitGroup.rotation.z = t * 0.3

    // Knot self-rotates
    knotMesh.rotation.x = t * 0.5
    knotMesh.rotation.z = t * 0.3

    // Particles drift
    particles.rotation.y = t * 0.03
    particles.rotation.x = t * 0.01

    // Camera subtle bob
    camera.position.y = 2 + Math.sin(t * 0.5) * 0.3

    renderer.render(scene, camera)
  }
  animate()
}
