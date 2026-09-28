# Wonde - Temer Real Estate

A single-page site for Temer Real Estate, built around Wonde (ወንደሰን), the
sales consultant it drives enquiries to. Built with **React + Vite**.

It started as a 3D scroll experience around a tower model; the client asked
for a regular website instead, so the WebGL scene, the model and the
horizontal listings strip are gone. Styling follows
[temerpropertiessales.com](https://temerpropertiessales.com/): white page, one
green, Playfair Display headings over Plus Jakarta Sans, 12px radii and a
dark-graded photo hero.

Page order:

1. **Hero** - photo of a delivered building, headline, and the contact buttons.
2. **Listings** - the running offer posters, one under another, each with its
   sales copy beside it.
3. **The offer** - 4.6 million birr all in, 40% / 60% / 35%. It sits directly
   under the posters on purpose.
4. Homes and shops, **Why choose Temer**, the **delivery gallery**, the
   commercial inventory, and a contact band.

Phone, WhatsApp and Telegram always appear together (`ContactLinks.jsx`): in
the header, the hero, under the offer, the shops section, the contact band,
the footer, and a fixed bar at the bottom on phones. The numbers and handles
live in `src/contact.js`.

## Development

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
npm run preview   # serve the built output
```

Copy lives in `src/content.js`; the poster and delivered-building data in
`src/posts.js`. Styles are split by section under `src/styles/`.

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
  the text beside it. `logo-lockup.webp` is kept for larger placements where
  there is room to read it.

The key is a threshold on the **minimum channel**, not a hue test: the
background's blue channel sits at 22-59 and white's at 250+, so that gap
separates them cleanly, and thresholding softly across it gives antialiased
edges rather than a stair-stepped cutout. RGB is forced to pure white rather
than kept from the source - the JPEG's "white" drifts to 246-252 and carries
green fringing along every edge, which is exactly what you see once the
background behind it is gone.

`--brand-green` (`#85a931`) is sampled from the source background by the
script, which logs it. It is a yellow-green at 78 degrees and only 3:1 against
white, so it is a **tile colour and never a type colour**; `--primary` and its
relatives are the same family burnt down until they can be read. See Palette.

### Two names

The logo wordmark reads **Temer PROPERTIES**. The site's `BRAND.name` is
**Temer Real Estate**. The lockup file is generated but not currently placed
on the page. Nobody has said which
is correct, so nothing has been changed - if the company is Temer Properties,
`BRAND.name` in `src/content.js` and the `<title>` in `index.html` are the two
places to fix.

## Languages

English and Amharic, switchable from the header and persisted to
`localStorage` (an `am` browser locale gets Amharic first).

Every translatable string in `src/content.js` is an `{ en, am }` pair.
`src/i18n.jsx` exposes `t()` for the active language and `other()` for the
opposite one - `other()` renders the green accent line under each heading, so
whichever language you read, the other sits beneath it. Adding copy means
adding both halves of the pair.

Neither Playfair Display nor Plus Jakarta Sans has Ge'ez glyphs, so both font
stacks fall through to Noto Serif Ethiopic / Noto Sans Ethiopic for Amharic.

## Palette

Tokens are in `src/styles/base.css`, taken from temerpropertiessales.com:

| token            | value     | job                                   |
| ---------------- | --------- | ------------------------------------- |
| `--primary`      | `#3a7d44` | buttons, accents, the Amharic line    |
| `--primary-deep` | `#1f4a27` | contact band                          |
| `--accent-bg`    | `#e8f5e9` | pills and icon chips                  |
| `--brand-green`  | `#85a931` | the logo tile only - never type       |
| `--whatsapp`     | `#1fa855` | WhatsApp in the phone call bar        |
| `--telegram`     | `#0088cc` | Telegram in the phone call bar        |

The hero photo is `public/hero.webp`: the Mohammed.S building (post-04),
cropped above the badge burned into the original post.

## Page check

```bash
npm run build && npm run preview   # in one terminal
node scripts/shoot.mjs             # in another
```

Loads the built site in headless Chromium at desktop and phone widths, saves
full-page screenshots into `shots/`, and fails on console errors, failed
requests or any horizontal overflow. Needs `npx playwright install chromium`
once.

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
