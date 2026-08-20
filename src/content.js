/**
 * All site copy lives here.
 *
 * Every translatable value is an `{ en, am }` pair, resolved through `t()` in
 * src/i18n.jsx. Whichever language is active, the *other* one is rendered
 * underneath the heading as a green display accent - so the page reads as a
 * bilingual object rather than as a translation of itself.
 *
 * Figures come from Wonde's own sales material. Keep them here rather than
 * inline in components - they change often and one file is easier to hand to a
 * non-developer.
 */

export const BRAND = {
  name: { en: 'Temer Real Estate', am: 'ቴምር ሪል እስቴት' },
  mark: 'TEMER',
}

export const UI = {
  callWonde: { en: 'Call Wonde', am: 'ወንደሰንን ይደውሉ' },
  callNow: { en: 'Call now', am: 'አሁኑኑ ይደውሉ' },
  scroll: { en: 'Scroll', am: 'ወደ ታች' },
  salesConsultant: { en: 'Sales consultant', am: 'የሽያጭ አማካሪ' },
  chapters: { en: 'Chapters', am: 'ክፍሎች' },
  askAboutUnit: { en: 'Ask Wonde about a unit', am: 'ስለ ሱቅ ወንደሰንን ይጠይቁ' },
  allFiguresBirr: { en: 'All figures in birr.', am: 'ሁሉም ዋጋዎች በብር ናቸው።' },
  rightsReserved: {
    en: 'All rights reserved.',
    am: 'ሁሉም መብቶች የተጠበቁ ናቸው።',
  },
  handedOver: { en: "Handed over", am: "ተረክቧል" },
  offerNow: { en: "Offer", am: "ቅናሽ" },
  readPost: { en: "Read the post", am: "መልዕክቱን ያንብቡ" },
  close: { en: "Close", am: "ዝጋ" },
  prev: { en: 'Previous', am: 'ወደ ኋላ' },
  next: { en: 'Next', am: 'ወደ ፊት' },
  viewHomes: { en: "See homes", am: "ቤቶችን ይመልከቱ" },
  viewShops: { en: "See shops", am: "ሱቆችን ይመልከቱ" },
  unitTable: {
    floor: { en: 'Floor', am: 'ፎቅ' },
    size: { en: 'Size', am: 'ስፋት' },
    price: { en: 'Total price', am: 'ጠቅላላ ዋጋ' },
    down: { en: 'Down payment', am: 'ቅድመ ክፍያ' },
  },
  modelCredit: {
    prefix: { en: '3D model', am: 'የ3D ሞዴል' },
    by: { en: 'by', am: 'በ' },
    licensed: { en: 'licensed under', am: 'በፍቃድ' },
  },
}

/**
 * Five chapters, each a composed shot rather than a hard scene change.
 *
 * `camera` drives the rig in src/three/cameraPath.js; positions are in
 * normalised units where the tower is 10 high and stands on y = 0.
 * `cameraMobile` is a separate portrait framing - three.js `fov` is vertical,
 * so desktop keyframes overflow a phone badly. Verify any change with
 * `node scripts/framing.mjs`.
 */
