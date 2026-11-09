/**
 * The 1%-a-month shop payment plan, from Wonde's Telegram post. The Amharic is
 * his wording with the emoji taken out, and the share trimmed from two steps
 * where it would repeat the figure beside it. The English is a translation.
 *
 * It covers three sites: Sarbet, Bulgaria and Gelan. Piyassa is not part of
 * it and keeps its own terms in COMMERCIAL. The shares must add up to 100 -
 * 25 down, 24 over two years, 51 through construction and handover.
 */
export const SHOP_PLAN = {
  eyebrow: { en: 'Temer Properties', am: 'ቴመር ፕሮፐርቲስ' },
  title: {
    en: 'A big opportunity for your business.',
    am: 'ለንግድዎ ትልቅ ዕድል ከቴመር ፕሮፐርቲስ!',
  },
  lead: {
    en:
      'For buyers looking for a shop: a new, easy way to pay that makes owning ' +
      'a shop at Sarbet (City Plus), Bulgaria (Ajwa Shop) and Gelan (Gelan ' +
      'Commercial) a reality.',
    am:
      'የንግድ ሱቅ ለሚፈልጉ ደንበኞች፤ በሳርቤት (City Plus)፣ በቡልጋሪያ (Ajwa Shop) እና ' +
      'በገላን (Gelan Commercial) የንግድ ሱቅ የባለቤትነት ህልምዎን እውን የሚያደርግ አዲስ እና ' +
      'ምቹ የሆነ የክፍያ አማራጭ ይዘንላችሁ መጥተናል!',
  },
  sites: [
    { en: 'Sarbet · City Plus', am: 'ሳርቤት · City Plus' },
    { en: 'Bulgaria · Ajwa Shop', am: 'ቡልጋሪያ · Ajwa Shop' },
    { en: 'Gelan · Gelan Commercial', am: 'ገላን · Gelan Commercial' },
  ],
  headline: {
    en: 'Own a shop paying just 1% a month.',
    am: 'በወር 1% ብቻ እየከፈሉ የንግድ ሱቅ ባለቤት ይሁኑ!',
  },
  stepsTitle: { en: 'How you pay', am: 'የአከፋፈል ሁኔታ' },
  steps: [
    {
      share: '25%',
      text: { en: 'Down payment, on signing the contract', am: 'ቅድመ ክፍያ ውል ሲፈራረሙ' },
    },
    {
      share: '1%',
      text: {
        en: 'A month, for 24 consecutive months (24% in total)',
        am: 'በወር፣ ለ24 ተከታታይ ወራት (በድምሩ 24%)',
      },
    },
    {
      share: '51%',
      text: {
        en: 'The balance, during construction and when you take the shop',
        am: 'ቀሪው፣ በግንባታው ሂደት እና ሱቅዎን ሲረከቡ',
      },
    },
  ],
  discountsTitle: { en: 'Discounts', am: 'የቅናሽ አማራጮች' },
  discounts: [
    { share: '30%', text: { en: 'Off, paying 100% up front', am: 'ቅናሽ፣ ሙሉ በሙሉ (100%) ለሚከፍሉ' } },
    { share: '15%', text: { en: 'Off, paying 50% up front', am: 'ቅናሽ፣ 50% ቅድመ ክፍያ ለሚከፍሉ' } },
  ],
  close: {
    en: 'Secure your shop now, and start tomorrow’s business today.',
    am: 'የንግድ ቦታዎን አሁኑኑ በመያዝ የነገ የንግድ ጉዞዎን ዛሬ ይጀምሩ!',
  },
}
