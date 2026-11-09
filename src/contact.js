export const PHONE = '+251 94 125 5153'
export const PHONE_TEL = 'tel:+251941255153'
export const WHATSAPP = 'https://wa.me/251941255153'
export const TELEGRAM = 'https://t.me/wendii02'
export const AGENT = 'ወንደሰን'
export const AGENT_EN = 'Wondesen'

/** Google Ads "Contact" conversion, fired from every phone, WhatsApp and Telegram link. */
export function reportContact() {
  window.gtag?.('event', 'conversion', { send_to: 'AW-18526184031/jfGXCLujwbEdEN_E_IFF' })
}
