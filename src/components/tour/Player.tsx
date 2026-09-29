import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls, useKeyboardControls } from '@react-three/drei'
import type { PointerLockControls as PLC } from 'three-stdlib'
import { ancoras, salas, SCALE, spawn } from '../../data/planta'
import { buildColliders, slideMove } from '../../lib/collision'
import { movimentos } from '../../data/movimentos'
import { tourStore } from '../../store/tour'

export type Controls = 'forward' | 'back' | 'left' | 'right' | 'run' | 'interact'

/** nº da obra → ordem do movimento (sala) em que está pendurada */
const obraMovimento: Record<number, number> = Object.fromEntries(
  movimentos.flatMap((m) => m.obras.map((n) => [n, m.ordem])),
)

const EYE_H = 1.65
const RADIUS = 0.32
const SPEED = 2.4
const RUN = 4.2

export default function Player() {
  const controls = useRef<PLC>(null)
  const { camera } = useThree()
  const colliders = useMemo(() => buildColliders(RADIUS), [])
  const vel = useRef(new THREE.Vector3())
  const [, get] = useKeyboardControls<Controls>()
  const tmpDir = useRef(new THREE.Vector3())
  const tmpRight = useRef(new THREE.Vector3())
  const lastInteract = useRef(false)
  const bob = useRef(0)

  // posição inicial: fora da entrada, olhando para dentro (−z)
  useEffect(() => {
    camera.position.set(spawn.pos[0] * SCALE, EYE_H, spawn.pos[1] * SCALE)
    camera.rotation.set(0, 0, 0)
    camera.lookAt(spawn.pos[0] * SCALE, EYE_H, spawn.pos[1] * SCALE - 5)
  }, [camera])

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    const s = tourStore.get()
    const k = get()

    if (s.teleport) {
      camera.position.set(s.teleport.pos[0] * SCALE, EYE_H, s.teleport.pos[1] * SCALE)
      camera.rotation.set(0, s.teleport.yaw, 0, 'YXZ')
      tourStore.patch({ teleport: null })
    }

    // interação por tecla E (borda de subida)
    if (k.interact && !lastInteract.current) {
      if (s.aberta) tourStore.patch({ aberta: 0 })
      else if (s.perto) tourStore.patch({ aberta: s.perto })
    }
    lastInteract.current = k.interact

    if (s.locked && !s.aberta) {
      const speed = k.run ? RUN : SPEED
      camera.getWorldDirection(tmpDir.current)
      tmpDir.current.y = 0
      tmpDir.current.normalize()
      tmpRight.current.crossVectors(tmpDir.current, camera.up).normalize()
      const move = new THREE.Vector3()
      if (k.forward) move.add(tmpDir.current)
      if (k.back) move.sub(tmpDir.current)
      if (k.right) move.add(tmpRight.current)
      if (k.left) move.sub(tmpRight.current)
      if (move.lengthSq() > 0) move.normalize().multiplyScalar(speed)
      // suavização
      vel.current.lerp(move, 1 - Math.pow(0.001, dt))
      const [nx, nz] = slideMove(colliders, camera.position.x, camera.position.z, vel.current.x * dt, vel.current.z * dt)
      camera.position.x = nx
      camera.position.z = nz
      // leve balanço ao andar
      const moving = vel.current.lengthSq() > 0.05
      bob.current += dt * (moving ? (k.run ? 11 : 7.5) : 0)
      camera.position.y = EYE_H + (moving ? Math.sin(bob.current) * 0.022 : 0)
    }

    const px = camera.position.x / SCALE
    const pz = camera.position.z / SCALE

    // sala atual → movimento
    let sala = 0
    for (const r of salas) {
      if (px >= r.rect[0] && px <= r.rect[2] && pz >= r.rect[1] && pz <= r.rect[3]) {
        const m = movimentos.find((mv) => mv.salaId === r.id)
        sala = m?.ordem ?? 0
        break
      }
    }

    // obra mais próxima, à frente e na mesma sala (evita detectar através da parede)
    camera.getWorldDirection(tmpDir.current)
    let perto = 0
    let best = Infinity
    for (let n = 1; n <= 10; n++) {
      const a = ancoras[n]
      if (obraMovimento[n] !== sala) continue
      const dx = (a.pos[0] - px) * SCALE
      const dz = (a.pos[1] - pz) * SCALE
      const d = Math.hypot(dx, dz)
      const limite = a.piso ? 3.0 : 3.4
      if (d > limite) continue
      const facing = a.piso ? 1 : (dx * tmpDir.current.x + dz * tmpDir.current.z) / (d || 1)
      if (facing < 0.35) continue
      if (d < best) {
        best = d
        perto = n
      }
    }

    const prev = tourStore.get()
    const moved = Math.abs(prev.pos[0] - px) > 2 || Math.abs(prev.pos[1] - pz) > 2
    tourStore.patch({ perto, sala, ...(moved ? { pos: [Math.round(px), Math.round(pz)] as [number, number] } : {}) })
  })

  return (
    <PointerLockControls
      ref={controls}
      makeDefault
      onLock={() => tourStore.patch({ locked: true, iniciou: true })}
      onUnlock={() => tourStore.patch({ locked: false })}
    />
  )
}
