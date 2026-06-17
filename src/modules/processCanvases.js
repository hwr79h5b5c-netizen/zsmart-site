/**
 * Process Step Canvases — mini animated 2D icons for each step.
 */
export function initProcessCanvases() {
  const canvases = document.querySelectorAll('.step-canvas')
  canvases.forEach((canvas, index) => {
    const ctx = canvas.getContext('2d')
    canvas.width = 80
    canvas.height = 80

    const colors = ['#00f0ff', '#7b2fff', '#ff3c6e', '#00ff88']
    const color = colors[index % colors.length]

    let t = 0

    function draw() {
      ctx.clearRect(0, 0, 80, 80)
      t += 0.03

      const cx = 40, cy = 40

      // Outer rotating ring
      ctx.strokeStyle = color
      ctx.lineWidth = 1.5
      ctx.globalAlpha = 0.4
      ctx.beginPath()
      ctx.arc(cx, cy, 30, 0, Math.PI * 2)
      ctx.stroke()

      // Rotating arc segment
      ctx.globalAlpha = 0.9
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.arc(cx, cy, 30, t, t + 1.5)
      ctx.stroke()

      // Inner icon
      ctx.globalAlpha = 1
      ctx.fillStyle = color

      if (index === 0) {
        // Scanner icon
        ctx.fillRect(cx - 12, cy - 1, 24, 2)
        ctx.fillRect(cx - 1, cy - 12, 2, 24)
        ctx.strokeStyle = color
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(cx, cy, 8, 0, Math.PI * 2)
        ctx.stroke()
      } else if (index === 1) {
        // Report / document icon
        ctx.fillRect(cx - 8, cy - 10, 16, 2)
        ctx.fillRect(cx - 8, cy - 4, 12, 2)
        ctx.fillRect(cx - 8, cy + 2, 16, 2)
        ctx.fillRect(cx - 8, cy + 8, 8, 2)
      } else if (index === 2) {
        // Wrench-like
        for (let i = 0; i < 4; i++) {
          ctx.save()
          ctx.translate(cx, cy)
          ctx.rotate((i / 4) * Math.PI * 2 + t)
          ctx.fillRect(-1, -12, 2, 8)
          ctx.restore()
        }
      } else {
        // Checkmark / shield
        ctx.lineWidth = 2.5
        ctx.strokeStyle = color
        ctx.beginPath()
        ctx.moveTo(cx - 8, cy)
        ctx.lineTo(cx - 2, cy + 7)
        ctx.lineTo(cx + 9, cy - 7)
        ctx.stroke()
      }

      requestAnimationFrame(draw)
    }
    draw()
  })
}
