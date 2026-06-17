/**
 * Contact Canvas — abstract particle web background
 * with connecting lines — simulates circuitry/neural net.
 */
export function initContactCanvas() {
  const canvas = document.getElementById('contact-canvas')
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  let W, H
  const nodes = []
  const NODE_COUNT = 60
  const CONNECT_DIST = 120

  function resize() {
    W = canvas.width = canvas.parentElement.clientWidth
    H = canvas.height = canvas.parentElement.clientHeight
  }
  resize()
  window.addEventListener('resize', () => { resize(); buildNodes() })

  function buildNodes() {
    nodes.length = 0
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1
      })
    }
  }
  buildNodes()

  function draw() {
    ctx.clearRect(0, 0, W, H)

    // Update positions
    nodes.forEach(n => {
      n.x += n.vx
      n.y += n.vy
      if (n.x < 0 || n.x > W) n.vx *= -1
      if (n.y < 0 || n.y > H) n.vy *= -1
    })

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.3
          ctx.strokeStyle = `rgba(0,240,255,${alpha})`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(nodes[j].x, nodes[j].y)
          ctx.stroke()
        }
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      ctx.beginPath()
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0,240,255,0.5)'
      ctx.fill()
    })
  }

  function animate() {
    requestAnimationFrame(animate)
    draw()
  }
  animate()
}
