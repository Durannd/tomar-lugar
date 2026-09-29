import * as THREE from 'three'

/** Ruído simples e determinístico (value noise) para texturas procedurais. */
function noise2(x: number, y: number, seed = 0) {
  const s = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453
  return s - Math.floor(s)
}

function smoothNoise(x: number, y: number, seed = 0) {
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const fx = x - x0
  const fy = y - y0
  const sx = fx * fx * (3 - 2 * fx)
  const sy = fy * fy * (3 - 2 * fy)
  const n00 = noise2(x0, y0, seed)
  const n10 = noise2(x0 + 1, y0, seed)
  const n01 = noise2(x0, y0 + 1, seed)
  const n11 = noise2(x0 + 1, y0 + 1, seed)
  return (n00 * (1 - sx) + n10 * sx) * (1 - sy) + (n01 * (1 - sx) + n11 * sx) * sy
}

function fbm(x: number, y: number, seed = 0, oct = 4) {
  let v = 0
  let a = 0.5
  let f = 1
  for (let i = 0; i < oct; i++) {
    v += a * smoothNoise(x * f, y * f, seed + i)
    a *= 0.5
    f *= 2
  }
  return v
}

function makeCanvas(size: number) {
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  return c
}

function finish(c: HTMLCanvasElement, repeat: [number, number], srgb = true) {
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(repeat[0], repeat[1])
  t.anisotropy = 8
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  t.needsUpdate = true
  return t
}

/** Piso de tábuas de madeira escura (cor + rugosidade). */
export function woodFloorTextures(size = 512) {
  const color = makeCanvas(size)
  const rough = makeCanvas(size)
  const cc = color.getContext('2d')!
  const rc = rough.getContext('2d')!
  const plankH = size / 6
  const img = cc.createImageData(size, size)
  const rimg = rc.createImageData(size, size)
  for (let y = 0; y < size; y++) {
    const plank = Math.floor(y / plankH)
    const offset = (plank * 173) % size
    const seed = plank * 7
    const edge = y % plankH < 2 || y % plankH > plankH - 2
    for (let x = 0; x < size; x++) {
      const xx = (x + offset) % size
      const grain = fbm(xx / 18, (y / 90) + seed, seed, 3)
      const fine = smoothNoise(xx / 3, y / 1.5, seed) * 0.08
      let v = 0.32 + grain * 0.28 + fine
      const joint = xx % (size / 2) < 2
      if (edge || joint) v *= 0.45
      const r = 78 * v + 18
      const g = 52 * v + 10
      const b = 34 * v + 6
      const i = (y * size + x) * 4
      img.data[i] = r
      img.data[i + 1] = g
      img.data[i + 2] = b
      img.data[i + 3] = 255
      const ro = 150 + (1 - v) * 80 + (edge || joint ? 40 : 0)
      rimg.data[i] = rimg.data[i + 1] = rimg.data[i + 2] = Math.min(255, ro)
      rimg.data[i + 3] = 255
    }
  }
  cc.putImageData(img, 0, 0)
  rc.putImageData(rimg, 0, 0)
  return { map: finish(color, [8, 8]), roughnessMap: finish(rough, [8, 8], false) }
}

/**
 * Reboco de parede escuro com relevo: cor, rugosidade e mapa de normais
 * derivado de um campo de altura (manchas de fbm + grão fino + microfissuras).
 */
