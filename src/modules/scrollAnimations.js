/**
 * Scroll Animations — uses GSAP + ScrollTrigger for:
 * - data-reveal elements fade in on scroll
 * - Section parallax effects
 * - Stagger reveals for grid items
 * - Hero title split animation on load
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initScrollAnimations() {
  // ── Hero entrance ─────────────────────────────────────────
  const heroEyebrow = document.querySelector('.hero-eyebrow')
  const heroLines = document.querySelectorAll('.hero-title .title-line')
  const heroSub = document.querySelector('.hero-sub')
  const heroActions = document.querySelector('.hero-actions')
  const heroStats = document.querySelectorAll('.hero-stats .stat')

  gsap.set([heroEyebrow, heroLines, heroSub, heroActions, heroStats], {
    opacity: 0, y: 40
  })

  const tl = gsap.timeline({ delay: 0.2 })
  tl.to(heroEyebrow, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
    .to(heroLines, { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'power4.out' }, '-=0.3')
    .to(heroSub, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
    .to(heroActions, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
    .to(heroStats, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.5')

  // ── Generic data-reveal elements ──────────────────────────
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    // Skip hero elements already animated above
    if (el.closest('#hero')) return

    gsap.fromTo(el,
      { opacity: 0, y: 35 },
      {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    )
  })

  // ── Service cards stagger ─────────────────────────────────
  gsap.fromTo('.service-card',
    { opacity: 0, y: 30, scale: 0.95 },
    {
      opacity: 1, y: 0, scale: 1,
      duration: 0.6, stagger: 0.08, ease: 'power2.out',
      scrollTrigger: {
        trigger: '#service-cards',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    }
  )

  // ── Process steps stagger ─────────────────────────────────
  gsap.fromTo('.process-step',
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0,
      duration: 0.7, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: {
        trigger: '.process-steps',
        start: 'top 80%'
      }
    }
  )

  // ── Process connector line draw ───────────────────────────
  gsap.fromTo('.process-line',
    { scaleX: 0, transformOrigin: 'left' },
    {
      scaleX: 1, duration: 1.5, ease: 'power2.inOut',
      scrollTrigger: {
        trigger: '.process-steps',
        start: 'top 75%'
      }
    }
  )

  // ── Diagnostic HUD bars (handled in diagCanvas.js via IntersectionObserver) ──

  // ── Gallery parallax ──────────────────────────────────────
  document.querySelectorAll('.gallery-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, scale: 0.92 },
      {
        opacity: 1, scale: 1, duration: 0.7,
        delay: i * 0.07,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 90%'
        }
      }
    )
  })

  // ── Contact section entrance ──────────────────────────────
  gsap.fromTo('.contact-content',
    { opacity: 0, y: 50 },
    {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 75%'
      }
    }
  )

  // ── About section ─────────────────────────────────────────
  gsap.fromTo('.about-card',
    { opacity: 0, x: 60 },
    {
      opacity: 1, x: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: {
        trigger: '#about',
        start: 'top 70%'
      }
    }
  )

  gsap.fromTo('.about-details',
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-details',
        start: 'top 85%'
      }
    }
  )

  gsap.fromTo('.verify-btn',
    { opacity: 0, y: 15 },
    {
      opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out',
      scrollTrigger: {
        trigger: '.about-verify',
        start: 'top 90%'
      }
    }
  )

  // ── Tagline section ───────────────────────────────────────
  gsap.fromTo('.tagline-text',
    { opacity: 0, scale: 0.95 },
    {
      opacity: 1, scale: 1, duration: 1, ease: 'power3.out',
      scrollTrigger: {
        trigger: '#tagline-section',
        start: 'top 80%'
      }
    }
  )

  // ── Navbar link active section highlighting ───────────────
  document.querySelectorAll('section[id]').forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => highlightNav(section.id),
      onEnterBack: () => highlightNav(section.id)
    })
  })

  function highlightNav(id) {
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.style.color = link.getAttribute('href') === `#${id}`
        ? 'var(--accent)'
        : 'var(--text-dim)'
    })
  }
}
