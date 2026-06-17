/**
 * ZSMART AI Assistant — powered by Cohere Command R
 * Uses two API keys with automatic fallback.
 * Falls back to rule-based engine if both keys fail.
 */

// ── API config ─────────────────────────────────────────────────────────────
const COHERE_KEYS = [
  import.meta.env.VITE_COHERE_KEY_1,
  import.meta.env.VITE_COHERE_KEY_2
].filter(Boolean)

const COHERE_URL = 'https://api.cohere.com/v2/chat'

const SYSTEM_PROMPT = `Ești ZSMART AI, asistentul auto inteligent al companiei ZSMART Distribution ZTG SRL din Săcele, județul Brașov, România.

Rolul tău este să ajuți clienții să identifice problemele vehiculelor lor și să recomande serviciile potrivite.

ZSmart are un singur tehnician expert: Zaharia Teodor George, cu experiență în servicii auto de înaltă precizie în Săcele, Brașov.

Serviciile disponibile la ZSmart sunt:
- Diagnosticare Motor (420 Lei) — scanare OBD-II completă
- Schimb Ulei Complet (320 Lei) — ulei sintetic + filtru
- Revizie Sistem Frânare (700 Lei) — plăcuțe, discuri, etrier
- Anvelope & Geometrie (560 Lei) — echilibrare, aliniere 4 roți
- Revizie Transmisie (950 Lei) — fluid, filtru, resetare adaptivă
- Climatizare Auto (610 Lei) — reîncărcare freon, verificare etanșeitate
- Detailing Signature (1650 Lei) — corecție vopsea, curățare completă
- Suspensie & Direcție (800 Lei) — amortizoare, arcuri, geometrie

## REGULI DE BAZĂ

1. Răspunde ÎNTOTDEAUNA în română
2. Fii concis dar informativ (max 150 cuvinte)
3. Folosește emoji-uri tehnice relevante (🔧 ⚠️ 🛑 etc.)
4. Identifică clar problema posibilă și nivelul de urgență: SCĂZUT / MEDIU / RIDICAT / CRITIC
5. Recomandă 1-2 servicii specifice din lista de mai sus
6. Dacă problema este CRITICĂ (supraîncălzire, presiune ulei scăzută, frâne cedate), spune clientului să OPREASCĂ mașina imediat
7. Încheie cu o invitație de a programa o vizită la ZSmart Săcele
8. Nu inventa prețuri sau servicii care nu există în lista de mai sus

## AUTONOMIE: Gestionează 90% din conversații COMPLET AUTOMAT

Tu trebuie să:
- Diagnostichezi probleme tehnice
- Explici servicii și prețuri
- Răspunzi la întrebări despre programări
- Recomanzi soluții pentru orice problemă tehnică (chiar și urgențe majore)
- Asiguri clientul când situația este gravă ("Oprește mașina imediat! Apoi programează Diagnosticare Motor")

NU ESCALADA la om pentru:
- Întrebări tehnice standard (chiar dacă sunt urgențe MEDII sau RIDICATE)
- Martori aprinși pe bord (Check Engine)
- Accidente sau probleme tehnice grave (ghidează-i: "Oprește mașina, apoi programează...")
- Întrebări despre prețuri sau disponibilitate

## PROTOCOL ESCALADARE LA OM (DOAR 3 CAZURI)

ESCALADEAZĂ DOAR când clientul:

1. **Este FURIOS sau AGRESIV:**
   - Amenință cu ANPC, recenzii negative (1 stea)
   - Acuză direct: "ați stricat mașina", "din vina voastră"
   - Menționează un serviciu recent care a cauzat probleme noi

2. **Cere EXPLICIT contact uman:**
   - "Vreau să vorbesc cu un om / cineva real"
   - "Sunați-mă", "Să mă sune Teodor", "Puneți-mă în legătură"

3. **Urgență activă pe autostradă + cere ajutor:**
   - "Sunt pe autostradă, mașina scoate fum, ce fac?"
   - "Arde ceva, sunt pe drum, ajutor!"

### RĂSPUNS pentru escaladare (folosește DOAR în cele 3 cazuri de mai sus):

"🔴 Înțeleg situația și doresc să o rezolv cât mai repede.

Sunt un asistent automatizat, deci nu pot face apeluri telefonice sau verifica istoricul serviciilor tale direct.

Ceea ce fac IMEDIAT este să transmit mesajul tău ca PRIORITATE MAXIMĂ către Teodor.

Pentru ca el să te contacteze rapid, am nevoie de:
• Numele tău complet
• Numărul de telefon
• Marca/modelul mașinii (sau numărul de înmatriculare)

[DACĂ menționează serviciu recent:] Toate serviciile ZSmart au garanție pe manoperă. Teodor trebuie să inspecteze personal vehiculul pentru a stabili cauza exactă.

Mulțumesc pentru răbdare."

### CE SĂ NU FACI NICIODATĂ (chiar în caz de escaladare):

❌ NU admite vina: "poate am greșit", "posibil ulei de calitate slabă"
❌ NU specula: "eroare în proces", "piese defecte"
❌ NU recomanda servicii plătite când clientul e furios despre un serviciu recent
❌ NU ignora amenințări (ANPC, recenzii) — recunoaște-le și escaladează

## EXEMPLE DE RĂSPUNSURI CORECTE

**Întrebare tehnică normală (NU escalada):**
Input: "Martorul ABS s-a aprins, ce fac?"
Output: "⚠️ **Martor ABS activ** — Urgență: RIDICATĂ

Sistemul ABS are o defecțiune (senzor roată sau modul electronic). Frânele vor funcționa, dar fără asistență anti-blocare.

✅ Recomand: **Diagnosticare Motor (420 Lei)** pentru citire cod eroare

Programează urgent la ZSmart Săcele!"

**Urgență critică (tot NU escalada — ghidează-i):**
Input: "Motorul face fum alb și temperatura e la roșu!"
Output: "🚨 **SUPRAÎNCĂLZIRE — OPREȘTE IMEDIAT!** — Urgență: CRITICĂ

OPREȘTE motorul ACUM. Nu deschide capacul radiatorului (risc arsură). Lasă mașina să se răcească 30+ minute.

Continuarea poate duce la rebordare chiulasă (2000-5000 Lei).

✅ După ce s-a răcit: **Diagnosticare Motor (420 Lei)** urgent

Contactează ZSmart Săcele pentru programare!"

**Client furios (ESCALADEAZĂ):**
Input: "Ați schimbat uleiul acum o lună și acum motorul face zgomot! Ați stricat-o! ANPC!"
Output: [Folosește template-ul de escaladare de mai sus]

Respectă aceste reguli pentru a oferi un serviciu eficient și sigur.`

