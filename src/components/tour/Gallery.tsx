import { useMemo } from 'react'
import * as THREE from 'three'
import { limiteExterno, portas, SCALE, SVG_VIEWBOX, WALL_H, WALL_T, walls } from '../../data/planta'
import { wallBoxes } from '../../lib/planta-geom'
import { getPlaster, getStone, getWoodFloor } from './textures'

const W = SVG_VIEWBOX.w * SCALE
const D = SVG_VIEWBOX.h * SCALE
/** metros cobertos por um ladrilho da textura de reboco */
const PLASTER_M = 2.2

/**
 * BoxGeometry com UVs em escala de mundo: cada face repete a textura conforme
 * seu tamanho real, então paredes de comprimentos diferentes têm o mesmo grão
 * e não parecem "remendos".
 */
function worldUvBox(sx: number, sy: number, sz: number, tile: number, offset = 0) {
  const g = new THREE.BoxGeometry(sx, sy, sz)
  const uv = g.attributes.uv as THREE.BufferAttribute
  // ordem das faces no BoxGeometry: +x, -x, +y, -y, +z, -z (4 vértices cada)
  const faceDims: [number, number][] = [
    [sz, sy], [sz, sy], [sx, sz], [sx, sz], [sx, sy], [sx, sy],
  ]
  for (let f = 0; f < 6; f++) {
    const [fw, fh] = faceDims[f]
    for (let v = 0; v < 4; v++) {
      const i = f * 4 + v
      uv.setXY(i, (uv.getX(i) * fw) / tile + offset, (uv.getY(i) * fh) / tile)
    }
  }
  uv.needsUpdate = true
  return g
}

