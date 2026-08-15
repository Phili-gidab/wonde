# Wonde — Temer Real Estate (Coming Soon)

"Under construction / coming soon" landing page for Temer Real Estate sales (agent: Wendesen).
Static site — a single `index.html`, no build step required.

## Deploy to Vercel

**Option A — from GitHub (recommended):**
1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Framework preset: **Other** (static). No build command, output directory: root.
4. Deploy — every push to `main` auto-deploys.

**Option B — Vercel CLI:**
```bash
npm i -g vercel
vercel --prod
```

## Local preview

Just open `index.html` in a browser, or:
```bash
npx serve .
```
