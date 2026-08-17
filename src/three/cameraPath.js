import * as THREE from 'three'
import { CHAPTERS } from '../content.js'

/**
 * One continuous camera path bound to scroll position, sampled per frame.
 *
 * Each chapter contributes a keyframe (see `camera` in src/content.js) and we
 * ease between neighbours rather than cutting, so a section reads as a new
 * composed shot of the same building instead of a scene change.
 *
 * Coordinates are normalised units: the tower is TOWER_HEIGHT high and stands
 * on y = 0, centred on x/z. Tower.jsx rescales the GLB to match, so these
 * numbers stay valid even if the source model is swapped.
 */
export const TOWER_HEIGHT = 10

const KEYS = CHAPTERS.map((chapter) => chapter.camera)

const positions = KEYS.map((k) => new THREE.Vector3(...k.position))
const targets = KEYS.map((k) => new THREE.Vector3(...k.target))
const fovs = KEYS.map((k) => k.fov)

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const smoothstep = (t) => t * t * (3 - 2 * t)

/**
 * Sample the path at `progress` (0..1 across the whole page).
 * Writes into the supplied vectors to avoid per-frame allocation.
 */
export function sampleCameraPath(progress, outPosition, outTarget) {
  const segments = KEYS.length - 1
  const scaled = clamp01(progress) * segments
  const index = Math.min(Math.floor(scaled), segments - 1)
  const t = smoothstep(scaled - index)

  outPosition.copy(positions[index]).lerp(positions[index + 1], t)
  outTarget.copy(targets[index]).lerp(targets[index + 1], t)

  return fovs[index] + (fovs[index + 1] - fovs[index]) * t
}

/** Which chapter is currently dominant - drives the text overlay. */
export function chapterAt(progress) {
  const segments = KEYS.length - 1
  return Math.round(clamp01(progress) * segments)
}
