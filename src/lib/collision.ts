import { limiteExterno, SCALE, SVG_VIEWBOX, WALL_T, walls } from '../data/planta'

export interface AABB {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

/** Caixas das paredes em metros, já expandidas pelo raio do visitante. */
export function buildColliders(radius: number): AABB[] {
  const half = WALL_T / 2 + radius
  return walls.map((s) => {
    const x1 = Math.min(s.a[0], s.b[0]) * SCALE
    const x2 = Math.max(s.a[0], s.b[0]) * SCALE
    const z1 = Math.min(s.a[1], s.b[1]) * SCALE
    const z2 = Math.max(s.a[1], s.b[1]) * SCALE
    return { minX: x1 - half, maxX: x2 + half, minZ: z1 - half, maxZ: z2 + half }
  })
}

const inside = (b: AABB, x: number, z: number) => x > b.minX && x < b.maxX && z > b.minZ && z < b.maxZ

/** Barreira invisível: dentro do prédio ou no pátio da entrada. */
function permitido(x: number, z: number, radius: number) {
  const px = x / SCALE
  const pz = z / SCALE
  const r = radius / SCALE
  const dentro = px > 48 + r && px < 494 - r && pz > 64 + r && pz < 536 + r
  const patio = px > limiteExterno.x1 + r && px < limiteExterno.x2 - r && pz > 536 - r && pz < limiteExterno.y2 - r
  return (dentro || patio) && px > 0 && px < SVG_VIEWBOX.w && pz > 0
}

/**
 * Move o ponto (x,z) por (dx,dz) deslizando nas paredes: resolve X e Z separadamente.
 * Retorna a nova posição.
 */
export function slideMove(colliders: AABB[], x: number, z: number, dx: number, dz: number, radius = 0.32): [number, number] {
  let nx = x + dx
  if (colliders.some((b) => inside(b, nx, z)) || !permitido(nx, z, radius)) nx = x
  let nz = z + dz
  if (colliders.some((b) => inside(b, nx, nz)) || !permitido(nx, nz, radius)) nz = z
  return [nx, nz]
}
