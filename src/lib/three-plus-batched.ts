import * as THREE from 'three'
import { BatchedMesh } from 'three-stdlib'

// Attach at runtime but also re-export for static import
// @ts-ignore
THREE.BatchedMesh = BatchedMesh

export * from 'three'
export { BatchedMesh }
export default THREE 