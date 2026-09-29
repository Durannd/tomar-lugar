/**
 * Geometria da planta baixa da professora, em unidades do SVG (viewBox 760×600).
 * Fonte única para a planta 2D, a galeria 3D e o catálogo impresso.
 * Eixo y cresce para baixo (como no SVG). No 3D, y do SVG vira +z.
 */
export type Pt = [number, number]

export const SVG_VIEWBOX = { w: 760, h: 600 }
/** 1 unidade SVG = 3 cm → prédio ≈ 13,4 m × 14,2 m; portas entre 1,1 m e 2 m */
export const SCALE = 0.03
export const WALL_H = 4.0
export const WALL_T = 0.32

/** Área externa em que o visitante pode andar (svg): pátio diante da entrada. */
export const limiteExterno = { x1: 300, x2: 560, y1: 536, y2: 650 }

export interface Seg {
  a: Pt
  b: Pt
  kind: 'outer' | 'inner'
}

/** Paredes (todas alinhadas aos eixos). */
export const walls: Seg[] = [
  // externas — M470 536H494V64H48V536H404 (vão 404..470 = entrada)
  { a: [470, 536], b: [494, 536], kind: 'outer' },
  { a: [494, 536], b: [494, 64], kind: 'outer' },
  { a: [494, 64], b: [48, 64], kind: 'outer' },
  { a: [48, 64], b: [48, 536], kind: 'outer' },
  { a: [48, 536], b: [404, 536], kind: 'outer' },
  // bloco interno — topo (vão 398..446 = porta superior da Sala B)
  { a: [116, 202], b: [398, 202], kind: 'inner' },
  { a: [446, 202], b: [494, 202], kind: 'inner' },
  // bloco interno — lado esquerdo
  { a: [116, 202], b: [116, 358], kind: 'inner' },
  // bloco interno — base (vãos 146..206 = porta inf. Sala A; 362..404 = porta inf. Sala B)
  { a: [116, 358], b: [146, 358], kind: 'inner' },
  { a: [206, 358], b: [362, 358], kind: 'inner' },
  { a: [404, 358], b: [494, 358], kind: 'inner' },
  // divisória Sala A | Sala B (vão 256..292 = abertura entre salas)
  { a: [350, 202], b: [350, 256], kind: 'inner' },
  { a: [350, 292], b: [350, 358], kind: 'inner' },
  // parede Hall | Galeria Oeste (vão 472..514 = passagem baixa)
  { a: [290, 358], b: [290, 472], kind: 'inner' },
  { a: [290, 514], b: [290, 536], kind: 'inner' },
]

export interface Sala {
  id: string
  nome: string
  /** [x1, y1, x2, y2] */
  rect: [number, number, number, number]
  label: Pt
  labelRot?: number
}

export const salas: Sala[] = [
  { id: 'hall', nome: 'Hall de Entrada', rect: [290, 358, 494, 536], label: [392, 420] },
  { id: 'galeria', nome: 'Galeria Oeste', rect: [48, 358, 290, 536], label: [200, 420] },
  { id: 'corredor-oeste', nome: 'Corredor Oeste', rect: [48, 202, 116, 358], label: [82, 280], labelRot: -90 },
  { id: 'corredor-norte', nome: 'Corredor Norte', rect: [48, 64, 494, 202], label: [270, 120] },
  { id: 'sala-b', nome: 'Sala B · Antessala', rect: [350, 202, 494, 358], label: [422, 330] },
  { id: 'sala-a', nome: 'Sala A · Núcleo', rect: [116, 202, 350, 358], label: [233, 330] },
]

export interface Porta {
  id: string
  nome: string
  a: Pt
  b: Pt
  /** Altura do vão em metros (passagem baixa é menor) */
  alturaM: number
  noPercurso: boolean
}

export const portas: Porta[] = [
  { id: 'entrada', nome: 'Entrada / Saída', a: [404, 536], b: [470, 536], alturaM: 2.6, noPercurso: true },
  { id: 'passagem-baixa', nome: 'Passagem baixa', a: [290, 472], b: [290, 514], alturaM: 1.95, noPercurso: true },
  { id: 'porta-sala-b-cima', nome: 'Porta superior da Sala B', a: [398, 202], b: [446, 202], alturaM: 2.4, noPercurso: true },
  { id: 'abertura-salas', nome: 'Abertura entre as salas', a: [350, 256], b: [350, 292], alturaM: 2.4, noPercurso: true },
  { id: 'porta-sala-a-baixo', nome: 'Porta inferior da Sala A', a: [146, 358], b: [206, 358], alturaM: 2.4, noPercurso: true },
  { id: 'porta-sala-b-baixo', nome: 'Porta inferior da Sala B (acessibilidade)', a: [362, 358], b: [404, 358], alturaM: 2.4, noPercurso: false },
]

/** Percurso sugerido (ida) e saída, como polilinhas SVG. */
export const rotaIda: Pt[] = [
  [437, 575], [437, 493], [300, 493], [82, 493], [82, 133], [422, 133], [422, 274], [212, 274],
]
export const rotaSaida: Pt[] = [
  [176, 294], [176, 493], [437, 493], [437, 575],
]

export interface Ancora {
  /** ponto na parede (ou centro no piso) */
  pos: Pt
  /** normal apontando para dentro do espaço; [0,0] = obra no piso */
  normal: Pt
  /** ponto de vista sugerido para olhar a obra (svg) */
  vista: Pt
  piso?: boolean
}

export const ancoras: Record<number, Ancora> = {
  1: { pos: [449, 358], normal: [0, 1], vista: [449, 470] },
  2: { pos: [216, 536], normal: [0, -1], vista: [216, 450] },
  3: { pos: [48, 470], normal: [1, 0], vista: [150, 470] },
  4: { pos: [48, 330], normal: [1, 0], vista: [100, 330] },
  5: { pos: [82, 258], normal: [0, 0], vista: [82, 340], piso: true },
  6: { pos: [196, 64], normal: [0, 1], vista: [196, 150] },
  7: { pos: [336, 64], normal: [0, 1], vista: [336, 150] },
  8: { pos: [494, 280], normal: [-1, 0], vista: [430, 280] },
  9: { pos: [350, 229], normal: [1, 0], vista: [420, 229] },
  10: { pos: [116, 280], normal: [1, 0], vista: [230, 280] },
}

export interface Placa {
  movimento: number
  pos: Pt
  normal: Pt
}

/** Placa de parede no início de cada movimento. */
export const placas: Placa[] = [
  { movimento: 1, pos: [494, 450], normal: [-1, 0] },
  { movimento: 2, pos: [290, 430], normal: [-1, 0] },
  { movimento: 3, pos: [116, 345], normal: [-1, 0] },
  { movimento: 4, pos: [202, 202], normal: [0, -1] },
  { movimento: 5, pos: [470, 202], normal: [0, 1] },
  { movimento: 6, pos: [350, 325], normal: [-1, 0] },
]

/** Aviso no hall: o percurso começa pela passagem da esquerda. */
export const avisoHall = { pos: [290, 425] as Pt, normal: [1, 0] as Pt }

/** Fenda no piso do Corredor Oeste (Shibboleth), polilinha svg. */
export const fenda: Pt[] = [
  [80, 212], [85, 223], [78, 234], [84, 245], [79, 256], [86, 267], [80, 278], [85, 289], [80, 300],
]

/** Ponto de partida do visitante no tour, fora da entrada, olhando para dentro. */
export const spawn = { pos: [437, 610] as Pt, yaw: 0 }
