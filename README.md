# Wonde - Temer Real Estate

A 3D-first single page for Temer Real Estate, built around Wonde (ወንደሰን), the
sales consultant it drives enquiries to.

Built with **React + Vite + three.js** (via react-three-fiber).

Structurally inspired by [MengTo/kage](https://github.com/MengTo/kage): one
fixed, full-viewport WebGL canvas with a single continuous camera path bound to
scroll, so each section reads as a new composed shot of the same building
rather than a scene swap. Copy is English-primary with Amharic as a display
accent.

## Development

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
npm run preview   # serve the built output
```

## 3D model pipeline

The building is a Sketchfab model that needs real work before three.js can use
it. `models-src/` is gitignored; the built artefact `public/models/tower.glb`
**is** committed because it ships to production.

```bash
npm run model     # models-src/tower-1k.glb -> public/models/tower.glb
```

Result: **9.17 MB -> 1.20 MB**, ~1100 meshes -> 13 draw calls.

To re-run it from scratch, download the 1k-texture `.glb` from the model page
(link in the attribution below) to `models-src/tower-1k.glb`.

### Why three phases and not one script

`scripts/model/` is split into `geo` -> `tex` -> `pack`, each its own process,
for two non-obvious reasons found the hard way:

1. **`@gltf-transform/functions` cannot share a process with sharp encoding.**
   Merely *importing* it makes every sharp encode in that process fail with
   `colourspace: parameter space not set` - it pulls in `ndarray-pixels`, which
   reconfigures libvips at module init. Measured: 8/8 textures encode without
   that import, 0/8 with it. Since imports are module-level, the phases have to
   be separate *files*, not one file with a `--phase` flag.
2. **A Sharp instance cannot be reused for output after `.metadata()` has been
   awaited on it.** Build a fresh instance for the encode.

What each phase does:

| Phase  | Does                                                              |
| ------ | ----------------------------------------------------------------- |
| `geo`  | spec/gloss -> metallic/roughness, dedup/flatten/join/weld/prune, recentre |
| `tex`  | re-encode all textures to WebP (3394 KB -> 513 KB)                |
| `pack` | meshopt geometry compression, final write                         |

The spec/gloss conversion is not optional. The source declares
`KHR_materials_pbrSpecularGlossiness` as **required**, and three.js removed
support for that extension - without conversion the model loads untextured.

The source also sits far off-origin (bbox x 30..73, z -56..-6), so `geo`
recentres it onto x/z = 0 with its base on y = 0.

## Richer materials without heavier downloads

The source ships base-colour maps only - no roughness, no normals - so every
surface reads flat. Rather than download heavier texture sets,
`src/three/materials.js` generates tiling fBm noise at runtime and derives a
normal map from it by Sobel, then re-describes each material as proper PBR
(glass, metal, concrete, fine). Costs a few milliseconds and zero bytes over
the wire.

Two things to know if you tune it:

- Detail maps **multiply** the material's `roughness` scalar in three.js, so
  the generated maps are biased into `[1 - amount, 1]`. A map averaging 0.5
  would silently halve every recipe and leave the building looking wet.
- Recipes are keyed by **material name**. `join` in `geo` groups by material,
  so those names survive the pipeline. If you swap the model, run `npm run
  model`, read the material list it prints, and update `RECIPES`.

Reflections come from a procedural `<Environment>` built out of `Lightformer`
rectangles - no HDRI download, and the vertical strips are what give the
glazing something structured to reflect.

## Rendering notes

- Camera keyframes live with the copy, in `src/content.js`, in normalised units
  where the tower is 10 high and stands on y = 0. `Tower.jsx` rescales whatever
  model it is given to match, so the keyframes survive a model swap.
- Scroll progress is a **ref**, not state - the render loop reads it every
  frame, and putting it in state would re-render the tree on every scroll
  event. Only the active chapter index is state.
- `detectQuality()` in `App.jsx` drops shadows and post-processing on coarse
  pointers, narrow screens, and low core counts. Most of this audience is on
  mobile.
- `prefers-reduced-motion` disables the camera animation, the model spin, and
  all text reveals.
- Materials keep the source's `DoubleSide`. Culling back faces would halve
  fragment work, but architectural exports routinely model railings and glazing
  as single-sided planes that then vanish. Opt in per-recipe with `cull: true`.

## Render check

```bash
npm run preview          # in one terminal
node scripts/shoot.mjs   # in another
```

Loads the built site in headless Chromium, waits for the model, screenshots
each chapter at desktop and mobile into `shots/`, and reports console errors or
failed requests. Needs `npx playwright install chromium` once.

## Deploy to Vercel

**From GitHub (recommended):**

1. Import the repo at [vercel.com/new](https://vercel.com/new).
2. Vercel auto-detects the Vite preset (build: `npm run build`, output: `dist`).
3. Every push to `main` auto-deploys.

**Vercel CLI:**

```bash
npm i -g vercel
vercel --prod
```

## Attribution

The 3D model is
["modern residential complex apartment building"](https://sketchfab.com/zigurat_architecture)
by **zigurat architecture studio**, licensed under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

Commercial use is permitted **only with attribution**. The credit is rendered
in the site footer (`src/components/Footer.jsx`, sourced from `MODEL_CREDIT` in
`src/content.js`) and is a licence condition - do not remove it.
