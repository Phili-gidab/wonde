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
  callNow: { en: 'Call now', am: 'አሁኑኑ ይደውሉ' },
  salesConsultant: { en: 'Sales consultant', am: 'የሽያጭ አማካሪ' },
  menu: { en: 'Menu', am: 'ማውጫ' },
  mainNav: { en: 'Main', am: 'ዋና ማውጫ' },
  footerNav: { en: 'Footer', am: 'የግርጌ ማውጫ' },
  newTab: { en: '(opens in a new tab)', am: '(በአዲስ ትር ይከፈታል)' },
  askAboutUnit: { en: 'Ask Wonde about a unit', am: 'ስለ ሱቅ ወንደሰንን ይጠይቁ' },
  allFiguresBirr: { en: 'All figures in birr.', am: 'ሁሉም ዋጋዎች በብር ናቸው።' },
  rightsReserved: {
    en: 'All rights reserved.',
    am: 'ሁሉም መብቶች የተጠበቁ ናቸው።',
  },
  handedOver: { en: "Handed over", am: "ተረክቧል" },
  offerNow: { en: "Offer", am: "ቅናሽ" },
  viewLarger: { en: 'view full size', am: 'በሙሉ መጠን ይመልከቱ' },
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
}

/**
 * The page sections, top to bottom: hero, listings (the posters), the offer
 * underneath them, and the contact block. `NAV` is the menu, in page order.
 */
export const NAV = [
  { id: 'listings', label: { en: 'Listings', am: 'ማስታወቂያዎች' } },
  { id: 'offer', label: { en: 'The offer', am: 'ዋጋው' } },
  { id: 'why', label: { en: 'Why Temer', am: 'ለምን ቴምር' } },
  { id: 'delivered', label: { en: 'Delivered', am: 'የተረከብናቸው' } },
  { id: 'commercial', label: { en: 'Shops', am: 'ሱቆች' } },
  { id: 'contact', label: { en: 'Contact', am: 'ያግኙን' } },
]

export const HERO = {
  badge: { en: '11 projects handed over in 10 years', am: 'በ10 ዓመት 11 ፕሮጀክቶች ተረክበዋል' },
  heading: {
    en: 'A home in Addis,\nwithout the wait.',
    am: 'በአዲስ አበባ\nየቤት ባለቤት ይሁኑ።',
  },
  body: {
    en:
      'Apartments at Sarbet, Megenagna, Bulgaria and Aware, from studio to ' +
      'three bedroom. Handed over complete, on schedule.',
    am:
      'በሳር ቤት፣ በመገናኛ፣ በቡልጋሪያ እና በአዋሬ፤ ከስቱዲኦ እስከ ባለ ሶስት መኝታ። ' +
      'ጥንቅቅ ተደርገው በጊዜው ይረከባሉ።',
  },
  cta: { en: 'See the listings', am: 'ማስታወቂያዎቹን ይመልከቱ' },
}

export const LISTINGS = {
  eyebrow: { en: 'Listings', am: 'ማስታወቂያዎች' },
  heading: { en: 'What’s selling right now.', am: 'አሁን በሽያጭ ላይ ያለው።' },
}

export const OFFER = {
  eyebrow: { en: 'The offer', am: 'ዋጋው' },
  heading: { en: '4.6 million birr, all in.', am: 'በ4.6 ሚልዮን ብር ጠቅላላ ክፍያ ብቻ።' },
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
}

export const CONTACT = {
  eyebrow: { en: 'Speak to Wonde', am: 'ወንደሰንን ያግኙ' },
  heading: { en: 'Talk to someone who picks up.', am: 'ስልክ ለሚያነሳ ሰው ይደውሉ።' },
  body: {
    en: 'One number, one person, from the first call to the handover. Call, or message on WhatsApp or Telegram.',
    am: 'ከመጀመሪያው ጥሪ እስከ ርክክብ ድረስ - አንድ ስልክ፣ አንድ ሰው። ይደውሉ፣ ወይም በዋትስአፕ እና በቴሌግራም ይጻፉ።',
  },
}

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
      'Eleven projects completed and handed over in ten years, and four sites ' +
      'selling now. This is what you are buying into.',
    am: 'ቴምር በ10 ዓመት ውስጥ 11 ፕሮጀክቶች አጠናቆ አስረክቧል። ' +
      'አራት ሳይቶች አሁን በሽያጭ ላይ ናቸው።',
  },
  items: [
    {
      id: 'location',
      icon: 'pin',
      title: { en: 'Prime location', am: 'ምርጥ አካባቢ' },
      body: {
        en:
          'Four live sites - Sarbet Adebabay, Megenagna Diaspora Adebabay, ' +
          'Bulgaria and Aware - with retail at Piyassa, Kaliti and Bulgaria.',
        am:
          'ሳር ቤት አደባባይ፣ መገናኛ ዲያስፖራ አደባባይ፣ ቡልጋሪያ እና አዋሬ - አራት ሳይቶች። ' +
          'ሱቆችም በፒያሳ፣ በቃሊቲ እና በቡልጋሪያ።',
      },
    },
    {
      id: 'price',
      icon: 'price',
      title: { en: 'Affordable price', am: 'ተመጣጣኝ ዋጋ' },
      body: {
        en:
          '4.6 million birr all in, from 115,000 birr per square metre, with ' +
          'discounts of up to 35%.',
        am: 'በጠቅላላ 4.6 ሚልዮን ብር፤ ከ115,000 ብር በካሬ፤ እስከ 35% ቅናሽ።',
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
        en: 'Studio to three bedroom, at four live sites across the city.',
        am: 'ከስቱዲኦ እስከ ባለ ሶስት መኝታ፤ በአራት ሳይቶች።',
      },
      figures: [
        { k: { en: 'Sizes', am: 'ስፋት' }, v: '32 - 154 m²' },
        // Bulgaria sells at 115,000 and the older sites at 130,000, so this is a
        // floor and not a flat rate. See POSTS post-10.
        {
          k: { en: 'Rate', am: 'ዋጋ' },
          v: { en: 'from 115,000 birr / m²', am: 'ከ115,000 ብር በካሬ' },
        },
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
        // No published unit mix for these two yet - the posters carry the rate
        // and the discount only, so `size` holds what is known rather than an
        // empty cell. Replace it the moment Wonde sends the sizes.
        {
          name: { en: 'Bulgaria', am: 'ቡልጋሪያ' },
          size: '115,000 / m²',
          note: { en: 'Homes and shops, 30% off', am: 'መኖሪያ እና ሱቅ፣ እስከ 30% ቅናሽ' },
        },
        {
          name: { en: 'Aware', am: 'አዋሬ' },
          size: '—',
          note: { en: 'Up to 35% off', am: 'እስከ 35% ቅናሽ' },
        },
      ],
      href: '#listings',
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

export { DELIVERED, POSTS } from './posts.js'