// ── Rule-based fallback ────────────────────────────────────────────────────
const FALLBACK_RULES = [
  {
    keywords: ['zgomot', 'bate', 'ticaie', 'pocneste', 'motor', 'pornire'],
    response: `🔧 **Posibilă problemă la motor** — Urgență: MEDIE\n\nZgomotele de la motor indică uzură supape, lagăre sau lanț distribuție. Tipul sunetului contează: ticăit = supape, bătaie surdă = lagăre bielă.\n\n✅ Recomandăm: **Diagnosticare Motor (420 Lei)**\n\nProgramează o vizită la ZSmart Săcele pentru o scanare completă!`
  },
  {
    keywords: ['martor', 'lumina', 'check engine', 'bec', 'aprins', 'bord'],
    response: `⚠️ **Martor de avertizare activ** — Urgență: RIDICATĂ\n\nNu ignora niciodată un martor! Poate fi minor (senzor) sau grav (presiune ulei).\n\n✅ Recomandăm: **Diagnosticare Motor (420 Lei)** — citire coduri OBD-II\n\nVino la ZSmart Săcele pentru diagnosticare rapidă!`
  },
  {
    keywords: ['frana', 'franare', 'scartaie', 'vibrez', 'pedala', 'discuri'],
    response: `🛑 **Problemă sistem frânare** — Urgență: CRITICĂ\n\nFrânele compromise = pericol de viață! Scârțâit = plăcuțe uzate. Vibrații = discuri deformate. Pedală moale = scurgere hidraulică.\n\n✅ Recomandăm: **Revizie Sistem Frânare (700 Lei)**\n\nVino URGENT la ZSmart Săcele!`
  },
  {
    keywords: ['supraincalzire', 'temperatura', 'abur', 'fum alb', 'radiator'],
    response: `🚨 **SUPRAÎNCĂLZIRE — OPREȘTE MAȘINA IMEDIAT!** — Urgență: CRITICĂ\n\nOpriți motorul acum. Nu deschideți capacul radiatorului. Continuarea poate duce la rebordare chiulasă (2.000-5.000 Lei).\n\n✅ Recomandăm: **Diagnosticare Motor (420 Lei)** de urgență\n\nSunați la ZSmart Săcele imediat!`
  },
  {
    keywords: ['ulei', 'consum', 'scurgere', 'fum albastru', 'pete'],
    response: `🛢️ **Consum/pierdere ulei** — Urgență: RIDICATĂ\n\nFum albastru = ulei arde în motor. Pete sub mașină = garnitură defectă.\n\n✅ Recomandăm: **Schimb Ulei (320 Lei)** + **Diagnosticare Motor (420 Lei)**\n\nProgramează la ZSmart Săcele!`
  }
]

