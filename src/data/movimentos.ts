export type MovimentoId = 'chao' | 'partida' | 'fronteira' | 'raiz' | 'reivindicacao' | 'lugar'

export interface Movimento {
  id: MovimentoId
  ordem: number
  titulo: string
  espaco: string
  salaId: string
  frase: string
  texto: string
  obras: number[]
}

export const movimentos: Movimento[] = [
  {
    id: 'chao', ordem: 1, titulo: 'Chão', espaco: 'Hall de Entrada', salaId: 'hall',
    frase: 'Pertencer a um lugar: o corpo, o gesto e a terra de alguém que está em casa.',
    texto: 'Pertencer a um lugar: o corpo, o gesto e a terra de alguém que está em casa. É o ponto de partida e também o de chegada.',
    obras: [1],
  },
  {
    id: 'partida', ordem: 2, titulo: 'Partida', espaco: 'Galeria Oeste', salaId: 'galeria',
    frase: 'Perder o lugar: a seca que expulsa, o navio que leva embora.',
    texto: 'Perder o lugar: a seca que expulsa, o navio que leva embora. O visitante sai do hall por uma passagem baixa, como quem deixa a casa.',
    obras: [2, 3],
  },
  {
    id: 'fronteira', ordem: 3, titulo: 'Fronteira', espaco: 'Corredor Oeste', salaId: 'corredor-oeste',
    frase: 'O espaço mais estreito da planta abriga quem vive “entre”: nem cá, nem lá.',
    texto: 'O espaço mais estreito da planta abriga quem vive “entre”: nem cá, nem lá. A sensação física de aperto é parte da leitura.',
    obras: [4, 5],
  },
  {
    id: 'raiz', ordem: 4, titulo: 'Raiz', espaco: 'Corredor Norte', salaId: 'corredor-norte',
    frase: 'Pertencimento reconstruído pela memória de família e pela comunidade.',
    texto: 'O corredor se alarga: pertencimento reconstruído pela memória de família e pela comunidade. Depois da perda, a reconstrução.',
    obras: [6, 7],
  },
  {
    id: 'reivindicacao', ordem: 5, titulo: 'Reivindicação', espaco: 'Sala B — Antessala', salaId: 'sala-b',
    frase: 'Quem foi excluído da história da arte reivindica seu lugar nela.',
    texto: 'Obras sobre quem foi excluído da história da arte e reivindica seu lugar nela. É a antessala do núcleo.',
    obras: [8, 9],
  },
  {
    id: 'lugar', ordem: 6, titulo: 'Lugar conquistado', espaco: 'Sala A — Núcleo', salaId: 'sala-a',
    frase: 'Artemisia sozinha, como clímax.',
    texto: 'Artemisia sozinha, como clímax. A única obra da sala, com a parede inteira para ela.',
    obras: [10],
  },
]
