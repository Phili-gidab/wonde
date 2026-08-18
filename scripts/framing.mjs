/**
 * Camera framing check.
 *
 * Screenshotting under software rendering costs ~40s a frame, which is far too
 * slow to tune five keyframes by eye. This instead projects the tower's
 * bounding box through each chapter's camera and reports where it lands in
 * normalised device coordinates, per viewport.
 *
 *   -1..1 on both axes is on screen. Values outside that are cropped.
 *
 * Read the output as: "top 1.34" means the roof is 34% of a half-viewport
 * above the top edge - i.e. the building is cut off.
 *
 *   node scripts/framing.mjs
 */
import { chromium } from 'playwright'
import { CHAPTERS } from '../src/content.js'

const VIEWPORTS = [
  { name: 'desktop', width: 1600, height: 900, variant: 'desktop' },
  { name: 'mobile', width: 390, height: 844, variant: 'mobile' },
]

const keyframesFor = (variant) =>
  CHAPTERS.map((c) => ({
    id: c.id,
    ...(variant === 'mobile' ? (c.cameraMobile ?? c.camera) : c.camera),
  }))

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})

for (const viewport of VIEWPORTS) {
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
  })
  await page.goto('http://localhost:4173/', { waitUntil: 'load', timeout: 90_000 })
  await page.waitForSelector('.loader.is-hidden', { timeout: 90_000 }).catch(() => {})

  const rows = await page.evaluate((frames) => {
    const { scene, camera, THREE } = window.__stage

    // Tower bounds only: skip the ground plane and the contact-shadow plane,
    // both of which are far larger than the building and would swamp the box.
    const bounds = new THREE.Box3().makeEmpty()
    const box = new THREE.Box3()
    scene.traverse((o) => {
      if (!o.isMesh || !o.visible || !o.geometry) return
      box.setFromObject(o)
      const size = box.getSize(new THREE.Vector3())
      if (size.y < 0.05) return // flat helper planes
      bounds.union(box)
    })

    const corners = []
    for (const x of [bounds.min.x, bounds.max.x])
      for (const y of [bounds.min.y, bounds.max.y])
        for (const z of [bounds.min.z, bounds.max.z]) corners.push(new THREE.Vector3(x, y, z))

    return frames.map((frame) => {
      camera.position.set(...frame.position)
      camera.fov = frame.fov
      camera.updateProjectionMatrix()
      camera.lookAt(new THREE.Vector3(...frame.target))
      camera.updateMatrixWorld(true)

      let left = Infinity
      let right = -Infinity
      let bottom = Infinity
      let top = -Infinity
      for (const corner of corners) {
        const p = corner.clone().project(camera)
        left = Math.min(left, p.x)
        right = Math.max(right, p.x)
        bottom = Math.min(bottom, p.y)
        top = Math.max(top, p.y)
      }

      return {
        id: frame.id,
        left: +left.toFixed(2),
        right: +right.toFixed(2),
        bottom: +bottom.toFixed(2),
        top: +top.toFixed(2),
        height: +(bounds.max.y - bounds.min.y).toFixed(2),
      }
    })
  }, keyframesFor(viewport.variant))

  console.log(`\n=== ${viewport.name} (${viewport.width}x${viewport.height}) ===`)
  console.log('chapter          left  right bottom    top   verdict')
  for (const r of rows) {
    // Roof and base must always be intact - clipping either makes the building
    // look accidentally framed. Sideways is different: on a portrait phone the
    // tower is meant to fill the width and run past the edges, so a modest
    // horizontal overflow is the intended composition, not a fault.
    const sideTolerance = viewport.variant === 'mobile' ? 1.2 : 1.0
    const notes = []
    if (r.top > 1) notes.push(`roof cut ${((r.top - 1) * 50).toFixed(0)}%`)
    if (r.bottom < -1) notes.push(`base cut ${((-1 - r.bottom) * 50).toFixed(0)}%`)
    if (r.left < -sideTolerance) notes.push('left cut')
    if (r.right > sideTolerance) notes.push('right cut')
    if (r.top < 0.35 && r.bottom > -0.9) notes.push('small in frame')
    console.log(
      r.id.padEnd(15),
      String(r.left).padStart(5),
      String(r.right).padStart(6),
      String(r.bottom).padStart(6),
      String(r.top).padStart(6),
      '  ' + (notes.length ? notes.join(', ') : 'ok'),
    )
  }

  await page.close()
}

await browser.close()
