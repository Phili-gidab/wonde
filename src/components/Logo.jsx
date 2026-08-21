/**
 * The Temer logo, as a green tile.
 *
 * The source artwork is a white mark on a green square, and the green in that
 * file is not flat - it carries a vignette. scripts/media/logo.mjs keys it out
 * and ships the mark as white-on-transparent, so the tile colour comes from
 * `--brand-green` here rather than from the JPEG. That is what keeps the logo
 * on-palette, and it is also why the mark must never be placed on a white
 * ground: it is pure white, and would vanish.
 *
 * Two renditions, because one cannot serve both ends of the size range. Below
 * roughly 64px the "Temer PROPERTIES" wordmark inside the lockup turns to
 * mush, so small placements get `mark` (the palms and towers alone) and the
 * name is carried by the text beside it. `lockup` is for the loader, where
 * there is room for it to be read.
 *
 * Decorative in every current placement - the brand name is always set in
 * text alongside - so `alt` is empty and the tile is hidden from screen
 * readers rather than announced twice.
 */
export default function Logo({ size = 36, lockup = false }) {
  return (
    <span className="logo-tile" style={{ '--logo-size': `${size}px` }} aria-hidden="true">
      <img
        src={lockup ? '/logo-lockup.webp' : '/logo-mark.webp'}
        alt=""
        loading="eager"
        decoding="async"
      />
    </span>
  )
}
