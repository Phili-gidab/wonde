/**
 * Prepares Wonde's social posts for the page.
 *   public/photo_*.jpg  ->  public/posts/post-NN.webp
 *
 * Run with: npm run media
 *
 * post-01..04 are finished buildings and are rendered by Delivered.jsx, at
 * full size and in full colour. post-05..09 are the running offers and are
 * rendered by Feed.jsx, in the listings strip.
 *
 * Two deliberate choices here:
 *
 * 1. NO colour grading is baked in. The listings strip renders its posters in
 *    a light duotone so nine of them read as one set, and returns them to
 *    their real colours on hover/tap - so the grade has to stay in CSS.
 *    Baking it would make the reveal impossible without shipping every image
 *    twice, and the delivered photographs are never graded at all.
 *
 * 2. The green Temer badges are KEPT. They are authentic post furniture; on
 *    the delivered photographs they also carry the name, location and
 *    built-up area, which is why those cards are never cropped to a uniform
 *    box. Only genuine phone screenshot chrome is cropped - the overflow
 *    menu, close button and Google Lens button that got captured with three
 *    of the photos.
 */
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'

const MAX_WIDTH = 1000
const QUALITY = 78

// `trim` is [top, right, bottom, left] in source pixels.
const SOURCES = [
  { out: 'post-01', src: 'photo_1_2026-08-17_17-43-54.jpg', trim: [54, 0, 0, 0] },
  { out: 'post-02', src: 'photo_2_2026-08-17_17-43-54.jpg', trim: [0, 0, 88, 0] },
  { out: 'post-03', src: 'photo_3_2026-08-17_17-43-54.jpg', trim: [38, 0, 96, 0] },
  { out: 'post-04', src: 'photo_4_2026-08-17_17-43-54.jpg', trim: [0, 0, 0, 0] },
  { out: 'post-05', src: 'photo_5_2026-08-17_17-43-54.jpg', trim: [0, 0, 0, 0] },
  { out: 'post-06', src: 'photo_6_2026-08-17_17-43-55.jpg', trim: [0, 0, 0, 0] },
  { out: 'post-07', src: 'photo_7_2026-08-17_17-43-55.jpg', trim: [0, 0, 0, 0] },
  { out: 'post-08', src: 'photo_8_2026-08-17_17-43-55.jpg', trim: [0, 0, 0, 0] },
  { out: 'post-09', src: 'photo_9_2026-08-17_17-43-55.jpg', trim: [0, 0, 0, 0] },

  // Second batch, August 2026. Three more offer posters, and between them
  // they put two sites on the page that were not on it before - Bulgaria and
  // Aware - plus Gelan, which until now appeared only as the Kaliti mall.
  { out: 'post-10', src: 'photo_2026-08-20_18-31-37.jpg', trim: [0, 0, 0, 0] },
  { out: 'post-11', src: 'photo_2026-08-20_18-32-53.jpg', trim: [0, 0, 0, 0] },
  { out: 'post-12', src: 'IMG_20260820_184135_968.png', trim: [0, 0, 0, 0] },
]

await mkdir('public/posts', { recursive: true })

const manifest = []
let before = 0
let after = 0

for (const { out, src, trim } of SOURCES) {
  const path = `media-src/${src}`
  // Fresh instance per operation: a Sharp instance cannot be reused for
  // output once `.metadata()` has been awaited on it.
  const { width = 0, height = 0, size = 0 } = await sharp(path).metadata()
  before += size

  const [top, right, bottom, left] = trim
  let pipe = sharp(path)

  if (top || right || bottom || left) {
    pipe = pipe.extract({
      top,
      left,
      width: width - left - right,
      height: height - top - bottom,
    })
  }

  pipe = pipe.resize({ width: MAX_WIDTH, withoutEnlargement: true })

  const buffer = await pipe.webp({ quality: QUALITY, effort: 6 }).toBuffer()
  after += buffer.byteLength
  await writeFile(`public/posts/${out}.webp`, buffer)

  const meta = await sharp(buffer).metadata()
  manifest.push({ id: out, w: meta.width, h: meta.height })
  console.log(`  ${out}  ${meta.width}x${meta.height}  ${(buffer.byteLength / 1024).toFixed(0)} KB`)
}

await writeFile('public/posts/manifest.json', JSON.stringify(manifest, null, 2))
console.log(`\n  ${SOURCES.length} posts, ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB`)
