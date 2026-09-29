import { SCALE, WALL_T, walls, type Pt, type Seg } from '../data/planta'

/** SVG [x,y] → mundo 3D [x, 0, z] (y do SVG vira z). */
export const svgToWorld = (p: Pt, y = 0): [number, number, number] => [p[0] * SCALE, y, p[1] * SCALE]

/** Rotação Y de um objeto cuja frente aponta na direção `normal` (svg). */
export const yawFromNormal = (n: Pt) => Math.atan2(n[0], n[1])

export interface WallBox {
  center: [number, number, number]
  size: [number, number, number]
  rotY: number
  kind: Seg['kind']
  length: number
}

/** Converte cada segmento em uma caixa (centro, tamanho, rotação). */
export function wallBoxes(wallH: number, segs: Seg[] = walls): WallBox[] {
  return segs.map((s) => {
    const dx = s.b[0] - s.a[0]
    const dy = s.b[1] - s.a[1]
    const len = Math.hypot(dx, dy) * SCALE + WALL_T
    const horizontal = Math.abs(dx) > Math.abs(dy)
    return {
      center: [((s.a[0] + s.b[0]) / 2) * SCALE, wallH / 2, ((s.a[1] + s.b[1]) / 2) * SCALE],
      size: horizontal ? [len, wallH, WALL_T] : [WALL_T, wallH, len],
      rotY: 0,
      kind: s.kind,
      length: len,
    }
  })
}

export const polylineToPath = (pts: Pt[]) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]} ${p[1]}`).join(' ')

export const polylineLength = (pts: Pt[]) =>
  pts.reduce((acc, p, i) => (i === 0 ? 0 : acc + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1])), 0)

/** Comprimento acumulado da polilinha até o ponto mais próximo de `target`. */
export function lengthUntilNearest(pts: Pt[], target: Pt) {
  let best = { d: Infinity, len: 0 }
  let acc = 0
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1]
    const [bx, by] = pts[i]
    const segLen = Math.hypot(bx - ax, by - ay)
    const t = Math.max(0, Math.min(1, ((target[0] - ax) * (bx - ax) + (target[1] - ay) * (by - ay)) / (segLen * segLen || 1)))
    const px = ax + t * (bx - ax)
    const py = ay + t * (by - ay)
    const d = Math.hypot(target[0] - px, target[1] - py)
    if (d < best.d) best = { d, len: acc + t * segLen }
    acc += segLen
  }
  return best.len
}
