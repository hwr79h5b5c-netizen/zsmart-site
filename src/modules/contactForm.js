/**
 * Contact Form — sends emails via Web3Forms (free, no backend)
 * Get your access key: https://web3forms.com
 */

export function initContactForm() {
  const form = document.getElementById('contact-form')
  if (!form) return

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const submitBtn = form.querySelector('button[type="submit"]')
    const originalText = submitBtn.innerHTML

    // Disable button + show loading
    submitBtn.disabled = true
    submitBtn.innerHTML = '<span>Se trimite...</span>'

    // Get form data
    const formData = new FormData(form)

    // Add Web3Forms access key (you'll need to get one from web3forms.com)
    // For now, we'll use a demo key — replace with real one after deployment
    formData.append('access_key', import.meta.env.VITE_WEB3FORMS_KEY || 'YOUR_ACCESS_KEY_HERE')
    
    // Add subject line
    formData.append('subject', '🚗 Nou mesaj ZSmart — ' + formData.get('name'))
    
    // Add redirect (optional - where to send user after submit)
    formData.append('redirect', window.location.href + '#success')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        // Success
        submitBtn.innerHTML = '<span>✓ Trimis cu succes!</span>'
        submitBtn.style.background = '#00ff88'
        form.reset()

        // Show success message
        showMessage('Mulțumim! Mesajul tău a fost trimis. Te vom contacta în curând.', 'success')

        setTimeout(() => {
          submitBtn.disabled = false
          submitBtn.innerHTML = originalText
          submitBtn.style.background = ''
        }, 3000)
      } else {
        throw new Error(data.message || 'Eroare la trimitere')
      }
    } catch (error) {
      console.error('Contact form error:', error)
      submitBtn.innerHTML = '<span>✕ Eroare</span>'
      submitBtn.style.background = '#ff3c6e'
      showMessage('Eroare la trimiterea mesajului. Te rugăm încearcă din nou.', 'error')

      setTimeout(() => {
        submitBtn.disabled = false
        submitBtn.innerHTML = originalText
        submitBtn.style.background = ''
      }, 3000)
    }
  })
}

function showMessage(text, type) {
  const existing = document.getElementById('form-message')
  if (existing) existing.remove()

  const msg = document.createElement('div')
  msg.id = 'form-message'
  msg.className = `form-message form-message--${type}`
  msg.textContent = text
  msg.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: ${type === 'success' ? 'rgba(0,255,136,0.95)' : 'rgba(255,60,110,0.95)'};
    color: var(--bg);
    padding: 1rem 1.5rem;
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: 0.85rem;
    font-weight: 700;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    z-index: 9999;
    animation: slideInUp 0.4s ease;
    max-width: 320px;
  `
  document.body.appendChild(msg)

  setTimeout(() => {
    msg.style.animation = 'slideOutDown 0.4s ease'
    setTimeout(() => msg.remove(), 400)
  }, 4000)
}
