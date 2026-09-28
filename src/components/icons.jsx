/**
 * Contact glyphs, on one 24-unit grid at a 1.7 stroke so they sit together.
 */
function Glyph({ size, children }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function PhoneIcon({ size = 20 }) {
  return (
    <Glyph size={size}>
      <path d="M6.5 3.5h3l1.5 4-2 1.4a12 12 0 0 0 6.1 6.1l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />
    </Glyph>
  )
}

export function WhatsAppIcon({ size = 20 }) {
  return (
    <Glyph size={size}>
      <path d="M3.8 20.2 5 16.1A8.4 8.4 0 1 1 8 19Z" />
      <path d="M9.3 8.3c.3-.3.8-.3 1 .1l.7 1.4c.1.3 0 .6-.2.8l-.5.5a5.6 5.6 0 0 0 2.6 2.6l.5-.5c.2-.2.5-.3.8-.2l1.4.7c.4.2.4.7.1 1l-.5.5c-.6.6-1.6.8-2.4.4a9 9 0 0 1-4.1-4.1c-.4-.8-.2-1.8.4-2.4Z" />
    </Glyph>
  )
}

export function TelegramIcon({ size = 20 }) {
  return (
    <Glyph size={size}>
      <path d="M20.8 4.4 3.3 11.2c-.8.3-.8 1.4 0 1.7l4.3 1.4 1.7 5.2c.2.6 1 .8 1.5.3l2.4-2.3 4.4 3.3c.6.4 1.4.1 1.5-.6l2.9-14.6c.1-.8-.6-1.4-1.2-1.2Z" />
      <path d="m7.6 14.3 9.2-6.1-6.4 7" />
    </Glyph>
  )
}

export function Chevron({ back = false, size = 18 }) {
  return (
    <Glyph size={size}>
      <path d={back ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </Glyph>
  )
}
