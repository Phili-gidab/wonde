/**
 * Page check. Loads the built site in headless Chromium at desktop and phone
 * widths, saves a full-page screenshot of each, and fails on console errors,
 * failed requests or any horizontal overflow.
 *
 * Usage:
 *   npm run build && npm run preview   # in one terminal
 *   node scripts/shoot.mjs             # in another
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const URL = process.env.URL ?? 'http://localhost:4173/'
const OUT = 'shots'
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'phone', width: 390, height: 844, isMobile: true, hasTouch: true },
]

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch()
let failed = false

for (const { name, ...viewport } of VIEWPORTS) {
  const page = await browser.newPage({ viewport, isMobile: viewport.isMobile, hasTouch: viewport.hasTouch })
  const problems = []
  page.on('console', (msg) => msg.type() === 'error' && problems.push(`console: ${msg.text()}`))
  // Ad beacons are routinely refused in headless; they are not our requests.
  page.on('requestfailed', (req) => {
    if (!/google|doubleclick/.test(req.url())) problems.push(`request: ${req.url()}`)
  })

  await page.goto(URL, { waitUntil: 'networkidle' })
  // Walk the page so lazy images load before the full-page capture.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 60))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForLoadState('networkidle')

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  if (overflow > 0) problems.push(`horizontal overflow: ${overflow}px`)

  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true })
  console.log(`${name}: ${problems.length ? problems.join('; ') : 'ok'}`)
  if (problems.length) failed = true
  await page.close()
}

await browser.close()
process.exit(failed ? 1 : 0)
