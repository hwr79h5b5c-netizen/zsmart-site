/**
 * Loader — fills the progress bar then fades out.
 * Returns a Promise that resolves when done.
 */
export function initLoader() {
  return new Promise((resolve) => {
    const loader = document.getElementById('loader')
    const fill = loader.querySelector('.loader-fill')
    const text = loader.querySelector('.loader-text')

    const messages = [
      'INIȚIALIZARE DIAGNOSTICARE',
      'ÎNCĂRCARE MODULE 3D',
      'CALIBRARE SHADERE',
      'SISTEM PREGĂTIT'
    ]
    let msgIdx = 0

    // Animate bar to 100% over ~2.5s
    requestAnimationFrame(() => {
      fill.style.width = '100%'
    })

    const msgInterval = setInterval(() => {
      msgIdx = Math.min(msgIdx + 1, messages.length - 1)
      text.textContent = messages[msgIdx]
    }, 600)

    setTimeout(() => {
      clearInterval(msgInterval)
      loader.classList.add('hidden')
      setTimeout(resolve, 800)
    }, 2600)
  })
}
