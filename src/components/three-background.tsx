'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function StarField({ count = 5000 }) {
  const ref = useRef<THREE.Points>(null)
  const { mouse, viewport } = useThree()
  
  const [sphere] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 1.5
      const u = Math.random()
      const v = Math.random()
      const theta = 2 * Math.PI * u
      const phi = Math.acos(2 * v - 1)
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
    }
    return [positions]
  }, [count])

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10
      ref.current.rotation.y -= delta / 15
      
      // Mouse interaction
      const x = (mouse.x * viewport.width) / 2
      const y = (mouse.y * viewport.height) / 2
      ref.current.position.x = x * 0.05
      ref.current.position.y = y * 0.05
    }
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  )
}

function FloatingGeometry() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { mouse } = useThree()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1
      meshRef.current.position.x = mouse.x * 0.5
      meshRef.current.position.y = mouse.y * 0.5
    }
  })

  return (
    <mesh ref={meshRef} position={[2, 0, 0]}>
      <icosahedronGeometry args={[0.3, 4]} />
      <meshBasicMaterial 
        color="#ffffff" 
        wireframe 
        transparent 
        opacity={0.1}
      />
    </mesh>
  )
}

export function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas>
        <StarField />
        <FloatingGeometry />
      </Canvas>
    </div>
  )
} 