export const CHAPTERS = [
  {
    id: 'arrival',
    no: '01',
    label: { en: 'Arrival', am: 'መግቢያ' },
    heading: {
      en: 'A home in Addis,\nwithout the wait.',
      am: 'በአዲስ አበባ\nየቤት ባለቤት ይሁኑ።',
    },
    body: {
      en:
        'Apartments at Sarbet Adebabay and Megenagna Diaspora Adebabay, from ' +
        'studio to three bedroom. Handed over complete, on schedule.',
      am:
        'በሳር ቤት አደባባይ እና በመገናኛ ዲያስፖራ አደባባይ፤ ከስቱዲኦ እስከ ባለ ሶስት መኝታ። ' +
        'ጥንቅቅ ተደርገው በጊዜው ይረከባሉ።',
    },
    camera: {
      position: [7.5, 2.0, 15.5],
      target: [0, 4.2, 0],
      fov: 42,
    },
    cameraMobile: {
      position: [8.03, 4.5, 17.39],
      target: [0, 5.5, 0],
      fov: 52,
    },
  },
  {
    id: 'offer',
    no: '02',
    label: { en: 'The offer', am: 'ዋጋው' },
    heading: {
      en: '4.6 million birr,\nall in.',
      am: 'በ4.6 ሚልዮን ብር\nጠቅላላ ክፍያ ብቻ።',
    },
    body: {
      en:
        'Pay 40% to secure the unit. The remaining 60% is due only when you take ' +
        'the keys - and there is no price increase on the balance.',
      am:
        'የቤቱን 40% ብቻ ከፍለው ቤትዎን ያስይዙ። ቀሪውን 60% ቤትዎን ሲረከቡ ይክፈሉ - ' +
        'በቀሪው ክፍያ ላይ ምንም አይነት የዋጋ ጭማሪ አይደረግም።',
    },
    stats: [
      { value: '40%', label: { en: 'On signing', am: 'ቅድመ ክፍያ' } },
      { value: '60%', label: { en: 'On handover', am: 'ቤትዎን ሲረከቡ' } },
      { value: '35%', label: { en: 'Max discount', am: 'እስከዚህ ቅናሽ' } },
    ],
    camera: {
      position: [10.5, 6.5, 10.0],
      target: [0, 5.6, 0],
      fov: 40,
    },
    cameraMobile: {
      position: [11.2, 7.09, 15.38],
      target: [0, 5, 0],
      fov: 52,
    },
  },
  {
    id: 'feed',
    no: '03',
    label: { en: 'Listings', am: 'ማስታወቂያዎች' },
    heading: {
      en: 'What’s selling\nright now.',
      am: 'አሁን በሽያጭ\nላይ ያለው።',
    },
    body: {
      en: 'The offers running right now at Sarbet and Megenagna.',
      am: 'አሁን በሳር ቤት እና በመገናኛ ያሉ ቅናሾች።',
    },
    feed: true,
    camera: {
      position: [14.0, 5.0, 16.0],
      target: [0, 4.8, 0],
      fov: 38,
    },
    cameraMobile: {
      position: [10.03, 5.08, 17.39],
      target: [0, 5.2, 0],
      fov: 50,
    },
  },
  {
    id: 'contact',
    no: '04',
    label: { en: 'Speak to Wonde', am: 'ወንደሰንን ያግኙ' },
    heading: {
      en: 'Talk to someone\nwho picks up.',
      am: 'ስልክ ለሚያነሳ\nሰው ይደውሉ።',
    },
    body: {
      en: 'One number, one person, from the first call to the handover.',
      am: 'ከመጀመሪያው ጥሪ እስከ ርክክብ ድረስ - አንድ ስልክ፣ አንድ ሰው።',
    },
    camera: {
      position: [11.5, 4.0, 13.5],
      target: [0, 4.4, 0],
      fov: 41,
    },
    cameraMobile: {
      position: [9.36, 4.85, 16.72],
      target: [0, 5.6, 0],
      fov: 52,
    },
  },
]

/**
 * Why choose Temer - six advantages, as a card grid.
 *
 * This replaces the four-item assurances strip that used to run here. That
 * strip said "no price increase on the balance", "gated compound, up to 35%
 * off", "DHL documents for diaspora" and "ShebaMiles partner" - four claims
 * about why you would buy from Temer, which is exactly what this section is.
 * Running both put the same four facts on screen twice, a screen apart. Every
 * one of them is carried below: the balance in `investment`, the compound in
 * `security`, DHL and ShebaMiles in `customer`, the discount in `price`.
 *
 * The six headings are the client's, and fixed. The bodies are written from
 * figures that already appear elsewhere on this page rather than from the
 * generic copy they arrived with, so a buyer who reads both does not find two
 * different sets of numbers.
 *
 * `icon` keys an inline SVG in src/components/Why.jsx. Adding an item means
 * adding an icon there; an unknown key renders no glyph rather than throwing.
 */
