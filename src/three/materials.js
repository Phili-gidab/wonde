import * as THREE from 'three'

/**
 * Material enrichment.
 *
 * The Sketchfab source ships diffuse (base colour) maps only - no roughness,
 * no normals - so every surface reads flat and plasticky under real lighting.
 * Rather than download heavier texture sets, we generate detail maps
 * procedurally at runtime and re-describe each material as proper PBR.
 * Costs a few milliseconds and zero bytes over the wire.
 *
 * Material names come from the source file and survive the build pipeline
 * because `join` in scripts/model/geo.mjs groups by material. If the source
 * model is ever swapped, re-run `npm run model` and read the material list it
 * prints, then update RECIPES below.
 */

/** Deterministic value noise so builds look identical run to run. */
function mulberry32(seed) {
  return function random() {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Tiling fractal noise, returned as a raw grayscale float array. */
function fbm(size, octaves, seed) {
  const random = mulberry32(seed)
  const out = new Float32Array(size * size)

  let amplitude = 1
  let total = 0

  for (let octave = 0; octave < octaves; octave++) {
    const cells = 2 << octave
    const step = size / cells

    // Random lattice, wrapped so the result tiles seamlessly.
    const lattice = new Float32Array((cells + 1) * (cells + 1))
    for (let y = 0; y < cells; y++) {
      for (let x = 0; x < cells; x++) lattice[y * (cells + 1) + x] = random()
    }
    for (let i = 0; i < cells; i++) {
      lattice[i * (cells + 1) + cells] = lattice[i * (cells + 1)]
      lattice[cells * (cells + 1) + i] = lattice[i]
    }
    lattice[cells * (cells + 1) + cells] = lattice[0]

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const fx = x / step
        const fy = y / step
        const x0 = Math.floor(fx)
        const y0 = Math.floor(fy)
        const tx = fx - x0
        const ty = fy - y0
        // smoothstep for C1 continuity between lattice cells
        const sx = tx * tx * (3 - 2 * tx)
        const sy = ty * ty * (3 - 2 * ty)

        const a = lattice[y0 * (cells + 1) + x0]
        const b = lattice[y0 * (cells + 1) + x0 + 1]
        const c = lattice[(y0 + 1) * (cells + 1) + x0]
        const d = lattice[(y0 + 1) * (cells + 1) + x0 + 1]

        const top = a + (b - a) * sx
        const bottom = c + (d - c) * sx
        out[y * size + x] += (top + (bottom - top) * sy) * amplitude
      }
    }

    total += amplitude
    amplitude *= 0.5
  }

  for (let i = 0; i < out.length; i++) out[i] /= total
  return out
}

/**
 * Grayscale noise -> DataTexture, used as a roughness detail map.
 *
 * three.js MULTIPLIES roughnessMap by the material's `roughness` scalar, so a
 * map averaging 0.5 would silently halve every recipe and leave the whole
 * building looking wet. Values are mapped into [1 - amount, 1] instead, so the
 * map modulates around the scalar rather than fighting it.
 */
function roughnessTexture(size, octaves, seed, amount) {
  const noise = fbm(size, octaves, seed)
  const data = new Uint8Array(size * size * 4)

  for (let i = 0; i < noise.length; i++) {
    const v = 1 - amount * (1 - noise[i])
    const b = Math.max(0, Math.min(255, Math.round(v * 255)))
    data[i * 4] = b
    data[i * 4 + 1] = b
    data[i * 4 + 2] = b
    data[i * 4 + 3] = 255
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.needsUpdate = true
  return texture
}

/** Sobel the same noise field into a tangent-space normal map. */
function normalTexture(size, octaves, seed, strength) {
  const noise = fbm(size, octaves, seed)
  const data = new Uint8Array(size * size * 4)
  const at = (x, y) => noise[((y + size) % size) * size + ((x + size) % size)]

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx =
        at(x - 1, y - 1) + 2 * at(x - 1, y) + at(x - 1, y + 1) -
        (at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1))
      const dy =
        at(x - 1, y - 1) + 2 * at(x, y - 1) + at(x + 1, y - 1) -
        (at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1))

      const nx = dx * strength
      const ny = dy * strength
      const nz = 1
      const len = Math.hypot(nx, ny, nz)

      const i = (y * size + x) * 4
      data[i] = Math.round(((nx / len) * 0.5 + 0.5) * 255)
      data[i + 1] = Math.round(((ny / len) * 0.5 + 0.5) * 255)
      data[i + 2] = Math.round(((nz / len) * 0.5 + 0.5) * 255)
      data[i + 3] = 255
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.needsUpdate = true
  return texture
}

/** Built once, shared across every material that wants them. */
let detailMaps = null
function getDetailMaps() {
  if (!detailMaps) {
    detailMaps = {
      // coarse: concrete and render
      concreteRough: roughnessTexture(256, 5, 1337, 0.3),
      concreteNormal: normalTexture(256, 5, 1337, 1.6),
      // fine: painted and ceramic surfaces
      fineRough: roughnessTexture(256, 6, 90210, 0.16),
      fineNormal: normalTexture(256, 6, 90210, 0.7),
      // grain for brushed metal
      metalRough: roughnessTexture(256, 4, 4242, 0.28),
    }
  }
  return detailMaps
}

/**
 * Per-material PBR recipes, keyed by the source material name.
 *
 * `kind` picks the detail-map set. Anything not listed here falls through to
 * DEFAULT_RECIPE, so an unrecognised model still renders sensibly.
 */
