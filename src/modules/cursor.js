/**
 * Custom cursor — instant dot + fast trailing ring.
 * Trail lerp factor raised to 0.35 for snappy response.
 */
export function initCursor() {
  const cursor = document.getElementById('cursor')
  const trail = document.getElementById('cursor-trail')

  let mx = 0, my = 0
  let tx = 0, ty = 0

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX
    my = e.clientY
    // Dot follows instantly
    cursor.style.left = mx + 'px'
    cursor.style.top = my + 'px'
  })

  // Fast trailing ring — 0.35 lerp = snappy, not laggy
  function animTrail() {
    tx += (mx - tx) * 0.35
    ty += (my - ty) * 0.35
    trail.style.left = tx + 'px'
    trail.style.top = ty + 'px'
    requestAnimationFrame(animTrail)
  }
  animTrail()

  // Scale up on interactive elements
  const interactiveSelector = 'a, button, [data-nav], .service-card, .gallery-item'
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      cursor.style.transform = 'translate(-50%, -50%) scale(2)'
      trail.style.transform = 'translate(-50%, -50%) scale(1.4)'
      trail.style.borderColor = 'rgba(0,240,255,0.8)'
    }
  })
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)'
      trail.style.transform = 'translate(-50%, -50%) scale(1)'
      trail.style.borderColor = 'rgba(0,240,255,0.4)'
    }
  })
}