export const WHY = {
  eyebrow: { en: 'Our advantages', am: 'ጥቅሞቻችን' },
  heading: { en: 'Why choose Temer.', am: 'ለምን ቴምርን ይምረጡ።' },
  body: {
    en:
      'Eleven projects completed and handed over in ten years, and two sites ' +
      'selling now. This is what you are buying into.',
    am:
      'ቴምር በ10 ዓመት ውስጥ 11 ፕሮጀክቶች አጠናቆ አስረክቧል። ' +
      'ሁለት ሳይቶች አሁን በሽያጭ ላይ ናቸው።',
  },
  items: [
    {
      id: 'location',
      icon: 'pin',
      title: { en: 'Prime location', am: 'ምርጥ አካባቢ' },
      body: {
        en:
          'Sarbet Adebabay and Megenagna Diaspora Adebabay - two live sites on ' +
          'major roundabouts, with retail at Piyassa and Kaliti.',
        am:
          'ሳር ቤት አደባባይ እና መገናኛ ዲያስፖራ አደባባይ - በሁለት ዋና አደባባዮች ላይ። ' +
          'ሱቆችም በፒያሳ እና በቃሊቲ።',
      },
    },
    {
      id: 'price',
      icon: 'price',
      title: { en: 'Affordable price', am: 'ተመጣጣኝ ዋጋ' },
      body: {
        en:
          '4.6 million birr all in, at 130,000 birr per square metre, with ' +
          'discounts of up to 35%.',
        am: 'በጠቅላላ 4.6 ሚልዮን ብር፤ 130,000 ብር በካሬ፤ እስከ 35% ቅናሽ።',
      },
    },
    {
      id: 'quality',
      icon: 'quality',
      title: { en: 'Premium quality', am: 'ከፍተኛ ጥራት' },
      body: {
        en:
          'Handed over complete and on schedule. Eleven buildings finished in ' +
          'ten years, not one of them left as a shell.',
        am:
          'ጥንቅቅ ተደርገው በጊዜው ይረከባሉ። ' +
          'ቴምር በ10 ዓመት ውስጥ 11 ህንፃዎችን አጠናቋል።',
      },
    },
    {
      id: 'customer',
      icon: 'customer',
      title: { en: 'Customer first', am: 'ደንበኛ ቅድሚያ' },
      body: {
        en:
          'Wonde takes it end to end - unit selection, payment schedule and ' +
          'paperwork. Buying from abroad? Documents go out by DHL, and Temer ' +
          'is a ShebaMiles partner.',
        am:
          'ወንደሰን ከመጀመሪያ እስከ መጨረሻ ያስተናግድዎታል - ቤት መምረጥ፣ የክፍያ ሰሌዳ እና ሰነዶች። ' +
          'ከሀገር ውጭ ነዎት? ሰነዶቹን ባሉበት በDHL እንልካለን፤ ቴምር የShebaMiles አጋር ነው።',
      },
    },
    {
      id: 'investment',
      icon: 'investment',
      title: { en: 'Smart investment', am: 'ብልህ ኢንቨስትመንት' },
      body: {
        en:
          'Pay 40% now and 60% on handover, with no price increase on the ' +
          'balance. Whatever the price does in between is yours.',
        am:
          '40% ቅድመ ክፍያ እና 60% ሲረከቡ፤ ' +
          'በቀሪ ክፍያ ላይ የዋጋ ጭማሪ የለም።',
      },
    },
    {
      id: 'security',
      icon: 'security',
      title: { en: 'Safety and security', am: 'ጥበቃና ደህንነት' },
      body: {
        en:
          'Gated compounds with controlled access and round-the-clock ' +
          'security on every site.',
        am:
          'ጥበቃ ያለው ግቢ ቤት፤ ቁጥጥር የሚደረግበት መግቢያ እና የ24 ሰዓት ደህንነት።',
      },
    },
  ],
}

/**
 * Commercial inventory. Two live projects with per-unit pricing, so a buyer
 * can find their budget without calling first.
 */
