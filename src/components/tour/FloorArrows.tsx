import { useMemo } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { ancoras, rotaIda, rotaSaida, SCALE } from '../../data/planta'
import { obras } from '../../data/obras'

const MONO = '/fonts/plex-mono-400.woff'

function arrowsAlong(pts: [number, number][], spacing: number) {
  const out: { pos: [number, number, number]; rot: number }[] = []
  let carry = 0
  for (let i = 1; i < pts.length; i++) {
    const ax = pts[i - 1][0] * SCALE
    const az = pts[i - 1][1] * SCALE
    const bx = pts[i][0] * SCALE
    const bz = pts[i][1] * SCALE
    const len = Math.hypot(bx - ax, bz - az)
    const dirx = (bx - ax) / len
    const dirz = (bz - az) / len
    const rot = Math.atan2(dirx, dirz)
    let d = spacing - carry
    while (d < len) {
      out.push({ pos: [ax + dirx * d, 0.006, az + dirz * d], rot })
      d += spacing
    }
    carry = len - (d - spacing)
  }
  return out
}

export default function FloorArrows() {
  const ida = useMemo(() => arrowsAlong(rotaIda, 1.6), [])
  const saida = useMemo(() => arrowsAlong(rotaSaida, 1.6), [])
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 0.14)
    s.lineTo(0.1, -0.06)
    s.lineTo(0.03, -0.06)
    s.lineTo(0.03, -0.16)
    s.lineTo(-0.03, -0.16)
    s.lineTo(-0.03, -0.06)
    s.lineTo(-0.1, -0.06)
    s.closePath()
    return s
  }, [])
  const matIda = useMemo(() => new THREE.MeshStandardMaterial({ color: '#7d5c22', emissive: '#c99a3f', emissiveIntensity: 0.45, roughness: 0.6, transparent: true, opacity: 0.85 }), [])
  const matSaida = useMemo(() => new THREE.MeshStandardMaterial({ color: '#4a423b', emissive: '#8a7d70', emissiveIntensity: 0.18, roughness: 0.6, transparent: true, opacity: 0.7 }), [])

  return (
    <group>
      {ida.map((a, i) => (
        <mesh key={`i${i}`} position={a.pos} rotation={[-Math.PI / 2, 0, a.rot + Math.PI]} material={matIda}>
          <shapeGeometry args={[shape]} />
        </mesh>
      ))}
      {saida.map((a, i) => (
        <mesh key={`s${i}`} position={a.pos} rotation={[-Math.PI / 2, 0, a.rot + Math.PI]} material={matSaida}>
          <shapeGeometry args={[shape]} />
        </mesh>
      ))}
      {/* número de cada obra no piso, em frente a ela */}
      {obras.map((o) => {
        const a = ancoras[o.n]
        const px = (a.pos[0] + a.normal[0] * 40) * SCALE
        const pz = (a.pos[1] + a.normal[1] * 40) * SCALE
        const rot = Math.atan2(a.normal[0], a.normal[1])
        return (
          <group key={o.n} position={[a.piso ? a.vista[0] * SCALE : px, 0.007, a.piso ? a.vista[1] * SCALE : pz]} rotation={[-Math.PI / 2, 0, rot]}>
            <mesh>
              <circleGeometry args={[0.16, 32]} />
              <meshStandardMaterial color="#0b0908" emissive="#c99a3f" emissiveIntensity={0.08} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0, 0.001]}>
              <ringGeometry args={[0.15, 0.165, 40]} />
              <meshStandardMaterial color="#c99a3f" emissive="#c99a3f" emissiveIntensity={0.6} />
            </mesh>
            <Text font={MONO} fontSize={0.16} color="#e4bd6a" anchorX="center" anchorY="middle" position={[0, 0, 0.002]}>
              {String(o.n)}
            </Text>
          </group>
        )
      })}
    </group>
  )
}