const RECIPES = {
  // --- glazing -------------------------------------------------------------
  // 03 and 04 are the two BLEND materials in the source (321 and 96 instances)
  // - the window and balcony glass.
  '03_-_Default': {
    kind: 'glass',
    color: '#9fc2d8',
    metalness: 0.98,
    roughness: 0.06,
    envMapIntensity: 2.6,
    opacity: 0.62,
    transparent: true,
  },
  '04_-_Default': {
    kind: 'glass',
    color: '#b4cfe0',
    metalness: 0.94,
    roughness: 0.1,
    envMapIntensity: 2.2,
    opacity: 0.55,
    transparent: true,
  },

  // --- metals --------------------------------------------------------------
  Metal: {
    kind: 'metal',
    metalness: 1,
    roughness: 0.34,
    envMapIntensity: 1.5,
  },
  '13_-_Brushed_Metal_2': {
    kind: 'metal',
    metalness: 1,
    roughness: 0.42,
    envMapIntensity: 1.3,
  },
  '14_-_Polished_Aluminum': {
    kind: 'metal',
    metalness: 1,
    roughness: 0.16,
    envMapIntensity: 1.9,
  },
  '12_-_Car_Paint': {
    kind: 'fine',
    metalness: 0.7,
    roughness: 0.22,
    envMapIntensity: 1.6,
  },

  // --- architectural surfaces ---------------------------------------------
  Wall_Paint: {
    kind: 'fine',
    metalness: 0,
    roughness: 0.82,
    envMapIntensity: 0.85,
    normalScale: 0.35,
  },
  Ceramic: {
    kind: 'fine',
    metalness: 0.04,
    roughness: 0.36,
    envMapIntensity: 1.1,
    normalScale: 0.25,
  },
  '01_-_Default': {
    kind: 'concrete',
    metalness: 0,
    roughness: 0.88,
    envMapIntensity: 0.8,
    normalScale: 0.6,
  },
  '02_-_Default': {
    kind: 'concrete',
    metalness: 0,
    roughness: 0.9,
    envMapIntensity: 0.75,
    normalScale: 0.55,
  },
  '05_-_Default': {
    kind: 'concrete',
    metalness: 0.05,
    roughness: 0.78,
    envMapIntensity: 0.9,
    normalScale: 0.5,
  },
  '06_-_Default': {
    kind: 'concrete',
    metalness: 0.05,
    roughness: 0.74,
    envMapIntensity: 0.95,
    normalScale: 0.5,
  },
  '11_-_Default': {
    kind: 'fine',
    metalness: 0.1,
    roughness: 0.6,
    envMapIntensity: 1,
    normalScale: 0.4,
  },
}

const DEFAULT_RECIPE = {
  kind: 'concrete',
  metalness: 0.05,
  roughness: 0.82,
  envMapIntensity: 0.9,
  normalScale: 0.45,
}

const DETAIL_REPEAT = 5

function applyDetail(material, recipe, maps) {
  const normalScale = recipe.normalScale ?? 0.4

  if (recipe.kind === 'glass') return // glass stays optically smooth

  if (recipe.kind === 'metal') {
    material.roughnessMap = maps.metalRough
  } else if (recipe.kind === 'concrete') {
    material.roughnessMap = maps.concreteRough
    material.normalMap = maps.concreteNormal
  } else {
    material.roughnessMap = maps.fineRough
    material.normalMap = maps.fineNormal
  }

  for (const map of [material.roughnessMap, material.normalMap]) {
    if (!map) continue
    map.repeat.set(DETAIL_REPEAT, DETAIL_REPEAT)
  }

  if (material.normalMap) {
    material.normalScale = new THREE.Vector2(normalScale, normalScale)
  }
}

/**
 * Walk a loaded GLTF scene and upgrade every material in place.
 * Returns a dispose function for the generated textures.
 */
export function enrichMaterials(scene, { anisotropy = 4 } = {}) {
  const maps = getDetailMaps()
  const seen = new Set()

  scene.traverse((object) => {
    if (!object.isMesh) return

    object.castShadow = true
    object.receiveShadow = true

    const materials = Array.isArray(object.material) ? object.material : [object.material]

    for (const material of materials) {
      if (!material || seen.has(material.uuid)) continue
      seen.add(material.uuid)

      const recipe = RECIPES[material.name] ?? DEFAULT_RECIPE

      if (recipe.color) material.color = new THREE.Color(recipe.color)
      material.metalness = recipe.metalness
      material.roughness = recipe.roughness
      material.envMapIntensity = recipe.envMapIntensity

      if (recipe.transparent) {
        material.transparent = true
        material.opacity = recipe.opacity
        material.depthWrite = false
      }

      // The source marks every material doubleSided. Culling back faces would
      // halve fragment work, but architectural exports routinely model
      // railings, louvres and glazing as single-sided planes, which then
      // vanish from one side. Only cull where a recipe explicitly opts in.
      material.side = recipe.cull ? THREE.FrontSide : THREE.DoubleSide

      if (material.map) {
        material.map.anisotropy = anisotropy
        material.map.needsUpdate = true
      }

      applyDetail(material, recipe, maps)
      material.needsUpdate = true
    }
  })

  return function dispose() {
    if (!detailMaps) return
    for (const texture of Object.values(detailMaps)) texture.dispose()
    detailMaps = null
  }
}
