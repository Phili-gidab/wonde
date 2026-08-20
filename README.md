# Wonde - Temer Real Estate

A 3D-first single page for Temer Real Estate, built around Wonde (ወንደሰን), the
sales consultant it drives enquiries to.

Built with **React + Vite + three.js** (via react-three-fiber).

Structurally inspired by [MengTo/kage](https://github.com/MengTo/kage): one
fixed, full-viewport WebGL canvas with a single continuous camera path bound to
scroll, so each section reads as a new composed shot of the same building
rather than a scene swap. Copy is English-primary with Amharic as a display
accent.

Page order: four scroll-bound chapters (arrival, the offer, the listings
strip, contact), then homes-and-shops, then **delivered** - the buildings that
are already finished and handed over - then the assurances strip, the
commercial inventory and the footer.

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

### The site plate, and why two passes remove it

The model is exported standing on its site: a thick ceramic slab with paving
laid over it, ending in a hard straight edge. Lit from the side it reads as a
diorama on a plinth - the building looks like a scale model on a table rather
than a building on ground. `Ground.jsx` substitutes a plane that fades out
instead, and `Tower.jsx` removes the original in two passes:

- `hideBasePlates()` hides whole meshes that are thin, low and cover most of
  the footprint. That catches the slab.
- `cullGroundPaving()` drops individual triangles in the bottom 2% of the
  model that either face up or are sliver-thin. That catches the paving.

The second pass exists because `join` in the `geo` phase groups meshes by
material, and the paving shares materials with elements ten storeys up - so by
the time three.js sees it, the paving is a few hundred triangles inside a mesh
8.5 units tall, and no mesh-level test can find it. Both passes are reversible
and undo themselves on unmount; the cull clones geometry before editing it,
because `useGLTF` caches the loaded scene and `scene.clone(true)` shares
geometry with the cache.

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

## Languages

English and Amharic, switchable from the header and persisted to
`localStorage` (an `am` browser locale gets Amharic first).

Every translatable string in `src/content.js` is an `{ en, am }` pair.
`src/i18n.jsx` exposes `t()` for the active language and `other()` for the
opposite one - `other()` is what renders the amber accent line under each
heading, so whichever language you read, the other sits beneath it. Adding
copy means adding both halves of the pair; there is no fallback chain to hide
a missing translation behind.

Amharic is not just a string swap. `:root[data-lang='am']` switches the
display face to Noto Serif Ethiopic (Archivo has no Ge'ez glyphs and would
fall back to whatever the OS offers), drops the tight negative tracking, opens
up the line height, and reduces the heading size, because Ethiopic syllabics
are wider and taller than Latin caps. The accent line inverts to the Latin
grotesk at the same time.

## Palette

The page is white, and that is a constraint on the render as much as on the
CSS. Two things to know before changing either half.

**Two ambers, not interchangeable.** The brand orange (`#f2a93b`) sets at
1.9:1 on white, so it survives only as a *fill* - `--amber-solid`, always with
`--on-amber` on top of it (the call bar, the phone plate's ring). Anything
read as text or drawn as a hairline uses `--amber` (`#a8640a`), the same hue
burnt down to 4.7:1. `--amber-soft` is deeper again and belongs to the
other-language accent line, so it reads as a warm ink rather than as a second
highlight.

**The render is lit for the page, not the other way round.** It was a dusk
shot - hot amber key, near-black ground, the building emerging out of the
dark. On white that inverts: a dark render reads as a hole cut in the page.
`Scene.jsx` is late-morning now, and three of its changes are load-bearing:

- The fog colour *is* the page colour, which is what dissolves the ground into
  the document. There is no horizon and no visible edge to the render.
- Contrast comes from shading, not from the background. The key stays firmly
  on one side so the building keeps a visibly darker face; lifting the ambient
  far enough to fill that in washes the tower out into the white behind it.
- The vignette is gone and bloom is pulled right back. A vignette on a white
  page draws four grey smudges around an otherwise clean document, and at the
  old bloom threshold nearly every surface was over the line once the scene
  was brightened.

`Ground.jsx` is a few percent off page white rather than white itself. Match
it exactly and the tower stands on nothing, with its contact shadow floating
unattached.

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

### Performance

The building turns slowly on its own axis. Because the geometry moves, the
directional light's shadow map cannot be baked and re-renders every frame.
That is the largest cost in the frame and it is a deliberate trade for the
motion.

If you ever need the cheap version back, it is a one-line change: `spin={0}`
on `<Tower>` makes the scene fully static, which then allows
`gl.shadowMap.autoUpdate = false`. `prefers-reduced-motion` already takes this
path.

There is no `<ContactShadows>` pass any more. It was a second per-frame render
and, on a white page, its plane was visible: a 34-unit square of very faint
grey with four hard edges, sitting on ground that otherwise fades out with no
edge at all. The directional light's own shadow does the grounding now.

The shadow-camera frustum covers 84 units, far wider than the building. This
is not slack: a frustum smaller than the *visible ground* ends in a hard
straight line where shadowing simply stops, and that line reads as a
rectangular plinth under the tower. It is symmetric now - the old
`32 x -8` bottom edge sat well inside the ground and was plainly visible once
the page went white. The map is 2048² rather than 4096² precisely because it
is re-rendered per frame, and `shadow-normalBias` is 0.07 rather than 0.02
because acne that was invisible against near-black is a field of grey speckle
against white.

Do not add an `<SMAA/>` pass to the composer. It floods the console with
`glBlitFramebuffer: Read and write depth stencil attachments cannot be the
same image` on every frame - bisected to SMAA specifically (composer on with
SMAA off is clean; every other effect off still errors). Antialiasing is the
composer's own MSAA instead.

## Camera framing

```bash
npm run preview            # in one terminal
node scripts/framing.mjs   # in another
```

Projects the tower's bounding box through every chapter keyframe at both
viewports and reports where it lands in normalised device coordinates, so
framing can be tuned numerically instead of by eye. Screenshots under software
rendering cost ~40s each, which is far too slow to tune five keyframes.

Read `top 1.34` as "the roof is 34% of a half-viewport above the top edge".

**Cropping is not automatically a fault.** The keyframes deliberately sit
close enough that the tower fills the frame and runs past the edges - that is
what makes the shots feel cinematic rather than like a product photographed on
a table. An earlier pass "fixed" every reported crop by pulling the camera
back 22-73%, and the result looked markedly worse: a small object centred in a
lot of empty page.

Use the tool to catch framing that is *accidentally* wrong - a shot that has
drifted so far the subject is unreadable, or the portrait overflow of 2x that
the desktop keyframes produce on a phone if `cameraMobile` is missing. Do not
use it to chase every value inside ±1.

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
