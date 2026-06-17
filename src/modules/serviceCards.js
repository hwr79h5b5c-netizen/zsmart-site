/**
 * Service Cards — populates the grid below the 3D canvas.
 * Clicking a card adds/removes from the service bay.
 */
import { getServiceBay } from './serviceBay.js'

export function initServiceCards(services) {
  const grid = document.getElementById('service-cards')
  if (!grid) return

  services.forEach((svc) => {
    const card = document.createElement('div')
    card.className = 'service-card'
    card.dataset.id = svc.id

    const tagHtml = svc.tag
      ? `<div class="card-tag" style="position:absolute;top:0.8rem;left:1rem;font-family:var(--font-mono);font-size:0.55rem;color:var(--accent);letter-spacing:0.2em;">${svc.tag}</div>`
      : ''

    card.innerHTML = `
      ${tagHtml}
      <div class="card-add" aria-label="Adaugă în coș">+</div>
      <div class="card-icon">${svc.icon}</div>
      <h3 class="card-title">${svc.title}</h3>
      <p class="card-desc">${svc.desc}</p>
      <span class="card-price">${svc.price} ${svc.currency || 'Lei'}</span>
    `

    card.addEventListener('click', () => {
      const bay = getServiceBay()
      if (!bay) return
      if (bay.has(svc.id)) {
        bay.remove(svc.id)
        card.classList.remove('selected')
        card.querySelector('.card-add').textContent = '+'
      } else {
        bay.add(svc)
        card.classList.add('selected')
        card.querySelector('.card-add').textContent = '✓'
      }
    })

    grid.appendChild(card)
  })
}
