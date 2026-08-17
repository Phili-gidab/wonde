import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette, SMAA } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import Tower from './Tower.jsx'
import Ground from './Ground.jsx'
import { sampleCameraPath } from './cameraPath.js'

/**
 * Dusk palette. Warm amber key against cool blue shadow, which is both the
 * flattering light for concrete and glass and a match for the brand accent.
 */
const KEY = '#ffc27a'
const FILL = '#4d7ea8'
const GROUND = '#0a0e14'

/**
 * Drives the default camera along the scroll-bound path.
 *
 * Damping is applied to the *sampled* target rather than to scroll itself, so
 * fast flicks still settle smoothly instead of snapping.
 */
function CameraRig({ progress, reducedMotion, pointer }) {
  const { camera } = useThree()

  const desiredPosition = useMemo(() => new THREE.Vector3(), [])
  const desiredTarget = useMemo(() => new THREE.Vector3(), [])
  const currentTarget = useRef(new THREE.Vector3(0, 4.2, 0))
  const started = useRef(false)

  useFrame((_, delta) => {
    const fov = sampleCameraPath(progress.current, desiredPosition, desiredTarget)

    // Gentle parallax so the shot feels hand-held rather than on rails.
    if (!reducedMotion) {
      desiredPosition.x += pointer.current.x * 0.9
      desiredPosition.y += pointer.current.y * 0.5
    }

    // Frame-rate independent damping.
    const alpha = reducedMotion ? 1 : 1 - Math.pow(0.0016, delta)

    if (!started.current) {
      camera.position.copy(desiredPosition)
      currentTarget.current.copy(desiredTarget)
      started.current = true
    } else {
      camera.position.lerp(desiredPosition, alpha)
      currentTarget.current.lerp(desiredTarget, alpha)
    }

    camera.lookAt(currentTarget.current)

    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov += (fov - camera.fov) * alpha
      camera.updateProjectionMatrix()
    }
  })

  return null
}

/**
 * Procedural environment - no HDRI download. A handful of Lightformers give
 * the glass and metal something structured to reflect, which is what actually
 * sells the material quality.
 */
function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      {/* warm sky band, low and wide - the 'sunset' */}
      <Lightformer
        intensity={2.4}
        color={KEY}
        position={[-6, 3, -8]}
        scale={[14, 6, 1]}
        target={[0, 3, 0]}
      />
      {/* cool sky dome opposite */}
      <Lightformer
        intensity={1.1}
        color={FILL}
        position={[8, 7, 6]}
        scale={[12, 10, 1]}
        target={[0, 4, 0]}
      />
      {/* narrow vertical strips read as window highlights on the glazing */}
      <Lightformer intensity={2.2} color="#ffffff" position={[5, 6, -6]} scale={[0.6, 9, 1]} />
      <Lightformer intensity={1.6} color="#ffffff" position={[-7, 5, 4]} scale={[0.4, 8, 1]} />
      {/* overhead bounce */}
      <Lightformer
        intensity={0.8}
        color="#cfe2f2"
        position={[0, 14, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[16, 16, 1]}
      />
    </Environment>
  )
}

function Lights() {
  return (
    <>
      <hemisphereLight args={[FILL, GROUND, 0.55]} />
      <directionalLight
        position={[-9, 13, 7]}
        intensity={2.6}
        color={KEY}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0006}
        shadow-normalBias={0.02}
      >
        {/* Tight ortho frustum around the tower keeps shadow texels dense. */}
        <orthographicCamera attach="shadow-camera" args={[-11, 11, 14, -2, 1, 40]} />
      </directionalLight>
      {/* cool rim from behind to separate the silhouette from the background */}
      <directionalLight position={[10, 6, -9]} intensity={0.9} color={FILL} />
    </>
  )
}

export default function Scene({ progress, reducedMotion, quality = 'high' }) {
  const pointer = useRef({ x: 0, y: 0 })

  const onPointerMove = (event) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1
    const y = (event.clientY / window.innerHeight) * 2 - 1
    pointer.current.x = x
    pointer.current.y = -y
  }

  return (
    <Canvas
      className="scene-canvas"
      shadows={quality === 'high'}
      dpr={[1, quality === 'high' ? 1.75 : 1.25]}
      gl={{
        antialias: false, // SMAA in the composer handles this more cheaply
        powerPreference: 'high-performance',
        alpha: true,
      }}
      camera={{ position: [7.5, 2, 15.5], fov: 42, near: 0.1, far: 120 }}
      onPointerMove={onPointerMove}
      onCreated={({ gl, scene, camera }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
        // Handle for scripts/shoot.mjs to inspect framing. Harmless in prod.
        window.__stage = { scene, camera, THREE }
      }}
    >
      <fog attach="fog" args={[GROUND, 22, 60]} />

      <Suspense fallback={null}>
        <Tower spin={reducedMotion ? 0 : 0.015} />
        <Ground />
        <Studio />
      </Suspense>

      <Lights />

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.62}
        scale={34}
        blur={2.4}
        far={12}
        resolution={quality === 'high' ? 1024 : 512}
        color="#000000"
      />

      <CameraRig progress={progress} reducedMotion={reducedMotion} pointer={pointer} />

      {quality === 'high' && (
        <EffectComposer multisampling={0} disableNormalPass>
          <Bloom
            intensity={0.55}
            luminanceThreshold={0.72}
            luminanceSmoothing={0.3}
            mipmapBlur
          />
          <Vignette offset={0.28} darkness={0.72} eskil={false} />
          <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.35} />
          <SMAA />
        </EffectComposer>
      )}
    </Canvas>
  )
}