/** Paredes, vergas, cornija, rodapé, piso, teto e o pátio externo. */
export default function Gallery({ quality }: { quality: 'low' | 'high' }) {
  const boxes = useMemo(() => wallBoxes(WALL_H), [])
  const wood = useMemo(() => getWoodFloor(quality === 'high' ? 1024 : 512), [quality])
  const plaster = useMemo(() => getPlaster(quality === 'high' ? 1024 : 512), [quality])
  const stone = useMemo(() => getStone(), [])

  const wallMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: plaster.map,
        roughnessMap: plaster.roughnessMap,
        normalMap: plaster.normalMap,
        normalScale: new THREE.Vector2(0.5, 0.5),
        roughness: 0.92,
        metalness: 0,
        color: '#e8dccb',
      }),
    [plaster],
  )
  const floorMat = useMemo(
    () => new THREE.MeshStandardMaterial({ map: wood.map, roughnessMap: wood.roughnessMap, roughness: 0.7, metalness: 0.05 }),
    [wood],
  )
  const ceilMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#120f0d', roughness: 1 }), [])
  const stoneMat = useMemo(() => new THREE.MeshStandardMaterial({ map: stone.map, roughness: 0.95 }), [stone])
  const trimMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#0a0807', roughness: 0.85 }), [])
  const corniceMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#b9ac98', roughness: 0.8 }), [])
  const jambMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2b211a', roughness: 0.6, metalness: 0.05 }), [])
  const voidMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#050506', roughness: 1 }), [])

  const wallGeos = useMemo(() => boxes.map((b, i) => worldUvBox(b.size[0], b.size[1], b.size[2], PLASTER_M, i * 0.37)), [boxes])

  // Vergas: parte da parede acima de cada vão
  const lintels = useMemo(
    () =>
      portas.map((p, i) => {
        const dx = p.b[0] - p.a[0]
        const dz = p.b[1] - p.a[1]
        const horizontal = Math.abs(dx) > Math.abs(dz)
        const len = Math.hypot(dx, dz) * SCALE + WALL_T
        const h = WALL_H - p.alturaM
        const size = (horizontal ? [len, h, WALL_T] : [WALL_T, h, len]) as [number, number, number]
        return {
          horizontal,
          a: p.a,
          b: p.b,
          alturaM: p.alturaM,
          center: [((p.a[0] + p.b[0]) / 2) * SCALE, p.alturaM + h / 2, ((p.a[1] + p.b[1]) / 2) * SCALE] as [number, number, number],
          size,
          geo: worldUvBox(size[0], size[1], size[2], PLASTER_M, 0.5 + i * 0.29),
        }
      }),
    [],
  )

  const px = ((limiteExterno.x1 + limiteExterno.x2) / 2) * SCALE
  const pz = ((limiteExterno.y1 + limiteExterno.y2) / 2) * SCALE
  const pw = (limiteExterno.x2 - limiteExterno.x1) * SCALE
  const pd = (limiteExterno.y2 - limiteExterno.y1) * SCALE
  const patioGeos = useMemo(
    () => [worldUvBox(pw + WALL_T, 2.6, WALL_T, PLASTER_M, 0.1), worldUvBox(WALL_T, 2.6, pd, PLASTER_M, 0.6), worldUvBox(WALL_T, 2.6, pd, PLASTER_M, 0.9)],
    [pw, pd],
  )

  return (
    <group>
      {boxes.map((b, i) => (
        <mesh key={i} position={b.center} material={wallMat} geometry={wallGeos[i]} castShadow receiveShadow />
      ))}

      {/* vergas + batentes escuros nos vãos */}
      {lintels.map((l, i) => (
        <group key={`l${i}`}>
          <mesh position={l.center} material={wallMat} geometry={l.geo} castShadow receiveShadow />
          {[l.a, l.b].map((p, j) => (
            <mesh key={j} position={[p[0] * SCALE, l.alturaM / 2, p[1] * SCALE]} material={jambMat}>
              <boxGeometry args={[WALL_T + 0.04, l.alturaM, WALL_T + 0.04]} />
            </mesh>
          ))}
          <mesh position={[l.center[0], l.alturaM + 0.03, l.center[2]]} material={jambMat}>
            <boxGeometry args={l.horizontal ? [l.size[0] + 0.04, 0.06, WALL_T + 0.04] : [WALL_T + 0.04, 0.06, l.size[2] + 0.04]} />
          </mesh>
        </group>
      ))}

      {/* rodapé e cornija seguindo cada parede */}
      {walls.map((s, i) => {
        const dx = s.b[0] - s.a[0]
        const dz = s.b[1] - s.a[1]
        const horizontal = Math.abs(dx) > Math.abs(dz)
        const len = Math.hypot(dx, dz) * SCALE + WALL_T + 0.04
        const cx = ((s.a[0] + s.b[0]) / 2) * SCALE
        const cz = ((s.a[1] + s.b[1]) / 2) * SCALE
        return (
          <group key={`t${i}`}>
            <mesh position={[cx, 0.07, cz]} material={trimMat}>
              <boxGeometry args={horizontal ? [len, 0.14, WALL_T + 0.04] : [WALL_T + 0.04, 0.14, len]} />
            </mesh>
            <mesh position={[cx, WALL_H - 0.1, cz]} material={corniceMat}>
              <boxGeometry args={horizontal ? [len, 0.2, WALL_T + 0.08] : [WALL_T + 0.08, 0.2, len]} />
            </mesh>
          </group>
        )
      })}

      {/* piso interno */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[W / 2, 0, D / 2]} material={floorMat} receiveShadow>
        <planeGeometry args={[W, D]} />
      </mesh>
      {/* teto */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[W / 2, WALL_H, D / 2]} material={ceilMat}>
        <planeGeometry args={[W, D]} />
      </mesh>

      {/* pátio externo: piso de pedra e muros que fecham o espaço */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[px, -0.005, pz]} material={stoneMat} receiveShadow>
        <planeGeometry args={[pw, pd]} />
      </mesh>
      <mesh position={[px, 1.3, limiteExterno.y2 * SCALE]} material={wallMat} geometry={patioGeos[0]} receiveShadow />
      <mesh position={[limiteExterno.x1 * SCALE, 1.3, pz]} material={wallMat} geometry={patioGeos[1]} receiveShadow />
      <mesh position={[limiteExterno.x2 * SCALE, 1.3, pz]} material={wallMat} geometry={patioGeos[2]} receiveShadow />
      {/* lampiões de parede flanqueando a entrada */}
      {[404, 470].map((x) => (
        <group key={x} position={[x * SCALE + (x < 437 ? -0.5 : 0.5), 2.4, 536 * SCALE + WALL_T / 2 + 0.12]}>
          <mesh material={jambMat}>
            <boxGeometry args={[0.16, 0.34, 0.16]} />
          </mesh>
          <mesh>
            <boxGeometry args={[0.1, 0.22, 0.1]} />
            <meshStandardMaterial color="#ffd9a0" emissive="#ffb35a" emissiveIntensity={2.5} />
          </mesh>
          <pointLight position={[0, -0.1, 0.3]} intensity={22} distance={12} decay={2} color="#ffb877" />
        </group>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[W / 2, -0.02, D / 2]} material={voidMat}>
        <planeGeometry args={[W * 6, D * 6]} />
      </mesh>
    </group>
  )
}