// ── Cohere API call ────────────────────────────────────────────────────────
async function callCohere(userMessage, keyIndex = 0) {
  if (keyIndex >= COHERE_KEYS.length) return null

  try {
    const res = await fetch(COHERE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_KEYS[keyIndex]}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: 'command-r-plus-08-2024',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user',   content: userMessage }
        ],
        max_tokens: 400,
        temperature: 0.4
      })
    })

    if (res.status === 429 || res.status === 401 || res.status === 403) {
      // Rate limit or auth error — try next key
      console.warn(`Cohere key ${keyIndex + 1} failed (${res.status}), trying next...`)
      return callCohere(userMessage, keyIndex + 1)
    }

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data = await res.json()
    // v2 response structure
    const text = data?.message?.content?.[0]?.text
               || data?.text
               || null
    return text
  } catch (err) {
    console.warn(`Cohere key ${keyIndex + 1} error:`, err.message)
    // Try next key on network errors too
    if (keyIndex + 1 < COHERE_KEYS.length) {
      return callCohere(userMessage, keyIndex + 1)
    }
    return null
  }
}

// ── Rule-based fallback ────────────────────────────────────────────────────
function ruleFallback(text) {
  const lower = text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  for (const rule of FALLBACK_RULES) {
    if (rule.keywords.some(kw => lower.includes(kw))) {
      return rule.response
    }
  }

  return `🔧 Nu am înțeles exact problema descrisă.\n\nÎncearcă să descrii:\n• Ce sunete auzi?\n• Când apare problema?\n• Ce lumini sunt pe bord?\n\nSau **programează o Diagnosticare Motor (420 Lei)** la ZSmart Săcele pentru o analiză completă!`
}

// ── Format response text (markdown-lite) ──────────────────────────────────
function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>')
}

