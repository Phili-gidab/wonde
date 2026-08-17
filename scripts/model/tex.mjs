/**
 * Phase 2/3 - re-encode every texture as WebP.
 *   models-src/_geo.glb -> models-src/_tex.glb
 *
 * IMPORTANT: this file must import ONLY @gltf-transform/core and sharp.
 *
 * Importing @gltf-transform/functions here - even without calling anything
 * from it - makes every sharp encode in this process fail with
 * "colourspace: parameter space not set". It pulls in ndarray-pixels, which
 * reconfigures libvips at module init. Verified: 8/8 textures encode without
 * that import, 0/8 with it. That is why the pipeline is split across three
 * files instead of one file with a phase argument.
 */
import { NodeIO } from '@gltf-transform/core'
import sharp from 'sharp'

const SRC = 'models-src/_geo.glb'
const OUT = 'models-src/_tex.glb'

const MAX_TEXTURE = 1024
const WEBP_QUALITY = 80

const kb = (n) => `${(n / 1024).toFixed(0)} KB`

const io = new NodeIO()
const document = await io.read(SRC)
const textures = document.getRoot().listTextures()

let before = 0
let after = 0

for (const texture of textures) {
  const image = texture.getImage()
  if (!image) continue
  before += image.byteLength

  // A Sharp instance cannot be reused for output after `.metadata()` has been
  // awaited on it, so build a fresh instance for the encode.
  const { width = 0, height = 0 } = await sharp(Buffer.from(image)).metadata()

  let work = sharp(Buffer.from(image))
  if (width > MAX_TEXTURE || height > MAX_TEXTURE) {
    work = work.resize(MAX_TEXTURE, MAX_TEXTURE, { fit: 'inside' })
  }

  const encoded = await work.webp({ quality: WEBP_QUALITY, effort: 6 }).toBuffer()
  after += encoded.byteLength
  texture.setImage(new Uint8Array(encoded)).setMimeType('image/webp')
}

await io.write(OUT, document)
console.log(`  tex: ${textures.length} textures, ${kb(before)} -> ${kb(after)}`)
