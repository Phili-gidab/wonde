/**
 * Counts WebGL / console errors on a single page load. Used to bisect which
 * scene component triggers a GL error.
 *
 *   node scripts/glcheck.mjs "?fx=off"
 */
import { chromium } from 'playwright'

const query = process.argv[2] ?? ''
const url = `http://localhost:4173/${query}`

const browser = await chromium.launch({
  args: [
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist',
  ],
})

const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

const counts = new Map()
const bump = (text) => {
  // collapse the repeated GL spam into one bucket
  const key = text.replace(/\[\.WebGL-0x[0-9a-f]+\]\s*/i, '[WebGL] ').slice(0, 120)
  counts.set(key, (counts.get(key) ?? 0) + 1)
}

page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') bump(m.text())
})
page.on('pageerror', (e) => bump(`pageerror: ${e.message}`))
page.on('requestfailed', (r) => bump(`requestfailed: ${r.url()}`))

await page.goto(url, { waitUntil: 'networkidle', timeout: 90_000 })
await page.waitForSelector('.loader.is-hidden', { timeout: 90_000 }).catch(() => {})
// let several frames render so per-frame GL errors accumulate
await page.waitForTimeout(4000)
await page.evaluate(() => window.scrollTo({ top: 1500, behavior: 'instant' }))
await page.waitForTimeout(3000)

console.log(`\n=== ${url || '/'} ===`)
if (!counts.size) console.log('  clean - no errors or warnings')
for (const [text, n] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}x  ${text}`)
}

await browser.close()
