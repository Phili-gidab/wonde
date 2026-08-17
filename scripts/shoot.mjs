/**
 * Render check. Loads the built site in headless Chromium, waits for the model
 * to finish loading, then screenshots the page at each chapter's scroll
 * position and reports any console errors or failed requests.
 *
 * Usage:
 *   npm run preview          # in one terminal
 *   node scripts/shoot.mjs   # in another
 *
 * WebGL in headless needs a software rasteriser, hence the SwiftShader flags.
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const URL = process.env.URL ?? 'http://localhost:4173/'
const OUT = 'shots'
const SHOTS = 6
const VIEWPORTS = [
  { name: 'desktop', width: 1600, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

await mkdir(OUT, { recursive: true })

const browser = await chromium.launch({
  args: [
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist',
  ],
})

let failed = false

for (const viewport of VIEWPORTS) {
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
  })

  const errors = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
  page.on('requestfailed', (request) =>
    errors.push(`requestfailed: ${request.url()} ${request.failure()?.errorText}`),
  )

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 90_000 })

  // Wait for the load curtain to clear, which only happens once the GLB is in.
  await page
    .waitForSelector('.loader.is-hidden', { timeout: 90_000 })
    .catch(() => errors.push('loader never hid - model likely failed to load'))

  // Confirm a WebGL context actually exists and is drawing.
  const canvasInfo = await page.evaluate(() => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return { ok: false, reason: 'no canvas element' }
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    return {
      ok: Boolean(gl),
      reason: gl ? 'ok' : 'no webgl context',
      width: canvas.width,
      height: canvas.height,
      renderer: gl?.getParameter(gl.RENDERER) ?? null,
    }
  })

  console.log(`\n[${viewport.name}] canvas:`, JSON.stringify(canvasInfo))

  const height = await page.evaluate(() => document.documentElement.scrollHeight)

  for (let i = 0; i < SHOTS; i++) {
    const y = Math.round((height - viewport.height) * (i / (SHOTS - 1)))
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
    // let the camera damping settle and reveals finish
    await page.waitForTimeout(1400)
    // `animations: 'disabled'` is required: the page has infinite CSS
    // animations (the scroll hint sweep, the call-dot ping) and the default
    // capture waits for them to settle, which never happens.
    await page.screenshot({
      path: `${OUT}/${viewport.name}-${i}.png`,
      animations: 'disabled',
      caret: 'hide',
      timeout: 60_000,
    })
  }

  if (errors.length) {
    failed = true
    console.log(`[${viewport.name}] ${errors.length} problem(s):`)
    for (const error of [...new Set(errors)].slice(0, 12)) console.log('   -', error)
  } else {
    console.log(`[${viewport.name}] no console errors`)
  }

  await page.close()
}

await browser.close()
console.log(`\nscreenshots -> ${OUT}/`)
process.exit(failed ? 1 : 0)
