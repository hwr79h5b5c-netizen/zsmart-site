/**
 * Nav — scroll-state class, smooth anchor links.
 */
export function initNav() {
  const nav = document.getElementById('nav')

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60)
  })

  // Smooth scroll for anchor links
  document.querySelectorAll('[data-nav]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const target = document.querySelector(link.getAttribute('href'))
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  })

  // Explore button scrolls to services
  const exploreBtn = document.getElementById('explore-btn')
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      document.getElementById('services').scrollIntoView({ behavior: 'smooth' })
    })
  }
}
