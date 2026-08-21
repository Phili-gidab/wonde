/**
 * Prepares the Temer logo for the site.
 *   media-src/temer_logo.jpg  ->  logo-mark.webp, logo-lockup.webp, favicon.png, og.jpg
 *
 * The source sits in the gitignored `media-src/`, like the post photographs
 * and the source GLB - only the generated assets in `public/` are committed,
 * and only they ship. Leaving the original in `public/` published a 39 KB JPEG
 * that nothing on the page ever requested.
 *
 * Run with: npm run media:logo
 *
 * The source is a 640x640 JPEG: a white palm-and-towers mark over "Temer
 * PROPERTIES", on a green background that is not flat - it carries a soft
 * vignette from a lighter centre-right to a darker lower-left.
 *
 * Three consequences drive everything here:
 *
 * 1. That vignette means the file cannot be cropped and dropped onto a CSS
 *    green tile - the seam between the JPEG's green and the token's green is
 *    plainly visible. So the green is keyed OUT and the tile colour comes from
 *    the stylesheet, which also keeps the logo on-palette everywhere it lands.
 *
 * 2. The mark is pure white and the background never gets near it, so the
 *    key is a threshold on the MINIMUM channel rather than a hue test: the
 *    background's blue channel sits at 22-59 and white's is 250+. Soft
 *    thresholding over that gap gives antialiased edges rather than a
 *    stair-stepped cutout, which matters at 32px.
 *
 * 3. The mark sits high in the square and the wordmark is small, so one
 *    rendition cannot serve both a 32px favicon and a 96px loader. The mark
 *    alone is cut for small sizes - below about 64px the wordmark is mush -
 *    and the full lockup is kept for where there is room.
 */
import sharp from 'sharp'

const SRC = 'media-src/temer_logo.jpg'

/** Below this on the min channel is background, above it is mark. */
const KEY_LOW = 90
const KEY_HIGH = 225

const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true })
const { width: W, height: H, channels: C } = info

/**
 * White mark, transparent background.
 *
 * RGB is forced to pure white rather than kept from the source: the JPEG's
 * "white" drifts to 246-252 and picks up green fringing along every edge, and
 * once the background is gone that fringe is what you see.
 */
const rgba = Buffer.alloc(W * H * 4)
let bgR = 0
let bgG = 0
let bgB = 0
let bgN = 0

for (let i = 0, p = 0; p < W * H; p++, i += C) {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  const min = Math.min(r, g, b)

  const t = (min - KEY_LOW) / (KEY_HIGH - KEY_LOW)
  const alpha = Math.round(255 * Math.max(0, Math.min(1, t)))

  rgba[p * 4] = 255
  rgba[p * 4 + 1] = 255
  rgba[p * 4 + 2] = 255
  rgba[p * 4 + 3] = alpha

  // Average the untouched background, for the brand green the tile uses.
  if (alpha === 0) {
    bgR += r
    bgG += g
    bgB += b
    bgN++
  }
}

const hex = (n) => n.toString(16).padStart(2, '0')
const green = `#${hex(Math.round(bgR / bgN))}${hex(Math.round(bgG / bgN))}${hex(Math.round(bgB / bgN))}`

const keyed = () => sharp(rgba, { raw: { width: W, height: H, channels: 4 } })

// The mark ends and the wordmark begins at y=385: white coverage per row
// falls from 257 to 29 across five rows there. Measured, not guessed - re-run
// the row scan if the source is ever replaced.
const MARK_BOTTOM = 384

/*
  Two passes, not one chain. sharp applies operations in its own fixed order
  rather than in the order they are called, and `trim` runs ahead of the
  pre-resize `extract` - so a chained extract+trim asks the second operation
  for a region of an image the first one has already shrunk, and throws
  `extract_area: bad extract area`. Cutting to a buffer first is unambiguous.
*/
const markRaw = await keyed()
  .extract({ left: 0, top: 0, width: W, height: MARK_BOTTOM })
  .png()
  .toBuffer()

const lockupRaw = await keyed().png().toBuffer()

await sharp(markRaw)
  .trim()
  .resize({ width: 512, fit: 'inside', withoutEnlargement: true })
  .webp({ quality: 92, alphaQuality: 100 })
  .toFile('public/logo-mark.webp')

await sharp(lockupRaw)
  .trim()
  .resize({ width: 512, fit: 'inside', withoutEnlargement: true })
  .webp({ quality: 92, alphaQuality: 100 })
  .toFile('public/logo-lockup.webp')

/** Favicon and touch icon: the mark, inset on a flat tile of the brand green. */
const markTile = await sharp(markRaw)
  .trim()
  .resize({ width: 132, height: 132, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer()

await sharp({
  create: { width: 180, height: 180, channels: 4, background: green },
})
  .composite([{ input: markTile, gravity: 'centre' }])
  .png()
  .toFile('public/favicon.png')

/** Link preview: the full lockup, centred on the brand green at 1200x630. */
const lockup = await sharp(lockupRaw)
  .trim()
  .resize({ width: 420, fit: 'inside' })
  .png()
  .toBuffer()

await sharp({ create: { width: 1200, height: 630, channels: 3, background: green } })
  .composite([{ input: lockup, gravity: 'centre' }])
  .jpeg({ quality: 88 })
  .toFile('public/og.jpg')

// The green is not written to a file - it is pasted into `--brand-green` in
// src/index.css, where it belongs. This log is how you get it after a source
// swap; the token is the single place the value actually lives.
console.log('brand green sampled from the source background:', green)
console.log('wrote logo-mark.webp, logo-lockup.webp, favicon.png, og.jpg')
