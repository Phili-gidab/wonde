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
strip, contact), then homes-and-shops, then **why choose Temer** - six
advantages as a card grid - then the **delivery gallery** of buildings already
finished and handed over, then the commercial inventory and the footer.

The argument sits above its evidence deliberately: Why is the claim, and the
gallery underneath it is what backs the claim up. Both replaced things that
said less in the same place - Why replaced a four-item assurances strip making
the same case in a thinner form, and the gallery replaced four cards that had
been mixed in with the offer posters in the listings carousel.

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
than a building on ground. `Ground.jsx` substitutes a shadow-only plane
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

## Logo

```bash
npm run media:logo    # media-src/temer_logo.jpg -> public/logo-*.webp, favicon.png, og.jpg
```

The client's logo arrives as a 640x640 JPEG: a white palm-and-towers mark over
"Temer PROPERTIES", on a green background that is **not flat** - it carries a
soft vignette from a lighter centre-right to a darker lower-left.

That vignette is why the file is not simply cropped and dropped into the page.
Placed against a CSS tile of the brand green, the seam between the JPEG's green
and the token's green is plainly visible. `scripts/media/logo.mjs` keys the
green out instead and ships the mark as **white on transparent**, so the tile
colour comes from `--brand-green` in the stylesheet. The logo is then on-palette
wherever it lands, and re-colouring the tile is a one-token change.

Two consequences worth knowing:

- **The mark must never sit on a white ground.** It is pure white and would
  vanish. `Logo.jsx` always renders it inside a green tile.
- **Two renditions, not one.** Below roughly 64px the wordmark inside the
  lockup turns to mush, so small placements (nav, footer, favicon) get
  `logo-mark.webp` - the palms and towers alone - and the name is carried by
  the text beside it. `logo-lockup.webp` is for the loader, where there is
  room to read it.

The key is a threshold on the **minimum channel**, not a hue test: the
background's blue channel sits at 22-59 and white's at 250+, so that gap
separates them cleanly, and thresholding softly across it gives antialiased
edges rather than a stair-stepped cutout. RGB is forced to pure white rather
than kept from the source - the JPEG's "white" drifts to 246-252 and carries
green fringing along every edge, which is exactly what you see once the
background behind it is gone.

`--brand-green` (`#85a931`) is sampled from the source background by the
script, which logs it. It is a yellow-green at 78 degrees and only 3:1 against
white, so it is a **tile colour and never a type colour**; `--green` and its
relatives are the same family burnt down until they can be read. See Palette.

### Two names

The logo wordmark reads **Temer PROPERTIES**. The site's `BRAND.name` is
**Temer Real Estate**, and the two appear together in the loader, where the
lockup is large enough for the difference to be legible. Nobody has said which
is correct, so nothing has been changed - if the company is Temer Properties,
`BRAND.name` in `src/content.js` and the `<title>` in `index.html` are the two
places to fix.

## Languages

English and Amharic, switchable from the header and persisted to
`localStorage` (an `am` browser locale gets Amharic first).

Every translatable string in `src/content.js` is an `{ en, am }` pair.
`src/i18n.jsx` exposes `t()` for the active language and `other()` for the
opposite one - `other()` is what renders the green accent line under each
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

**White and green, one hue.** The accent comes off the Temer mark. Four
tokens, and they are not interchangeable:

| token           | job                                                      |
| --------------- | -------------------------------------------------------- |
| `--green`       | text and hairlines on white, at 5.1:1                    |
| `--green-solid` | fills that carry white type - the call bar, the phone ring |
| `--green-deep`  | the second tier, so shops read as distinct from homes    |
| `--green-chip`  | the tint behind an icon, pale enough to sit under a glyph |

None of them is the bright yellow-green of the logo tile. At the size type is
set on this page that colour lands near 2:1 on white, which is a legal problem
before it is a taste one. The mark supplies the bright note; everything drawn
in CSS holds the darker end of the same hue.

`--green-deep` exists so the page never needs a second hue. The homes and
shops pillars used to be told apart by green versus blue, which on a white
page with a green brand read as two competing accents rather than one system.

The palette was amber before this, and the listings carousel had a duotone to
match: Temer's posters are green and gold, and on a near-black page with an
orange accent they fought everything around them. The page is white now and
the accent is that same green, so the posters are already in the palette. The
grade is gone and they run in full colour - it was solving a problem that no
longer exists.

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

### One shadow, and no ground

`Ground.jsx` is a `shadowMaterial` plane: it draws where the building blocks
the key light and is fully transparent everywhere else. It is not a lit
surface, and that is deliberate.

A lit plane that fades out through an alpha map worked on a dark page, because
the fade ran from near-black into black. On white it cannot. The cameras sit
two units off the ground, and at that height the last ten units of a receding
plane compress into roughly thirty pixels of screen - so any fade, however
gentle in world space, arrives as a hard grey horizon ruled across the page.
Fog used to cover it; pushing the fog out past the building, which it has to
be or it bleaches the facade, took the cover away.

The obvious next move is also wrong. A soft radial "contact pool" under the
tower - unlit, circular, fading to nothing - supplies the occlusion the cast
shadow cannot, because the cast shadow lands off to one side. But any disc
large enough to see reads as a **second shadow**, and it was spotted as one
immediately. One honest shadow beats two competing ones. If you add anything
under the building, check it at chapter 01 on a real GPU before believing it.

The shadow-camera frustum covers 84 units, far wider than the building, and it
is symmetric. That is not slack: the frustum bounds where shadows exist at
all, so an edge inside the frame clips the shadow along a straight line. The
old `32 x -8` bottom edge did exactly that, and was plainly visible once the
page went white. The map is 2048² rather than 4096² precisely because it is
re-rendered per frame, and `shadow-normalBias` is 0.07 rather than 0.02
because acne that was invisible against near-black is a field of grey speckle
against white.

Exposure sits **below** 1.0 (0.86). The building is faced in white brick,
white ribbed panel and pale plaster - its own base-colour maps average 230 of
255 - so on a white page it is white on white unless the render is graded
down. Raising exposure to "brighten" it clips the lit faces to paper and takes
the texture with them; the fix for a washed-out facade here is always less
light, not more. For the same reason the fog starts at 34: the cameras are 17
to 22 units out and the tower is 8 across, so anything nearer put haze on the
far half of the facade, which is indistinguishable from a washed-out render.

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

Commercial use is permitted **only with attribution**.

**The credit is no longer rendered on the site.** It sat in the footer until
the client asked for it to come out, on the basis that they attribute on
social media instead. That is their call, and this is what it trades off:
CC BY 4.0 s.3(a) requires the credit to accompany the Licensed Material -
"in any reasonable manner based on the medium", which for a website means
somewhere a visitor to that website can actually find it. A post on another
platform does not reach the person looking at this page, so as it stands the
site is using the model commercially without carrying its attribution.

Two ways back into compliance, both cheap, if it is ever wanted:

- a small `Credits` link in the footer opening the same text, or
- an `/attribution` page linked once from the footer.

The licence also permits satisfying the condition with a link to a resource
holding the information, so the link itself is enough - the full sentence
does not have to be on screen.

The text to use, wherever it ends up:

> 3D model ["modern residential complex apartment building"](https://sketchfab.com/zigurat_architecture)
> by zigurat architecture studio, licensed under
> [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
