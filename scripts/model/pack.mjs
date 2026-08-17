/**
 * Phase 3/3 - meshopt geometry compression and final write.
 *   models-src/_tex.glb -> public/models/tower.glb
 *
 * Runs after textures because it only touches geometry buffers, and because
 * @gltf-transform/functions cannot share a process with sharp encoding
 * (see the note in tex.mjs).
 */
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { meshopt } from '@gltf-transform/functions'
import { MeshoptEncoder } from 'meshoptimizer'
import { mkdir, stat } from 'node:fs/promises'

const SRC = 'models-src/_tex.glb'
const OUT = 'public/models/tower.glb'

const kb = (n) => `${(n / 1024).toFixed(0)} KB`

await MeshoptEncoder.ready
await mkdir('public/models', { recursive: true })

// The encoder must be registered on the IO as well as passed to the
// transform - the writer reaches for it again at serialisation time.
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder })

const document = await io.read(SRC)

await document.transform(meshopt({ encoder: MeshoptEncoder, level: 'high' }))
await io.write(OUT, document)

const names = document.getRoot().listMaterials().map((m) => m.getName())
console.log(`  materials: ${names.join(', ')}`)
console.log(`  -> ${OUT} (${kb((await stat(OUT)).size)})`)
