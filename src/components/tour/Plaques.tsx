import { useMemo } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { avisoHall, placas, WALL_T } from '../../data/planta'
import { movimentos } from '../../data/movimentos'
import { svgToWorld, yawFromNormal } from '../../lib/planta-geom'

const SERIF = '/fonts/cormorant-500.woff'
const SERIF_IT = '/fonts/cormorant-500-italic.woff'
const MONO = '/fonts/plex-mono-400.woff'

interface PlacaProps {
  pos: [number, number]
  normal: [number, number]
  titulo: string
  eyebrow: string
  frase: string
  mat: THREE.Material
}

function Placa({ pos, normal, titulo, eyebrow, frase, mat }: PlacaProps) {
  const [x, , z] = svgToWorld(pos)
  const off = WALL_T / 2 + 0.005
  const largura = 1.45
  const altura = 0.9
  const pad = 0.09
  const left = -largura / 2 + pad
  return (
    <group position={[x + normal[0] * off, 1.62, z + normal[1] * off]} rotation={[0, yawFromNormal(normal), 0]}>
      <mesh position={[0, 0, 0.015]} material={mat}>
        <boxGeometry args={[largura, altura, 0.03]} />
      </mesh>
      {/* filete dourado no topo */}
      <mesh position={[0, altura / 2 - 0.02, 0.032]}>
        <planeGeometry args={[largura - pad * 2, 0.004]} />
        <meshBasicMaterial color="#c99a3f" />
      </mesh>
      <Text font={MONO} fontSize={0.038} color="#c99a3f" anchorX="left" anchorY="top" position={[left, altura / 2 - 0.08, 0.034]} letterSpacing={0.12} maxWidth={largura - pad * 2}>
        {eyebrow.toUpperCase()}
      </Text>
      <Text font={SERIF} fontSize={0.115} color="#ede3d1" anchorX="left" anchorY="top" position={[left, altura / 2 - 0.16, 0.034]} maxWidth={largura - pad * 2}>
        {titulo}
      </Text>
      <Text font={SERIF_IT} fontSize={0.056} color="#cbbfa9" anchorX="left" anchorY="top" position={[left, altura / 2 - 0.34, 0.034]} maxWidth={largura - pad * 2} lineHeight={1.3}>
        {frase}
      </Text>
    </group>
  )
}

export default function Plaques() {
  // placa levemente emissiva: legível mesmo nos cantos escuros, sem precisar de luz própria
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#241c16', roughness: 0.55, metalness: 0.1, emissive: '#1a1410', emissiveIntensity: 0.6 }), [])
  return (
    <group>
      {placas.map((p) => {
        const m = movimentos[p.movimento - 1]
        return <Placa key={p.movimento} mat={mat} pos={p.pos} normal={p.normal} eyebrow={`Movimento ${m.ordem} de 6 · ${m.espaco}`} titulo={m.titulo} frase={m.frase} />
      })}
      <Placa
        mat={mat}
        pos={avisoHall.pos}
        normal={avisoHall.normal}
        eyebrow="Percurso sugerido"
        titulo="Comece pela esquerda"
        frase="Siga pela passagem baixa. A porta à sua frente é a saída do último movimento."
      />
    </group>
  )
}
