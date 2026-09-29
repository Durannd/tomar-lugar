import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { ancoras, salas, SCALE, WALL_H } from '../../data/planta'
import { svgToWorld } from '../../lib/planta-geom'

const QUENTE = '#ffb877'
const FRIO = '#8fb3ff'

function centro(id: string): [number, number, number] {
  const s = salas.find((r) => r.id === id)!
  return [((s.rect[0] + s.rect[2]) / 2) * SCALE, WALL_H - 0.25, ((s.rect[1] + s.rect[3]) / 2) * SCALE]
}

/** Spot de Artemisia: única luz forte da Sala A, mirando a obra 10. */
function ArtemisiaSpot({ shadows }: { shadows: boolean }) {
  const light = useRef<THREE.SpotLight>(null)
  const target = useRef<THREE.Object3D>(new THREE.Object3D())
  const [tx, , tz] = svgToWorld(ancoras[10].pos)
  useEffect(() => {
    if (!light.current) return
    target.current.position.set(tx + 0.1, 1.55, tz)
    light.current.target = target.current
  }, [tx, tz])
  return (
    <>
      <primitive object={target.current} />
      <spotLight
        ref={light}
        position={[tx + 2.2, WALL_H - 0.2, tz]}
        angle={0.36}
        penumbra={0.55}
        intensity={90}
        distance={7}
        decay={2}
        color="#ffc98a"
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      />
    </>
  )
}

export default function Lights({ quality }: { quality: 'low' | 'high' }) {
  const high = quality === 'high'
  const hall = centro('hall')
  const galeria = centro('galeria')
  const norte = centro('corredor-norte')
  const salaB = centro('sala-b')
  const oeste = centro('corredor-oeste')

  return (
    <group>
      <ambientLight intensity={0.2} color="#b8a48a" />
      <hemisphereLight intensity={0.16} color="#3a4a6a" groundColor="#1a120a" />

      {/* Hall — chão: luz quente aberta */}
      <pointLight position={hall} intensity={18} distance={9} decay={2} color={QUENTE} />
      {/* Galeria Oeste — partida */}
      <pointLight position={[galeria[0], galeria[1], galeria[2]]} intensity={16} distance={9} decay={2} color="#ffad6a" />
      {/* Corredor Oeste — fronteira: só luz fria e estreita */}
      <spotLight position={[oeste[0], WALL_H - 0.1, oeste[2] - 0.9]} angle={0.5} penumbra={0.9} intensity={14} distance={7} decay={2} color={FRIO} />
      <spotLight position={[oeste[0], WALL_H - 0.1, oeste[2] + 1.2]} angle={0.5} penumbra={0.9} intensity={10} distance={7} decay={2} color={FRIO} />
      {/* Corredor Norte — raiz: luz quente ao longo da parede */}
      <pointLight position={[norte[0] - 2.6, norte[1], norte[2]]} intensity={14} distance={8} decay={2} color={QUENTE} />
      <pointLight position={[norte[0] + 1.8, norte[1], norte[2]]} intensity={14} distance={8} decay={2} color={QUENTE} />
      {/* Sala B — reivindicação */}
      <pointLight position={salaB} intensity={14} distance={7} decay={2} color="#ffbe88" />
      {/* Sala A — só o spot de Artemisia e um brilho mínimo */}
      <pointLight position={[centro('sala-a')[0], 1.2, centro('sala-a')[2]]} intensity={1.2} distance={5} decay={2} color="#ffb877" />
      <ArtemisiaSpot shadows={high} />
      {/* exterior: noite fria com luar */}
      <directionalLight position={[8, 14, 26]} intensity={0.9} color="#6f86b8" />
      <pointLight position={[437 * SCALE, 3.2, 600 * SCALE]} intensity={4} distance={10} decay={2} color="#8fa3d0" />
    </group>
  )
}
