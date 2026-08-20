import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { enrichMaterials } from './materials.js'
import { TOWER_HEIGHT } from './cameraPath.js'

const MODEL_URL = '/models/tower.glb'

/**
 * The building.
 *
 * The GLB is already centred on x/z with its base on y = 0 (see
 * scripts/model/geo.mjs), but its absolute size depends on whatever the source
 * model happened to use - 44.74 units tall for the current one. We rescale to
 * TOWER_HEIGHT here so the camera keyframes in src/content.js stay meaningful
 * if the model is ever swapped.
 */
/**
 * Hide the site plate the model was exported with.
 *
 * The source includes a slab plus flat paving details covering the whole site.
 * It ends in a hard straight edge, which against a dark background reads as a
 * plinth - the building looks like a scale model on a table. Ground.jsx
 * substitutes a plane that fades out instead.
 *
 * Detected geometrically rather than by material name so that swapping the
 * source model does not silently reintroduce the problem: a plate is thin in
 * Y, sits at the very bottom of the model, and covers most of the footprint.
 * A real ground floor fails the thinness test - it is a whole storey tall.
 */
/**
 * Bounds over visible meshes only.
 *
 * THREE.Box3.setFromObject walks every descendant regardless of `visible`, so
 * it would still include the slab we just hid and leave the tower floating.
 */
function visibleBounds(root) {
  const bounds = new THREE.Box3().makeEmpty()
  const box = new THREE.Box3()

  root.traverse((object) => {
    if (!object.isMesh || !object.visible || !object.geometry) return
    box.setFromObject(object)
    bounds.union(box)
  })

  return bounds
}

/**
 * Cull the site paving, triangle by triangle.
 *
 * hideBasePlates() above works at mesh level and catches the thick ceramic
 * slab. It cannot catch the paving laid on top of it, because `join` in
 * scripts/model/geo.mjs groups meshes by material: the paving shares
 * `06_-_Default` and `13_-_Brushed_Metal_2` with elements ten storeys up, so
 * by the time three.js sees it, it is a few hundred triangles inside a mesh
 * 8.5 units tall. Nothing about that mesh is thin, low or wide. The triangles
 * are the only handle left.
 *
 * This did not matter while the page was near-black - the apron was the same
 * value as the background. On white it is a pale slab that stops dead in a
 * straight line a few units from the tower, which is the diorama-on-a-table
 * read that Ground.jsx exists to prevent.
 *
 * Drops triangles that are entirely inside the bottom `depth` of the model and
 * either face up, or are a flat sliver thinner than `sliver`. Two tests rather
 * than one because the apron has two parts: the paved surface, which the
 * orientation test catches, and the rim around its edge, which is vertical and
 * survived it - leaving a hairline rectangle drawn on the ground where the
 * surface used to be, which on white was still perfectly visible.
 *
 * Between them the two tests are what keeps this safe. The ground floor keeps
 * its walls, columns and glazing: those faces run a full storey, so they reach
 * above the cutoff and are never sliver-thin. What goes is the apron, its rim,
 * and the lobby floor slab - which is only ever seen from above, by a camera
 * that never goes there.
 *
 * Geometry is cloned before it is edited. `useGLTF` caches the loaded scene
 * and `scene.clone(true)` shares geometry with it, so editing in place would
 * follow the model into the next mount.
 */
function cullGroundPaving(model, bounds, { depth = 0.02, upness = 0.85, sliver = 0.005 } = {}) {
  const size = bounds.getSize(new THREE.Vector3())
  const cutoff = bounds.min.y + size.y * depth
  const flat = size.y * sliver

  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const c = new THREE.Vector3()
  const ab = new THREE.Vector3()
  const ac = new THREE.Vector3()
  const normal = new THREE.Vector3()

  const edited = []

  model.traverse((object) => {
    if (!object.isMesh || !object.visible || !object.geometry) return

    const geometry = object.geometry
    const position = geometry.attributes.position
    if (!position) return

    const index = geometry.index
    const count = index ? index.count : position.count
    const keep = []

    for (let i = 0; i < count; i += 3) {
      const i0 = index ? index.getX(i) : i
      const i1 = index ? index.getX(i + 1) : i + 1
      const i2 = index ? index.getX(i + 2) : i + 2

      a.fromBufferAttribute(position, i0).applyMatrix4(object.matrixWorld)
      b.fromBufferAttribute(position, i1).applyMatrix4(object.matrixWorld)
      c.fromBufferAttribute(position, i2).applyMatrix4(object.matrixWorld)

      if (a.y < cutoff && b.y < cutoff && c.y < cutoff) {
        ab.subVectors(b, a)
        ac.subVectors(c, a)
        normal.crossVectors(ab, ac)
        const length = normal.length()
        // Degenerate triangles have no meaningful normal; leave them be.
        const facesUp = length > 1e-8 && Math.abs(normal.y) / length > upness
        const isSliver = Math.max(a.y, b.y, c.y) - Math.min(a.y, b.y, c.y) < flat

        if (facesUp || isSliver) continue
      }

      keep.push(i0, i1, i2)
    }

    if (keep.length === count) return

    const clone = geometry.clone()
    clone.setIndex(keep)
    object.geometry = clone
    edited.push({ object, geometry })
  })

  return function restore() {
    for (const { object, geometry } of edited) {
      object.geometry.dispose()
      object.geometry = geometry
    }
  }
}

