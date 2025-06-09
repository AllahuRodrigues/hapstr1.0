import * as THREE from 'three'

// Minimal stub for BatchedMesh expected by three-mesh-bvh
class BatchedMesh extends THREE.Mesh {
  constructor(geometry?: THREE.BufferGeometry, material?: THREE.Material | THREE.Material[]) {
    super(geometry, material)
  }
  // Placeholder methods used in BVH utils (no-op here)
  getVertexPosition(_a: number, _b: THREE.Vector3) { return _b }
}

// Use defineProperty to avoid getter-only property error
try {
  Object.defineProperty(THREE, 'BatchedMesh', {
    value: BatchedMesh,
    writable: true,
    configurable: true
  })
} catch (e) {
  // Fallback - just ignore if we can't define it
  console.warn('Could not define BatchedMesh on THREE:', e)
}

export {} 