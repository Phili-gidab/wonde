/**
 * All site copy lives here.
 *
 * Language treatment: English primary, Amharic as display accent. Every
 * chapter carries an `am` line under the English heading, so the page reads to
 * a diaspora buyer in English while staying rooted for local buyers.
 *
 * Figures come from Wonde's own sales material. Keep them here rather than
 * inline in components - they change often and one file is easier to hand to a
 * non-developer.
 */

export const BRAND = {
  en: 'Temer Real Estate',
  am: 'ቴምር ሪል እስቴት',
  mark: 'TEMER',
}

/**
 * Five chapters, each a composed shot rather than a hard scene change.
 * `camera` drives the rig in src/three/cameraPath.js; positions are in
 * normalised units where the tower is 10 high and stands on y = 0.
 */
export const CHAPTERS = [
  {
    id: 'arrival',
    no: '01',
    label: 'Arrival',
    labelAm: 'መግቢያ',
    heading: 'A home in Addis,\nwithout the wait.',
    am: 'በአዲስ አበባ የቤት ባለቤት ይሁኑ።',
    body:
      'Apartments at Sarbet Adebabay and Megenagna Diaspora Adebabay, from ' +
      'studio to three bedroom. Handed over complete, on schedule.',
    camera: {
      position: [7.5, 2.0, 15.5],
      target: [0, 4.2, 0],
      fov: 42,
    },
  },
  {
    id: 'offer',
    no: '02',
    label: 'The offer',
    labelAm: 'ዋጋው',
    heading: '4.6 million birr,\nall in.',
    am: 'በ4.6 ሚልዮን ብር ጠቅላላ ክፍያ ብቻ የቤት ባለቤት ይሁኑ።',
    body:
      'Pay 40% to secure the unit. The remaining 60% is due only when you take ' +
      'the keys - and there is no price increase on the balance.',
    stats: [
      { value: '40%', label: 'On signing', am: 'ቅድመ ክፍያ' },
      { value: '60%', label: 'On handover', am: 'ቤትዎን ሲረከቡ' },
      { value: '35%', label: 'Max discount', am: 'እስከዚህ ቅናሽ' },
    ],
    camera: {
      position: [10.5, 6.5, 10.0],
      target: [0, 5.6, 0],
      fov: 40,
    },
  },
  {
    id: 'residences',
    no: '03',
    label: 'Residences',
    labelAm: 'መኖሪያ ቤቶች',
    heading: 'Studio to\nthree bedroom.',
    am: 'ከስቱዲኦ እስከ ባለ ሶስት መኝታ።',
    body:
      'Two live sites, both on a major roundabout. Gated compound houses are ' +
      'available at up to 35% off.',
    sites: [
      {
        name: 'Sarbet Adebabay',
        am: 'ሳር ቤት አደባባይ',
        size: '76 - 151 m²',
        note: 'Up to 30% off',
      },
      {
        name: 'Megenagna Diaspora Adebabay',
        am: 'መገናኛ ዲያስፖራ አደባባይ',
        size: '32 - 154 m²',
        note: '130,000 birr / m² · up to 35% off',
      },
    ],
    camera: {
      position: [14.0, 5.0, 16.0],
      target: [0, 4.8, 0],
      fov: 38,
    },
  },
  {
    id: 'track-record',
    no: '04',
    label: 'Track record',
    labelAm: 'የስራ ልምድ',
    heading: 'Eleven projects.\nTen years.',
    am: 'በ10 ዓመት 11 ፕሮጀክት ጥንቅቅ አድርገን አስረክበናል።',
    body:
      'Delivered across Atena Tera, Ayat, Lebu and Lafto - and now a ShebaMiles ' +
      'partner in our tenth anniversary year.',
    delivered: [
      { name: 'AGT Trading', place: 'Atena Tera', detail: '2B+G+5', area: '603 m²' },
      { name: 'MAW', place: 'Ayat', detail: 'B+G+11', area: '822 m²' },
      { name: '2MA', place: 'Lebu', detail: 'B+G+9', area: '1,080 m²' },
      { name: 'Mohammed.S', place: 'Lafto', detail: '2B+G+6', area: '750 m²' },
    ],
    // Swings to the opposite side rather than climbing overhead. A top-down
    // shot at this point just showed the flat roof and its plant equipment.
    camera: {
      position: [-11.5, 7.5, 13.0],
      target: [0, 5.6, 0],
      fov: 40,
    },
  },
  {
    id: 'contact',
    no: '05',
    label: 'Speak to Wonde',
    labelAm: 'ወንደሰንን ያግኙ',
    heading: 'Talk to someone\nwho picks up.',
    am: 'ለበለጠ መረጃ ወንደሰን።',
    body:
      'Wonde handles the whole process end to end - unit selection, payment ' +
      'schedule and paperwork. Buying from abroad? Documents go out by DHL.',
    camera: {
      position: [11.5, 4.0, 13.5],
      target: [0, 4.4, 0],
      fov: 41,
    },
  },
]

