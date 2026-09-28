/**
 * Image-led content: the delivered buildings and the running offer posters.
 * Split out of content.js to keep each file readable; re-exported from there.
 */

/**
 * Buildings already finished and handed over.
 *
 * They are the proof behind every figure on this page, so they have their
 * own section rather than sitting among the offer posters. Keep them here and
 * not in POSTS, so the same building never appears twice on one page.
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
 * Rendered one under another, poster beside its copy - see Listings.jsx.
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
    id: 'post-12', kind: 'offer', w: 1000, h: 1000,
    title: { en: 'Aware', am: 'አዋሬ' },
    place: { en: 'Apartments', am: 'አፓርታማዎች' },
    detail: { en: '10th anniversary offer', am: 'የ10ኛ ዓመት ቅናሽ' },
    lines: [
      {
        en: 'Apartments at Aware, in Temer’s tenth anniversary year.',
        am: 'አፓርታማዎች በአዋሬ።',
      },
      {
        en: 'Temer is a ShebaMiles partner.',
        am: 'ቴምር የShebaMiles አጋር ነው።',
      },
    ],
  },
  {
    id: 'post-10', kind: 'offer', w: 1000, h: 1000,
    title: { en: 'Bulgaria', am: 'ቡልጋሪያ' },
    place: { en: 'Homes and shops', am: 'መኖሪያ እና የንግድ ሱቅ' },
    detail: { en: '115,000 birr / m² · 30% off', am: 'በካሬ 115,000 ብር · እስከ 30% ቅናሽ' },
    lines: [
      {
        en: 'A new Temer site at Bulgaria - homes and commercial shops in one building.',
        am: 'በቡልጋሪያ አዲስ የቴምር ሳይት - መኖሪያ እና የንግድ ሱቅ።',
      },
      {
        en: '115,000 birr per square metre, against 130,000 at the older sites.',
        am: 'በካሬ 115,000 ብር።',
      },
    ],
  },
  {
    id: 'post-11', kind: 'offer', w: 1000, h: 1000,
    title: { en: 'Four sites', am: 'አራት ሳይቶች' },
    place: {
      en: 'Aware · Sarbet · Gelan · Bulgaria',
      am: 'አዋሬ · ሳር ቤት · ገላን · ቡልጋሪያ',
    },
    detail: { en: '35% off', am: 'እስከ 35% ቅናሽ' },
    lines: [
      {
        en: 'Four sites to choose from: Aware, Sarbet, Gelan and Bulgaria.',
        am: 'አራት ሳይቶች፡ አዋሬ፣ ሳር ቤት፣ ገላን እና ቡልጋሪያ።',
      },
      {
        en: '35% off across all four.',
        am: 'እስከ 35% ቅናሽ።',
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
