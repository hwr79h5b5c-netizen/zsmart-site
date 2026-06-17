/**
 * Catalog servicii ZSmart Distribution ZTG SRL
 * Fiecare intrare corespunde unui modul 3D flotant și unui card UI.
 */
export const SERVICES = [
  {
    id: 'engine-diag',
    title: 'Diagnosticare Motor',
    desc: 'Scanare completă OBD-II cu peste 4.200 de parametri, predicție AI a defecțiunilor și telemetrie în timp real.',
    price: 420,
    currency: 'Lei',
    icon: '⬡',
    color: 0x00f0ff,
    shape: 'engine',
    tag: 'CEL MAI POPULAR'
  },
  {
    id: 'oil-change',
    title: 'Schimb Ulei Complet',
    desc: 'Schimb ulei sintetic integral cu înlocuire filtru, inspecție multi-punct și completare fluide.',
    price: 320,
    currency: 'Lei',
    icon: '◈',
    color: 0xffaa00,
    shape: 'oilDrum',
    tag: null
  },
  {
    id: 'brake-system',
    title: 'Revizie Sistem Frânare',
    desc: 'Inspecție completă frâne, măsurare plăcuțe/discuri, revizie etrier și analiză lichid hidraulic.',
    price: 700,
    currency: 'Lei',
    icon: '◉',
    color: 0xff3c6e,
    shape: 'brakeDisc',
    tag: null
  },
  {
    id: 'tire-service',
    title: 'Anvelope &amp; Geometrie',
    desc: 'Geometrie computerizată pe 4 roți, echilibrare, rotație și calibrare TPMS conform specificațiilor producătorului.',
    price: 560,
    currency: 'Lei',
    icon: '⊕',
    color: 0x7b2fff,
    shape: 'wheel',
    tag: null
  },
  {
    id: 'transmission',
    title: 'Revizie Transmisie',
    desc: 'Schimb fluid, revizie filtru, inspecție solenoizi și resetare adaptivă pentru schimbare optimă a vitezelor.',
    price: 950,
    currency: 'Lei',
    icon: '⊞',
    color: 0x00ff88,
    shape: 'gearbox',
    tag: 'PREMIUM'
  },
  {
    id: 'ac-service',
    title: 'Climatizare Auto',
    desc: 'Reîncărcare completă A/C, detectare scurgeri, evaluare compresor și înlocuire filtru habitaclu.',
    price: 610,
    currency: 'Lei',
    icon: '❄',
    color: 0x44ddff,
    shape: 'acUnit',
    tag: null
  },
  {
    id: 'detailing',
    title: 'Detailing Signature',
    desc: 'Corecție vopsea multi-etapă, pregătire acoperire ceramică, curățare abur interior și condiționare piele.',
    price: 1650,
    currency: 'Lei',
    icon: '✦',
    color: 0xffd700,
    shape: 'detailing',
    tag: 'LUX'
  },
  {
    id: 'suspension',
    title: 'Suspensie &amp; Direcție',
    desc: 'Evaluare amortizoare/arcuri, inspecție pivot și rotulă, verificare bara de direcție și geometrie completă.',
    price: 800,
    currency: 'Lei',
    icon: '⟁',
    color: 0xff6b35,
    shape: 'suspension',
    tag: null
  }
]