/** Running strip under the chapters. */
export const ASSURANCES = [
  { en: 'No price increase on the balance', am: 'በቀሪ ክፍያ ላይ ጭማሪ የለም' },
  { en: 'Gated compound, up to 35% off', am: 'ግቢ ቤት በቅናሽ' },
  { en: 'DHL documents for diaspora', am: 'ለዲያስፖራ በDHL እንልካለን' },
  { en: 'ShebaMiles partner', am: 'የShebaMiles አጋር' },
]

/**
 * Commercial inventory. Two live projects with per-unit pricing, so a buyer
 * can find their budget without calling first.
 */
export const COMMERCIAL = {
  eyebrow: 'Commercial',
  eyebrowAm: 'የንግድ ሱቆች',
  heading: 'Own a shop.',
  am: 'ዘመናዊ የንግድ ሱቆች',
  body:
    'Two retail developments now selling. 10% off for buyers paying 100% up ' +
    'front on either.',

  projects: [
    {
      id: 'piyassa',
      name: 'Piyassa - Adwa Museum',
      am: 'መሃል ፒያሳ · አድዋ ሙዝየም ፊት ለፊት',
      summary: '2 basements + G+5 retail centre, opposite the Adwa Museum and beside the main car park.',
      facts: [
        { k: 'Total price', v: '7,000,000 birr' },
        { k: 'Down payment', v: '2,800,000 birr' },
        { k: 'Balance', v: '10 instalments, interest free' },
        { k: 'Handover', v: '1 year 6 months' },
      ],
      features: [
        '6 escalators, 4 lifts',
        'Shared terrace',
        'Ground floor units',
        'No dollar-linked increases',
      ],
    },
    {
      id: 'kaliti',
      name: 'Kaliti - Gelan',
      am: 'ቃሊቲ (ገላን)',
      summary:
        'A wide modern mall in central Kaliti. Six sites already built and handed over.',
      // floor, size, total price, down payment
      units: [
        { floor: 'Ground', size: '24 m²', price: '6,900,000', down: '3,000,000' },
        { floor: 'Ground', size: '26 m²', price: '4,500,000', down: '2,000,000' },
        { floor: 'Ground', size: '16 m²', price: '4,300,000', down: '1,800,000' },
        { floor: '1st', size: '26.4 m²', price: '3,200,000', down: '1,200,000' },
        { floor: '2nd', size: '26.8 m²', price: '2,800,000', down: '800,000' },
        { floor: '3rd', size: '26.8 m²', price: '2,600,000', down: '600,000' },
        { floor: '4th', size: '23.5 m²', price: '2,500,000', down: '500,000' },
      ],
    },
  ],
}

/**
 * CC-BY attribution for the 3D model. Required by the licence - the model is
 * free for commercial use only if the author is credited. Do not remove.
 */
export const MODEL_CREDIT = {
  title: 'modern residential complex apartment building',
  author: 'zigurat architecture studio',
  authorUrl: 'https://sketchfab.com/zigurat_architecture',
  licence: 'CC BY 4.0',
  licenceUrl: 'https://creativecommons.org/licenses/by/4.0/',
}