export const COMMERCIAL = {
  eyebrow: { en: 'Commercial', am: 'የንግድ ሱቆች' },
  heading: { en: 'Own a shop.', am: 'የሱቅ ባለቤት ይሁኑ።' },
  body: {
    en:
      'Two retail developments now selling. 10% off for buyers paying 100% up ' +
      'front on either.',
    am: 'ሁለት የንግድ ፕሮጀክቶች በሽያጭ ላይ። ሙሉ ክፍያ ለሚፈጽሙ 10% ቅናሽ።',
  },

  projects: [
    {
      id: 'piyassa',
      // Wonde's own framing from the Telegram post. The facts array below
      // carries the same terms as structured data; this is the pitch in his
      // voice. If a price changes, change both.
      pitch: [
        {
          en: 'Your chance to own a shop in Piyassa, a district being rebuilt to rival Dubai.',
          am: 'እንደ ዱባይ እየተዋበች ባለችው ፒያሳ ላይ የሱቅ ባለቤት የሚሆኑበት እድል እነሆ!',
        },
        {
          en: 'Own a shop where the footfall already is.',
          am: 'ከፍተኛ የሰዎች እንቅስቃሴ ባለበት የሱቅ ባለቤት ይሁኑ።',
        },
        {
          en: '10% off for buyers paying 100% up front.',
          am: '100% ለሚከፍሉ 10% ቅናሽ።',
        },
      ],
      name: { en: 'Piyassa - Adwa Museum', am: 'መሃል ፒያሳ · አድዋ ሙዝየም' },
      summary: {
        en: '2 basements + G+5 retail centre, opposite the Adwa Museum and beside the main car park.',
        am: '2 ምድር ቤት + G+5 የገበያ ማዕከል፤ ከአድዋ ሙዝየም ፊት ለፊት እና ከዋናው መኪና ማቆሚያ አጠገብ።',
      },
      facts: [
        { k: { en: 'Total price', am: 'ጠቅላላ ዋጋ' }, v: { en: '7,000,000 birr', am: '7,000,000 ብር' } },
        {
          k: { en: 'Down payment', am: 'ቅድመ ክፍያ' },
          v: { en: '2,800,000 birr', am: '2,800,000 ብር' },
        },
        {
          k: { en: 'Balance', am: 'ቀሪ ክፍያ' },
          v: { en: '10 instalments, interest free', am: 'በ10 ክፍያ፣ ያለ ወለድ' },
        },
        {
          k: { en: 'Handover', am: 'ርክክብ' },
          v: { en: '1 year 6 months', am: 'በ1 ዓመት ከ6 ወር' },
        },
      ],
      features: [
        { en: '6 escalators, 4 lifts', am: '6 ኤስካሌተር፣ 4 ሊፍት' },
        { en: 'Shared terrace', am: 'የጋራ ቴራስ' },
        { en: 'Ground floor units', am: 'የመሬት ወለል ሱቆች' },
        { en: 'No dollar-linked increases', am: 'በዶላር ምክንያት ጭማሪ የለም' },
      ],
    },
    {
      id: 'kaliti',
      pitch: [
        {
          en: 'Six sites already built and handed over. This one is in central Kaliti (Gelan).',
          am: '6 ሳይቶችን ሰርተን አስረክበናል። ይህኛው መሀል ቃሊቲ (ገላን) ላይ ነው።',
        },
        {
          en: '10% off for buyers paying 100% up front.',
          am: '100% ለሚከፍሉ 10% ቅናሽ።',
        },
      ],
      name: { en: 'Kaliti - Gelan', am: 'ቃሊቲ (ገላን)' },
      summary: {
        en: 'A wide modern mall in central Kaliti. Six sites already built and handed over.',
        am: 'በቃሊቲ መሃል የሚገኝ ሰፊ ዘመናዊ ሞል። ስድስት ፕሮጀክቶች ተሰርተው ተረክበዋል።',
      },
      // floor, size, total price, down payment
      units: [
        { floor: { en: 'Ground', am: 'መሬት' }, size: '24 m²', price: '6,900,000', down: '3,000,000' },
        { floor: { en: 'Ground', am: 'መሬት' }, size: '26 m²', price: '4,500,000', down: '2,000,000' },
        { floor: { en: 'Ground', am: 'መሬት' }, size: '16 m²', price: '4,300,000', down: '1,800,000' },
        { floor: { en: '1st', am: '1ኛ' }, size: '26.4 m²', price: '3,200,000', down: '1,200,000' },
        { floor: { en: '2nd', am: '2ኛ' }, size: '26.8 m²', price: '2,800,000', down: '800,000' },
        { floor: { en: '3rd', am: '3ኛ' }, size: '26.8 m²', price: '2,600,000', down: '600,000' },
        { floor: { en: '4th', am: '4ኛ' }, size: '23.5 m²', price: '2,500,000', down: '500,000' },
      ],
    },
  ],
}


/**
 * The two things Temer sells. Rendered as a pair so neither reads as a
 * footnote to the other - homes were carrying the whole page before, and the
 * shops were buried at the bottom.
 */
