/**
 * Grid Canvas — neon blueprint infinite scrolling grid
 * used in the tagline section background.
 */
export function initGridCanvas() {
  const canvas = document.getElementById('grid-canvas')
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  let W, H, offset = 0

  function resize() {
    W = canvas.width = canvas.parentElement.clientWidth
    H = canvas.height = canvas.parentElement.clientHeight
  }
  resize()
  window.addEventListener('resize', resize)

  function drawGrid() {
    ctx.clearRect(0, 0, W, H)

    const cellSize = 60
    const offX = offset % cellSize
    const offY = offset % cellSize

    ctx.strokeStyle = 'rgba(0,240,255,0.12)'
    ctx.lineWidth = 0.5

    // Vertical lines
    for (let x = -offX; x < W + cellSize; x += cellSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, H)
      ctx.stroke()
    }

    // Horizontal lines
    for (let y = -offY; y < H + cellSize; y += cellSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(W, y)
      ctx.stroke()
    }

    // Accent dots at intersections
    ctx.fillStyle = 'rgba(0,240,255,0.2)'
    for (let x = -offX; x < W + cellSize; x += cellSize) {
      for (let y = -offY; y < H + cellSize; y += cellSize) {
        ctx.beginPath()
        ctx.arc(x, y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Center vanishing point glow
    const gradient = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.5)
    gradient.addColorStop(0, 'rgba(0,240,255,0.06)')
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, W, H)
  }

  function animate() {
    requestAnimationFrame(animate)
    offset += 0.3
    drawGrid()
  }
  animate()
}
