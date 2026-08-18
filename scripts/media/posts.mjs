/**
 * Prepares Wonde's social posts for the feed in chapter 3.
 *   public/photo_*.jpg  ->  public/posts/post-NN.webp
 *
 * Run with: npm run media
 *
 * Two deliberate choices here:
 *
 * 1. NO colour grading is baked in. The feed renders these in an amber duotone
 *    to sit inside the site's palette, but reveals their true colours on
 *    hover/tap - so the grade has to stay in CSS. Baking it would make the
 *    reveal impossible without shipping every image twice.
 *
 * 2. The green Temer badges are KEPT. They are authentic post furniture, and
 *    they are the most satisfying part of the hover reveal. Only genuine phone
 *    screenshot chrome is cropped - the overflow menu, close button and Google
 *    Lens button that got captured with three of the photos.
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