export const PILLARS = {
  eyebrow: { en: 'Two things', am: 'ሁለት ነገሮች' },
  heading: { en: 'Homes, and shops.', am: 'ቤቶች እና ሱቆች።' },
  items: [
    {
      id: 'homes',
      kind: { en: 'Homes', am: 'ቤቶች' },
      lead: {
        en: 'Studio to three bedroom, at two live sites on major roundabouts.',
        am: 'ከስቱዲኦ እስከ ባለ ሶስት መኝታ፤ በሁለት ዋና አደባባዮች ላይ።',
      },
      figures: [
        { k: { en: 'Sizes', am: 'ስፋት' }, v: '32 - 154 m²' },
        { k: { en: 'Rate', am: 'ዋጋ' }, v: { en: '130,000 birr / m²', am: '130,000 ብር በካሬ' } },
        { k: { en: 'Discount', am: 'ቅናሽ' }, v: { en: 'up to 35%', am: 'እስከ 35%' } },
      ],
      sites: [
        {
          name: { en: 'Sarbet Adebabay', am: 'ሳር ቤት አደባባይ' },
          size: '76 - 151 m²',
          note: { en: 'Up to 30% off', am: 'እስከ 30% ቅናሽ' },
        },
        {
          name: { en: 'Megenagna Diaspora Adebabay', am: 'መገናኛ ዲያስፖራ አደባባይ' },
          size: '32 - 154 m²',
          note: { en: 'Up to 35% off', am: 'እስከ 35% ቅናሽ' },
        },
      ],
      href: '#offer',
    },
    {
      id: 'shops',
      kind: { en: 'Shops', am: 'ሱቆች' },
      lead: {
        en: 'Retail units in two developments, sold per floor with interest-free terms.',
        am: 'በሁለት ፕሮጀክቶች ውስጥ ሱቆች፤ በፎቅ የሚሸጡ፣ ያለ ወለድ ክፍያ።',
      },
      figures: [
        { k: { en: 'Sizes', am: 'ስፋት' }, v: '16 - 27 m²' },
        { k: { en: 'From', am: 'ከ' }, v: { en: '500,000 birr down', am: '500,000 ብር ቅድመ ክፍያ' } },
        { k: { en: 'Full payment', am: 'ሙሉ ክፍያ' }, v: { en: '10% off', am: '10% ቅናሽ' } },
      ],
      sites: [
        {
          name: { en: 'Piyassa - Adwa Museum', am: 'መሃል ፒያሳ · አድዋ ሙዝየም' },
          size: '2B + G+5',
          note: { en: '10 interest-free instalments', am: 'በ10 ክፍያ፣ ያለ ወለድ' },
        },
        {
          name: { en: 'Kaliti - Gelan', am: 'ቃሊቲ (ገላን)' },
          size: 'G+4',
          note: { en: 'Per-floor pricing', am: 'በፎቅ ዋጋ' },
        },
      ],
      href: '#commercial',
    },
  ],
}

/**
 * Buildings already finished and handed over.
 *
 * These four used to sit inside the listings carousel alongside the offer
 * posters, where a finished building read as one more advert. They are the
 * proof behind every figure on this page, so they have their own section and
 * their photographs run in full colour - the carousel now carries the running
 * offers only. Keep them here and not in POSTS, so the same building never
 * appears twice on one page.
 *
 * The photographs are Wonde's own, with the name, location and built-up area
 * burned into the artwork. The caption repeats all three as text, so they
 * translate and so a screen reader can reach them.
 *
 * `id` is the image file: public/posts/<id>.webp.
 */