export function plasterTextures(size = 1024) {
  const color = makeCanvas(size)
  const rough = makeCanvas(size)
  const normal = makeCanvas(size)
  const cc = color.getContext('2d')!
  const rc = rough.getContext('2d')!
  const nc = normal.getContext('2d')!
  const img = cc.createImageData(size, size)
  const rimg = rc.createImageData(size, size)
  const nimg = nc.createImageData(size, size)

  // campo de altura
  const height = new Float32Array(size * size)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const macro = fbm(x / 260, y / 260, 3, 5)
      const meso = fbm(x / 22, y / 22, 11, 4)
      const grain = smoothNoise(x / 1.6, y / 1.6, 21)
      // trincas finas: linhas onde o ruído cruza um limiar estreito
      const c = fbm(x / 45, y / 45, 31, 3)
      const crack = Math.abs(c - 0.5) < 0.0015 ? -0.12 : 0
      height[y * size + x] = macro * 0.3 + meso * 0.45 + grain * 0.25 + crack
    }
  }

  const strength = 2.2
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = y * size + x
      const hL = height[y * size + ((x - 1 + size) % size)]
      const hR = height[y * size + ((x + 1) % size)]
      const hU = height[((y - 1 + size) % size) * size + x]
      const hD = height[((y + 1) % size) * size + x]
      const dx = (hR - hL) * strength
      const dy = (hD - hU) * strength
      const len = Math.hypot(dx, dy, 1)
      const nx = -dx / len
      const ny = -dy / len
      const nz = 1 / len
      const o = i * 4
      nimg.data[o] = (nx * 0.5 + 0.5) * 255
      nimg.data[o + 1] = (ny * 0.5 + 0.5) * 255
      nimg.data[o + 2] = (nz * 0.5 + 0.5) * 255
      nimg.data[o + 3] = 255

      const h = height[i]
      const v = 0.42 + h * 0.5
      img.data[o] = 74 * v + 14
      img.data[o + 1] = 64 * v + 11
      img.data[o + 2] = 54 * v + 9
      img.data[o + 3] = 255
      const ro = 205 + (1 - h) * 40
      rimg.data[o] = rimg.data[o + 1] = rimg.data[o + 2] = Math.min(255, ro)
      rimg.data[o + 3] = 255
    }
  }
  cc.putImageData(img, 0, 0)
  rc.putImageData(rimg, 0, 0)
  nc.putImageData(nimg, 0, 0)
  const rep: [number, number] = [1, 1]
  return { map: finish(color, rep), roughnessMap: finish(rough, rep, false), normalMap: finish(normal, rep, false) }
}

/** Pedra do pátio externo. */
export function stoneTextures(size = 512) {
  const color = makeCanvas(size)
  const cc = color.getContext('2d')!
  const img = cc.createImageData(size, size)
  const tile = size / 4
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const row = Math.floor(y / tile)
      const xx = (x + (row % 2) * (tile / 2)) % size
      const edge = xx % tile < 3 || y % tile < 3
      const n = fbm(x / 40, y / 40, 41, 4)
      let v = 0.35 + n * 0.3
      if (edge) v *= 0.5
      const i = (y * size + x) * 4
      img.data[i] = 60 * v + 10
      img.data[i + 1] = 58 * v + 10
      img.data[i + 2] = 56 * v + 10
      img.data[i + 3] = 255
    }
  }
  cc.putImageData(img, 0, 0)
  return { map: finish(color, [6, 6]) }
}

/** Rachadura escura sobre fundo transparente (decal para o piso). */
export function crackTexture(w = 256, h = 1024) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!
  ctx.clearRect(0, 0, w, h)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  const drawCrack = (x0: number, width: number, alpha: number, jitter: number, seed: number) => {
    ctx.beginPath()
    let x = x0
    ctx.moveTo(x, 0)
    for (let y = 0; y <= h; y += 14) {
      x += (noise2(y, seed) - 0.5) * jitter
      ctx.lineTo(x, y)
    }
    ctx.strokeStyle = `rgba(4,3,2,${alpha})`
    ctx.lineWidth = width
    ctx.stroke()
  }
  // borda clara (concreto lascado) para a fenda ler no piso escuro
  ctx.globalCompositeOperation = 'source-over'
  ctx.strokeStyle = 'rgba(190,178,160,0.55)'
  ctx.lineWidth = 30
  let bx = w / 2
  ctx.beginPath()
  ctx.moveTo(bx, 0)
  for (let y = 0; y <= h; y += 14) {
    bx += (noise2(y, 1) - 0.5) * 22
    ctx.lineTo(bx, y)
  }
  ctx.stroke()
  drawCrack(w / 2, 14, 0.98, 22, 1)
  drawCrack(w / 2 + 4, 5, 0.7, 30, 2)
  // rachaduras secundárias
  for (let i = 0; i < 12; i++) {
    const y = (i + 0.5) * (h / 12)
    ctx.beginPath()
    ctx.moveTo(w / 2, y)
    const dir = i % 2 ? 1 : -1
    ctx.lineTo(w / 2 + dir * (20 + noise2(i, 5) * 40), y + (noise2(i, 6) - 0.5) * 40)
    ctx.strokeStyle = 'rgba(4,3,2,0.55)'
    ctx.lineWidth = 2
    ctx.stroke()
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.needsUpdate = true
  return t
}

// ---- cache: as texturas procedurais são caras; gera uma vez por tamanho ----
const cache = new Map<string, unknown>()
function cached<T>(key: string, make: () => T): T {
  if (!cache.has(key)) cache.set(key, make())
  return cache.get(key) as T
}
export const getWoodFloor = (size: number) => cached(`wood${size}`, () => woodFloorTextures(size))
export const getPlaster = (size: number) => cached(`plaster${size}`, () => plasterTextures(size))
export const getStone = () => cached('stone', () => stoneTextures(512))
export const getCrack = () => cached('crack', () => crackTexture())
