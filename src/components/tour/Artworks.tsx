import { useMemo } from 'react'
import * as THREE from 'three'
import { Text, useTexture } from '@react-three/drei'
import { ancoras, WALL_T } from '../../data/planta'
import { obras, type Obra } from '../../data/obras'
import { svgToWorld, yawFromNormal } from '../../lib/planta-geom'
import { tourStore } from '../../store/tour'

const MONO = '/fonts/plex-mono-400.woff'
const EYE = 1.55

function Quadro({ obra, gold, dark, label }: { obra: Obra; gold: THREE.Material; dark: THREE.Material; label: THREE.Material }) {
  const a = ancoras[obra.n]
  const tex = useTexture(obra.imagem)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  const w = obra.larguraM
  const h = w / obra.proporcao
  const instalacao = obra.n === 6 || obra.n === 9
  const frame = instalacao ? 0.025 : obra.n === 10 ? 0.09 : 0.06
  const [x, , z] = svgToWorld(a.pos)
  const off = WALL_T / 2 + 0.005
  const pos: [number, number, number] = [x + a.normal[0] * off, EYE, z + a.normal[1] * off]
  const rotY = yawFromNormal(a.normal)
  const depth = instalacao ? 0.03 : 0.06

  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      {/* moldura: dourada nas pinturas, preta fina nas fotos de instalação */}
      <mesh position={[0, 0, depth / 2]} material={instalacao ? dark : gold} castShadow>
        <boxGeometry args={[w + frame * 2, h + frame * 2, depth]} />
      </mesh>
      <mesh
        position={[0, 0, depth + 0.004]}
        onClick={(e) => {
          e.stopPropagation()
          tourStore.patch({ aberta: obra.n })
        }}
      >
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial map={tex} roughness={0.75} metalness={0} />
      </mesh>
      {/* etiqueta abaixo do quadro, à direita, sempre dentro da mesma parede */}
      <group position={[Math.min(w / 2, 0.9) - 0.25, -h / 2 - frame - 0.24, 0.012]}>
        <mesh material={label}>
          <planeGeometry args={[0.5, 0.26]} />
        </mesh>
        <Text font={MONO} fontSize={0.022} color="#1a1512" anchorX="left" anchorY="top" position={[-0.22, 0.1, 0.003]} maxWidth={0.44} lineHeight={1.4} overflowWrap="break-word">
          {`${obra.n}  ${obra.artista.toUpperCase()}\n${obra.titulo}\n${obra.ano} · ${obra.acervo}`}
        </Text>
      </group>
    </group>
  )
}

export default function Artworks() {
  const gold = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#b8862e', metalness: 0.85, roughness: 0.32, emissive: '#3a2708', emissiveIntensity: 0.15 }),
    [],
  )
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: '#141110', roughness: 0.5, metalness: 0.1 }), [])
  const label = useMemo(() => new THREE.MeshStandardMaterial({ color: '#d8cfbc', roughness: 0.95, emissive: '#6b6250', emissiveIntensity: 0.25 }), [])
  return (
    <group>
      {obras
        .filter((o) => !ancoras[o.n].piso)
        .map((o) => (
          <Quadro key={o.n} obra={o} gold={gold} dark={dark} label={label} />
        ))}
    </group>
  )
}
