/**
 * About Canvas — abstract rotating particle cloud behind the company card.
 * Uses canvas 2D for lightweight performance.
 */
export function initAboutCanvas() {
  const canvas = document.getElementById('about-canvas')
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  let W, H

  function resize() {
    const parent = canvas.parentElement
    W = canvas.width = parent.clientWidth
    H = canvas.height = parent.clientHeight
  }
  resize()
  window.addEventListener('resize', resize)

  // Build rotating rings of particles
  const rings = [
    { count: 40, radius: 180, speed: 0.003, color: 'rgba(0,240,255,', size: 1.5 },
    { count: 25, radius: 130, speed: -0.005, color: 'rgba(123,47,255,', size: 2 },
    { count: 15, radius: 80,  speed: 0.008, color: 'rgba(0,255,136,',  size: 1.5 }
  ]

  const particles = []
  rings.forEach(ring => {
    for (let i = 0; i < ring.count; i++) {
      const angle = (i / ring.count) * Math.PI * 2
      particles.push({
        baseAngle: angle,
        radius: ring.radius + (Math.random() - 0.5) * 40,
        speed: ring.speed * (0.7 + Math.random() * 0.6),
        color: ring.color,
        size: ring.size * (0.6 + Math.random() * 0.8),
        angle
      })
    }
  })

  let t = 0
  function draw() {
    ctx.clearRect(0, 0, W, H)

    const cx = W / 2
    const cy = H / 2

    // Connection lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      const px = cx + Math.cos(p.angle) * p.radius
      const py = cy + Math.sin(p.angle) * p.radius

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j]
        const qx = cx + Math.cos(q.angle) * q.radius
        const qy = cy + Math.sin(q.angle) * q.radius
        const dist = Math.hypot(px - qx, py - qy)
        if (dist < 60) {
          ctx.strokeStyle = `rgba(0,240,255,${(1 - dist / 60) * 0.08})`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(px, py)
          ctx.lineTo(qx, qy)
          ctx.stroke()
        }
      }

      // Draw particle
      const alpha = 0.3 + Math.sin(t * 2 + p.baseAngle) * 0.2
      ctx.fillStyle = p.color + alpha + ')'
      ctx.beginPath()
      ctx.arc(px, py, p.size, 0, Math.PI * 2)
      ctx.fill()
    }

    requestAnimationFrame(draw)
  }

  function animate() {
    t += 0.01
    particles.forEach(p => { p.angle += p.speed })
    draw()
  }

  // Override draw with animate
  function loop() {
    requestAnimationFrame(loop)
    t += 0.01
    particles.forEach(p => { p.angle += p.speed })

    ctx.clearRect(0, 0, W, H)
    const cx = W / 2, cy = H / 2

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      const px = cx + Math.cos(p.angle) * p.radius
      const py = cy + Math.sin(p.angle) * p.radius

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j]
        const qx = cx + Math.cos(q.angle) * q.radius
        const qy = cy + Math.sin(q.angle) * q.radius
        const dist = Math.hypot(px - qx, py - qy)
        if (dist < 60) {
          ctx.strokeStyle = `rgba(0,240,255,${(1 - dist / 60) * 0.1})`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(px, py)
          ctx.lineTo(qx, qy)
          ctx.stroke()
        }
      }

      const alpha = 0.25 + Math.sin(t * 2 + p.baseAngle) * 0.15
      ctx.fillStyle = p.color + alpha + ')'
      ctx.beginPath()
      ctx.arc(px, py, p.size, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  loop()
}