export const DELIVERED = {
  eyebrow: { en: 'Delivered', am: 'የተረከብናቸው' },
  heading: {
    en: 'Finished, handed over,\nlived in.',
    am: 'ተጠናቀው፣ ተረክበው፣\nእየተኖረባቸው።',
  },
  body: {
    en:
      'Eleven projects completed in ten years. Four of them are below - and ' +
      'you can go and stand in front of any of them.',
    am:
      'በ10 ዓመት ውስጥ 11 ፕሮጀክቶች ተጠናቀዋል። ከእነዚህ አራቱ ከዚህ በታች አሉ - ' +
      'ሄደው በአካል ማየት ይችላሉ።',
  },
  stats: [
    { value: '11', label: { en: 'Projects handed over', am: 'የተረከቡ ፕሮጀክቶች' } },
    { value: '10', label: { en: 'Years building', am: 'ዓመታት በግንባታ' } },
    // 603 + 822 + 1,080 + 750, the four below.
    { value: '3,255', label: { en: 'm² across these four', am: 'ካሬ በእነዚህ አራቱ' } },
  ],
  /*
    Order is a layout decision, not an editorial one. The grid is two columns
    of un-cropped photographs, so a row is as tall as its taller card; with the
    one portrait photograph last, its row left a 200px hole under the card
    beside it and the section ended on that hole. Leading with it puts the
    mismatch in the middle of the grid and leaves the two 1000x497 frames to
    close the section level with each other.
  */
  sites: [    {
      id: 'post-04', w: 1000, h: 837,
      name: 'Mohammed.S',
      place: { en: 'Lafto', am: 'ላፍቶ' },
      spec: '2B+G+6',
      area: '750 m²',
      note: {
        en: 'Occupied - the lights in the windows are residents.',
        am: 'ተይዞ እየተኖረበት ነው - በመስኮቶቹ የሚታየው ብርሃን የነዋሪዎች ነው።',
      },
    },
    {
      id: 'post-01', w: 1000, h: 520,
      name: 'AGT Trading',
      place: { en: 'Atena Tera', am: 'አጤና ተራ' },
      spec: '2B+G+5',
      area: '603 m²',
      note: {
        en: 'Two basements plus ground and five floors, on the market street.',
        am: '2 ምድር ቤት ከነግራውንድ እና 5 ፎቅ፤ በገበያው መንገድ ላይ።',
      },
    },
    {
      id: 'post-02', w: 1000, h: 497,
      name: 'MAW',
      place: { en: 'Ayat', am: 'አያት' },
      spec: 'B+G+11',
      area: '822 m²',
      note: {
        en: 'Eleven floors, finished complete and on schedule.',
        am: '11 ፎቅ፤ ጥንቅቅ ተደርጎ በጊዜው ተጠናቋል።',
      },
    },
    {
      id: 'post-03', w: 1000, h: 497,
      name: '2MA',
      place: { en: 'Lebu', am: 'ለቡ' },
      spec: 'B+G+9',
      area: '1,080 m²',
      note: {
        en: 'The largest of the four by built-up area.',
        am: 'በተሰራ ስፋት ከአራቱ ትልቁ።',
      },
    },
  ],
}

/**
 * Wonde's social posts, prepared by scripts/media/posts.mjs.
 *
 * The offers currently running, as poster artwork. Buildings already handed
 * over live in DELIVERED above, with their own section - they were in here
 * once and the same four buildings then appeared twice on the page.
 *
 * The feed renders these in a light warm duotone and returns them to their
 * real colours on hover or tap - see Feed.jsx.
 */
