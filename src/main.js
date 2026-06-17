/**
 * ZSMART — Main Entry Point
 * Orchestrates all modules: loader, cursor, nav, hero canvas,
 * services 3D, diagnostic canvas, service bay, scroll reveals,
 * GSAP animations, counter animations.
 */

import { initLoader } from './modules/loader.js'
import { initCursor } from './modules/cursor.js'
import { initNav } from './modules/nav.js'
import { initHeroCanvas } from './modules/heroCanvas.js'
import { initServicesCanvas } from './modules/servicesCanvas.js'
import { initServiceCards } from './modules/serviceCards.js'
import { initDiagCanvas } from './modules/diagCanvas.js'
import { initGridCanvas } from './modules/gridCanvas.js'
import { initContactCanvas } from './modules/contactCanvas.js'
import { initAboutCanvas } from './modules/aboutCanvas.js'
import { initServiceBay, getServiceBay } from './modules/serviceBay.js'
import { initScrollAnimations } from './modules/scrollAnimations.js'
import { initCounters } from './modules/counters.js'
import { initProcessCanvases } from './modules/processCanvases.js'
import { initAIAssistant } from './modules/aiAssistant.js'
import { SERVICES } from './data/services.js'

async function bootstrap() {
  // 1. Loader
  await initLoader()

  // 2. Core UI
  initCursor()
  initNav()

  // 3. Canvases
  initHeroCanvas()
  initGridCanvas()
  initDiagCanvas()
  initContactCanvas()
  initAboutCanvas()
  initProcessCanvases()

  // 4. Services (3D + cards)
  initServicesCanvas(SERVICES)
  initServiceCards(SERVICES)

  // 5. Service Bay (must be before AI so getServiceBay is available)
  initServiceBay()

  // 6. Expose globals for AI assistant cross-module access
  window.__zsmart = { getServiceBay, SERVICES }

  // 7. AI Assistant
  initAIAssistant()

  // 8. Reel modal
  initReelModal()

  // 9. Scroll + counters
  initScrollAnimations()
  initCounters()
}

function initReelModal() {
  const modal    = document.getElementById('reel-modal')
  const reelBtn  = document.getElementById('reel-btn')
  const closeBtn = document.getElementById('close-reel')
  const backdrop = document.getElementById('reel-backdrop')
  const toContact = document.getElementById('reel-to-contact')
  if (!modal || !reelBtn) return

  reelBtn.addEventListener('click', () => {
    modal.classList.remove('modal-closed')
    modal.classList.add('modal-open')
  })
  function closeModal() {
    modal.classList.add('modal-closed')
    modal.classList.remove('modal-open')
  }
  closeBtn.addEventListener('click', closeModal)
  backdrop.addEventListener('click', closeModal)
  if (toContact) {
    toContact.addEventListener('click', () => {
      closeModal()
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })
    })
  }
}

bootstrap()
