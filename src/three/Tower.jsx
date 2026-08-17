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

export default function Tower({ spin = 0.02, hidePlate = true }) {
  const group = useRef()
  const { scene } = useGLTF(MODEL_URL, false, true)
  const { gl } = useThree()

  // Clone so hot-reload and any future second instance stay independent.
  const model = useMemo(() => scene.clone(true), [scene])

  useLayoutEffect(() => {
    const anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
    const dispose = enrichMaterials(model, { anisotropy })

    model.updateWorldMatrix(true, true)
    const hidden = hidePlate ? hideBasePlates(model) : []

    // Measure *after* hiding, and over visible meshes only. Using
    // setFromObject here would still include the hidden plate, leaving
    // box.min.y at the plate's underside - the tower then sits ~0.6 units
    // above the ground plane and visibly floats.
    const box = visibleBounds(model)
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