function hideBasePlates(model) {
  const modelBox = new THREE.Box3().setFromObject(model)
  const modelSize = modelBox.getSize(new THREE.Vector3())
  const footprint = modelSize.x * modelSize.z
  const hidden = []

  const box = new THREE.Box3()

  model.traverse((object) => {
    if (!object.isMesh) return

    box.setFromObject(object)
    const size = box.getSize(new THREE.Vector3())

    // Thresholds measured against the real model. For the current source:
    //   Ceramic  sizeY 2.7  maxY  2.7  footprint 100%  <- the plate
    //   Metal    sizeY 0.8  maxY 43.3  footprint  37%  <- roof, must survive
    //   Alu      sizeY 0.5  maxY 42.5  footprint  36%  <- roof, must survive
    // The footprint test is what separates them: the next largest element
    // after the plate covers 63%, so 80% isolates the plate cleanly. `low` is
    // generous because the plate has real thickness - an earlier 6% cutoff
    // missed it by 0.02 units and left the plinth on screen.
    const thin = size.y < modelSize.y * 0.1
    const low = box.max.y < modelBox.min.y + modelSize.y * 0.15
    const wide = size.x * size.z > footprint * 0.8

    if (thin && low && wide) {
      object.visible = false
      hidden.push(object)
    }
  })

  return hidden
}

/**
 * The building turns slowly on its own axis, independently of the camera path.
 *
 * This costs real frame time: because the geometry moves, neither the
 * directional light's shadow map nor the contact-shadow pass can be baked, so
 * both re-render every frame. That is a deliberate trade - the motion is what
 * gives the scene life. `spin={0}` restores the cheap static version, and
 * reduced-motion users already get it.
 */
export default function Tower({ spin = 0.015, hidePlate = true }) {
  const group = useRef()
  const { scene } = useGLTF(MODEL_URL, false, true)
  const { gl } = useThree()

  // Clone so hot-reload and any future second instance stay independent.
  const model = useMemo(() => scene.clone(true), [scene])

  useLayoutEffect(() => {
    // The facade is timber slats and brick coursing seen at grazing angles
    // from almost every keyframe, which is exactly where anisotropy earns its
    // keep - at 8 the slats mush into grey a third of the way up the tower.
    const anisotropy = Math.min(16, gl.capabilities.getMaxAnisotropy())
    const dispose = enrichMaterials(model, { anisotropy })

    model.updateWorldMatrix(true, true)
    const hidden = hidePlate ? hideBasePlates(model) : []

    // Measure *after* hiding, and over visible meshes only. Using
    // setFromObject here would still include the hidden plate, leaving
    // box.min.y at the plate's underside - the tower then sits ~0.6 units
    // above the ground plane and visibly floats.
    const box = visibleBounds(model)

    // Paving comes off after the box is measured and before the model is
    // scaled: it sits above the tower's own base, so removing it does not
    // move box.min.y, and doing it here keeps the cutoff in the same
    // unscaled space the box was measured in.
    const restorePaving = hidePlate ? cullGroundPaving(model, box) : null
    const size = new THREE.Vector3()
    const centre = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(centre)

    const scale = size.y > 0 ? TOWER_HEIGHT / size.y : 1
    model.scale.setScalar(scale)

    // Re-centre on x/z and sit the base exactly on the ground plane, in case
    // the source was not already normalised.
    model.position.set(-centre.x * scale, -box.min.y * scale, -centre.z * scale)

    return () => {
      restorePaving?.()
      for (const object of hidden) object.visible = true
      dispose()
    }
  }, [model, gl, hidePlate])

  useFrame((_, delta) => {
    if (!group.current || !spin) return
    group.current.rotation.y += delta * spin
  })

  return (
    <group ref={group}>
      <primitive object={model} />
    </group>
  )
}

useGLTF.preload(MODEL_URL, false, true)