export const POSTS = [
  {
    id: 'post-05', kind: 'offer', w: 1000, h: 1250,
    title: { en: 'Sarbet', am: 'ሳር ቤት' },
    place: { en: 'Luxury living centre', am: 'የቅንጦት ህይወት ማዕከል' },
    detail: { en: '30% off', am: '30% ቅናሽ' },
    lines: [
      {
        en: 'Own a home for a total of just 4.6 million birr.',
        am: 'በ4.6 ሚልዮን ብር ጠቅላላ ክፍያ ብቻ የቤት ባለቤት ይሁኑ።',
      },
      {
        en: 'Pay 40% now. The remaining 60% is due when you take the keys, with no increase on the balance.',
        am: 'የቤቱን 40% ብቻ ከፍለው ቀሪውን 60% ቤትዎን ሲረከቡ ይክፈሉ፤ በቀሪ ክፍያ ላይ ምንም ጭማሪ የለም።',
      },
      {
        en: 'Studio to three bedroom at Sarbet Adebabay, 76 to 151 m², at up to 30% off.',
        am: 'በሳር ቤት አደባባይ ከስቱዲኦ እስከ ባለ ሶስት መኝታ፣ ከ76 እስከ 151 ካሬ፣ እስከ 30% ቅናሽ።',
      },
      {
        en: 'Buying from abroad? The documents go out to you by DHL.',
        am: 'ከሀገር ውጭ ነዎት? ሰነዶቹን ባሉበት በDHL እንልካለን።',
      },
    ],
  },
  {
    id: 'post-06', kind: 'offer', w: 1000, h: 1250,
    title: { en: 'Megenagna', am: 'መገናኛ' },
    place: { en: 'New site now open', am: 'አዲስ ሳይት ተከፍቷል' },
    detail: { en: '35% off · 32-154 m²', am: '35% ቅናሽ · 32-154 ካሬ' },
    lines: [
      {
        en: 'A new Temer site at Megenagna, on the Diaspora roundabout.',
        am: 'በመገናኛ ዲያስፖራ አደባባይ አዲስ የቴምር ሳይት።',
      },
      {
        en: '32 to 154 m², at 130,000 birr per square metre, with up to 35% off.',
        am: 'ከ32 እስከ 154 ካሬ፣ በካሬ 130,000 ብር፣ እስከ 35% ቅናሽ።',
      },
      {
        en: '40% on signing and 60% on handover, with no price increase on the balance.',
        am: '40% ቅድመ ክፍያ እና 60% ሲረከቡ፤ በቀሪ ክፍያ ላይ የዋጋ ጭማሪ የለም።',
      },
    ],
  },
  {
    id: 'post-07', kind: 'offer', w: 1000, h: 1250,
    title: { en: 'Sarbet Adebabay', am: 'ሳር ቤት አደባባይ' },
    place: { en: 'Diplomat neighbourhood', am: 'ዲፕሎማት መንደር' },
    detail: { en: '30% off', am: '30% ቅናሽ' },
    lines: [
      {
        en: 'A new Temer address in the diplomat neighbourhood at Sarbet.',
        am: 'በሳር ቤት ዲፕሎማት መንደር አዲስ የቴምር አድራሻ።',
      },
      {
        en: 'Up to 30% off, with 40% on signing and 60% on handover.',
        am: 'እስከ 30% ቅናሽ፤ 40% ቅድመ ክፍያ እና 60% ሲረከቡ።',
      },
      {
        en: 'Gated compound houses are also available, at up to 35% off.',
        am: 'ግቢ ቤቶችም እስከ 35% ቅናሽ ይገኛሉ።',
      },
    ],
  },
  {
    id: 'post-08', kind: 'offer', w: 1000, h: 1250,
    title: { en: 'Sarbet', am: 'ሳር ቤት' },
    place: { en: 'By Adams Pavilion', am: 'ከአዳምስ ፓቪሊየን ጎን' },
    detail: { en: '76-151 m² · 30% off', am: '76-151 ካሬ · 30% ቅናሽ' },
    lines: [
      {
        en: 'At Sarbet, beside Adams Pavilion.',
        am: 'በሳር ቤት፣ ከአዳምስ ፓቪሊየን ጎን።',
      },
      {
        en: 'Studio to three bedroom, 76 to 151 m², at up to 30% off.',
        am: 'ከስቱዲኦ እስከ ባለ ሶስት መኝታ፣ ከ76 እስከ 151 ካሬ፣ እስከ 30% ቅናሽ።',
      },
      {
        en: '4.6 million birr in total: 40% on signing, 60% when you take the keys.',
        am: 'በ4.6 ሚልዮን ብር ጠቅላላ፡ 40% ቅድመ ክፍያ፣ 60% ቤትዎን ሲረከቡ።',
      },
    ],
  },
  {
    id: 'post-09', kind: 'offer', w: 1000, h: 1000,
    title: { en: 'Sarbet', am: 'ሳር ቤት' },
    place: { en: 'Studio to three bedroom', am: 'ከስቱዲኦ እስከ ባለ ሶስት መኝታ' },
    detail: { en: '76-151 m² · 30% off', am: '76-151 ካሬ · 30% ቅናሽ' },
    lines: [
      {
        en: 'Studio to three bedroom at Sarbet, 76 to 151 m².',
        am: 'በሳር ቤት ከስቱዲኦ እስከ ባለ ሶስት መኝታ፣ ከ76 እስከ 151 ካሬ።',
      },
      {
        en: 'Up to 30% off, and no price increase on the balance.',
        am: 'እስከ 30% ቅናሽ፤ በቀሪ ክፍያ ላይ የዋጋ ጭማሪ የለም።',
      },
      {
        en: 'Temer is also selling modern G+5 retail at Sarbet, African Union and Piyassa, from 1,400,000 birr down.',
        am: 'ቴምር እንዲሁም ዘመናዊ G+5 የንግድ ሱቆች በሳር ቤት፣ አፍሪካ ህብረት እና ፒያሳ ከ1,400,000 ብር ቅድመ ክፍያ ጀምሮ እየሸጠ ነው።',
      },
    ],
  },
]

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