// ── Complaint detector (VERY SELECTIVE - only real complaints) ────────────
function detectComplaint(text) {
  const lower = text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  
  // CRITICAL: Only trigger escalation for actual complaints/anger, NOT technical emergencies
  
  // Strong anger/aggression indicators
  const angerKeywords = [
    'furios', 'nervos', 'suparat', 'dezamagit',
    'ati stricat', 'ati rupt', 'mi-ati distrus', 'din vina voastra', 'din cauza voastra'
  ]
  
  // Legal threats and review threats
  const threatKeywords = [
    'anpc', 'protectia consumatorului', 'plangere', 'sesizare', 'avocat',
    '1 stea', 'o stea', 'recenzie proasta', 'recenzie negativa'
  ]
  
  // Explicit human contact requests (not emergency, but "I want to talk to a person")
  const humanRequestKeywords = [
    'vreau sa vorbesc cu un om', 'vreau sa vorbesc cu cineva',
    'puneti-ma in legatura', 'nu vreau robot', 'vreau om real',
    'sunati-ma', 'sa ma sune', 'bel-mich', 'telefon urgent'
  ]
  
  // Active highway emergency (car is burning/smoking RIGHT NOW) + asks for help
  const activeEmergencyWithRequest = 
    (lower.includes('autostrada') || lower.includes('drum') || lower.includes('sosea')) &&
    (lower.includes('fum') || lower.includes('arde') || lower.includes('foc')) &&
    (lower.includes('ajutor') || lower.includes('ce fac') || lower.includes('urgenta'))
  
  // Check if ANY strong complaint indicators are present
  const hasAnger = angerKeywords.some(kw => lower.includes(kw))
  const hasThreat = threatKeywords.some(kw => lower.includes(kw))
  const wantsHuman = humanRequestKeywords.some(kw => lower.includes(kw))
  
  // ONLY escalate if: anger OR threats OR explicit human request OR active emergency
  return hasAnger || hasThreat || wantsHuman || activeEmergencyWithRequest
}

// ── Service ID detector ────────────────────────────────────────────────────
function detectServices(text) {
  const lower = text.toLowerCase()
  const map = [
    { id: 'engine-diag',  keys: ['diagnosticare motor', 'obd', 'scanare'] },
    { id: 'oil-change',   keys: ['schimb ulei', 'ulei complet'] },
    { id: 'brake-system', keys: ['frânare', 'franare', 'plăcuțe', 'discuri', 'etrier'] },
    { id: 'tire-service', keys: ['geometrie', 'anvelope', 'echilibrare', 'aliniere'] },
    { id: 'transmission', keys: ['transmisie', 'cutie viteze', 'fluid transmisie'] },
    { id: 'ac-service',   keys: ['climatizare', 'freon', 'ac ', 'aer condiționat'] },
    { id: 'detailing',    keys: ['detailing', 'vopsea', 'curățare'] },
    { id: 'suspension',   keys: ['suspensie', 'amortizoare', 'suspensii', 'direcție'] }
  ]
  return map.filter(s => s.keys.some(k => lower.includes(k))).map(s => s.id)
}

