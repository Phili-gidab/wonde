/**
 * Phase 1/3 - material conversion, graph cleanup, recentering.
 *   models-src/tower-1k.glb -> models-src/_geo.glb
 *
 * The Sketchfab source declares KHR_materials_pbrSpecularGlossiness as
 * *required*, and three.js removed support for that extension - left alone the
 * model loads untextured. It also sits far off-origin (bbox x 30..73,
 * z -56..-6), so anything aimed at 0,0,0 misses the building entirely.
 */
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import {
  metalRough,
  dedup,
  flatten,
  join,
  weld,
  prune,
  center,
} from '@gltf-transform/functions'

const SRC = 'models-src/tower-1k.glb'
const OUT = 'models-src/_geo.glb'

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
const document = await io.read(SRC)

// spec/gloss -> metallic/roughness. Must run before anything else.
await document.transform(metalRough())

// Collapse ~1100 single-box meshes into one draw call per material. `join`
// groups by material, so material names survive for the enrichment pass in
// src/three/materials.js.
await document.transform(dedup(), flatten(), join(), weld(), prune())

// Stand the building on the origin so the camera rig has a known target.
await document.transform(center({ pivot: 'below' }))

await io.write(OUT, document)

const root = document.getRoot()
console.log(
  `  geo: ${root.listMeshes().length} meshes, ` +
    `${root.listMaterials().length} materials, ` +
    `${root.listTextures().length} textures`,
)
