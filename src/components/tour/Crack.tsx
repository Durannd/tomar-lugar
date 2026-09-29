import { useMemo } from 'react'
import * as THREE from 'three'
import { fenda, SCALE } from '../../data/planta'
import { getCrack } from './textures'
import { tourStore } from '../../store/tour'

/** Fenda no piso do Corredor Oeste, evocando Shibboleth (obra 5). */
export default function Crack() {
  const tex = useMemo(() => getCrack(), [])
  const ys = fenda.map((p) => p[1])
  const zMin = Math.min(...ys) * SCALE
  const zMax = Math.max(...ys) * SCALE
  const xMid = (fenda.reduce((a, p) => a + p[0], 0) / fenda.length) * SCALE
  const len = zMax - zMin + 0.6
  const width = 0.7

  // fenda física: sulco escuro abaixo do piso
  const groove = useMemo(() => {
    const shape = new THREE.Shape()
    const pts = fenda.map((p) => new THREE.Vector2((p[0] - fenda[0][0]) * SCALE, (p[1] - fenda[0][1]) * SCALE))
    shape.moveTo(pts[0].x - 0.03, pts[0].y)
    pts.forEach((p) => shape.lineTo(p.x - 0.03, p.y))
    for (let i = pts.length - 1; i >= 0; i--) shape.lineTo(pts[i].x + 0.03, pts[i].y)
    shape.closePath()
    return new THREE.ExtrudeGeometry(shape, { depth: 0.12, bevelEnabled: false })
  }, [])

  return (
    <group>
      <mesh geometry={groove} position={[fenda[0][0] * SCALE, -0.115, fenda[0][1] * SCALE]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#05070c" emissive="#1c2f55" emissiveIntensity={0.9} roughness={1} side={THREE.DoubleSide} />
      </mesh>
      <mesh
        position={[xMid, 0.004, (zMin + zMax) / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation()
          tourStore.patch({ aberta: 5 })
        }}
      >
        <planeGeometry args={[width, len]} />
        <meshStandardMaterial map={tex} transparent roughness={0.9} depthWrite={false} polygonOffset polygonOffsetFactor={-1} />
      </mesh>
    </group>
  )
}