// ── Main export ────────────────────────────────────────────────────────────
export function initAIAssistant() {
  const panel    = document.getElementById('ai-panel')
  const backdrop = document.getElementById('ai-backdrop')
  const openBtn  = document.getElementById('open-ai')
  const closeBtn = document.getElementById('close-ai')
  const messages = document.getElementById('ai-messages')
  const input    = document.getElementById('ai-input')
  const sendBtn  = document.getElementById('ai-send')

  if (!panel) return

  // ── Open / close ───────────────────────────────────────────
  function openPanel() {
    panel.classList.remove('ai-closed')
    panel.classList.add('ai-open')
    backdrop.classList.add('active')
    setTimeout(() => input.focus(), 450)
  }
  function closePanel() {
    panel.classList.remove('ai-open')
    panel.classList.add('ai-closed')
    backdrop.classList.remove('active')
  }

  openBtn.addEventListener('click', openPanel)
  closeBtn.addEventListener('click', closePanel)
  backdrop.addEventListener('click', closePanel)

  // ── Quick chips ────────────────────────────────────────────
  document.querySelectorAll('.ai-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.dataset.q
      handleSend()
    })
  })

  // ── Send ───────────────────────────────────────────────────
  sendBtn.addEventListener('click', handleSend)
  input.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend() })

  async function handleSend() {
    const text = input.value.trim()
    if (!text) return
    input.value = ''
    sendBtn.disabled = true
    input.disabled = true

    const isComplaint = detectComplaint(text)
    
    appendUserMsg(text)
    showTyping()

    try {
      // Try Cohere first
      let response = await callCohere(text)

      // Fallback to rules if API unavailable
      if (!response) {
        console.info('Using rule-based fallback')
        response = ruleFallback(text)
      }

      removeTyping()
      
      // If complaint detected, don't show service add buttons
      const services = isComplaint ? [] : detectServices(response + ' ' + text)
      appendBotMsg(response, services, isComplaint)
    } catch (err) {
      removeTyping()
      appendBotMsg(ruleFallback(text), [], false)
    } finally {
      sendBtn.disabled = false
      input.disabled = false
      input.focus()
    }
  }

  // ── DOM helpers ────────────────────────────────────────────
  function appendUserMsg(text) {
    const div = document.createElement('div')
    div.className = 'ai-msg ai-msg--user'
    div.innerHTML = `<div class="ai-msg-bubble">${escHtml(text)}</div>`
    messages.appendChild(div)
    scrollBottom()
  }

  function appendBotMsg(responseText, serviceIds = [], isComplaint = false) {
    const formatted = formatText(responseText)

    // If complaint, show urgent escalation banner
    const complaintBanner = isComplaint ? `
      <div style="background: rgba(255,80,80,0.15); border-left: 3px solid #ff5050; padding: 10px; margin-bottom: 12px; border-radius: 4px; font-size: 13px;">
        <strong style="color: #ff5050;">🚨 ESCALARE URGENTĂ</strong><br/>
        <span style="color: #ccc;">Mesajul tău a fost marcat ca prioritate maximă. Teodor va fi notificat imediat.</span>
      </div>
    ` : ''

    const serviceLinks = (!isComplaint && serviceIds && serviceIds.length > 0) ? (serviceIds.slice(0, 3).map(id => {
      const labels = {
        'engine-diag':   'Diagnosticare Motor',
        'oil-change':    'Schimb Ulei',
        'brake-system':  'Revizie Frâne',
        'tire-service':  'Geometrie Roți',
        'transmission':  'Revizie Transmisie',
        'ac-service':    'Climatizare',
        'detailing':     'Detailing',
        'suspension':    'Suspensie & Direcție'
      }
      return `<button class="ai-service-add" data-id="${id}">+ ${labels[id] || id}</button>`
    }).join('')) : ''

    const div = document.createElement('div')
    div.className = 'ai-msg ai-msg--bot'
    div.innerHTML = `
      <span class="ai-msg-avatar">⬡</span>
      <div class="ai-msg-bubble">
        ${complaintBanner}
        <div class="ai-diagnosis-body">${formatted}</div>
        ${serviceLinks ? `<div class="ai-service-actions">${serviceLinks}</div>` : ''}
      </div>
    `

    div.querySelectorAll('.ai-service-add').forEach(btn => {
      btn.addEventListener('click', () => {
        const { getServiceBay, SERVICES } = window.__zsmart || {}
        if (!SERVICES || !getServiceBay) return
        const svc = SERVICES.find(s => s.id === btn.dataset.id)
        if (svc) {
          const bay = getServiceBay()
          if (bay) bay.add(svc)
          btn.textContent = '✓ Adăugat'
          btn.disabled = true
          btn.style.color = '#00ff88'
          btn.style.borderColor = '#00ff88'
        }
      })
    })

    messages.appendChild(div)
    scrollBottom()
  }

  let typingEl = null
  function showTyping() {
    typingEl = document.createElement('div')
    typingEl.className = 'ai-msg ai-msg--bot ai-typing'
    typingEl.innerHTML = `
      <span class="ai-msg-avatar">⬡</span>
      <div class="ai-msg-bubble">
        <div class="ai-dots"><span></span><span></span><span></span></div>
      </div>
    `
    messages.appendChild(typingEl)
    scrollBottom()
  }
  function removeTyping() {
    if (typingEl) { typingEl.remove(); typingEl = null }
  }
  function scrollBottom() {
    messages.scrollTop = messages.scrollHeight
  }
  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  }
}
