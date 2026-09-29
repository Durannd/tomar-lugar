import type { MovimentoId } from './movimentos'

export interface Obra {
  n: number
  artista: string
  titulo: string
  ano: string
  tecnica: string
  acervo: string
  movimento: MovimentoId
  /** Onde fica na planta (seção 6 da spec) */
  onde: string
  /** Por que aqui (seção 6 da spec) */
  porQueAqui: string
  /** Justificativa em relação à temática (seção 5 da spec) */
  justificativa: string
  /** Resumo para placa de parede e info card */
  placa: string
  imagem: string
  credito: string
  dominioPublico: boolean
  /** Proporção largura/altura da imagem (preenchida ao baixar) */
  proporcao: number
  /** Largura física aproximada em metros, para o tour 3D */
  larguraM: number
  aConfirmar?: string
}

export const obras: Obra[] = [
  {
    n: 1,
    artista: 'Almeida Júnior',
    titulo: 'Caipira picando fumo',
    ano: '1893',
    tecnica: 'Óleo sobre tela',
    acervo: 'Pinacoteca de São Paulo',
    movimento: 'chao',
    onde: 'Hall, parede em frente à entrada',
    porQueAqui: 'É a primeira imagem vista: o “estar em casa” como ponto de partida e de chegada.',
    justificativa:
      'Um homem sentado na soleira da própria casa de pau a pique, pés descalços no chão de terra, picando fumo sem pressa. Pertencer aqui é intimidade com o lugar: o corpo sabe onde está. Almeida Júnior pintou o caipira paulista com dignidade, e não como curiosidade exótica, o que era raro na arte acadêmica da época. É a imagem do “estar em casa” que as próximas salas vão perder e reconquistar.',
    placa: 'Pertencer é intimidade com o lugar: o corpo sabe onde está. O “estar em casa” que as próximas salas vão perder e reconquistar.',
    imagem: '/obras/01-almeida-junior.jpg',
    credito: 'Almeida Júnior, Caipira picando fumo, 1893. Pinacoteca de São Paulo. Domínio público (Wikimedia Commons).',
    dominioPublico: true,
    proporcao: 0.70,
    larguraM: 1.41,
  },
  {
    n: 2,
    artista: 'Candido Portinari',
    titulo: 'Retirantes',
    ano: '1944',
    tecnica: 'Óleo sobre tela',
    acervo: 'MASP, São Paulo',
    movimento: 'partida',
    onde: 'Galeria Oeste, parede sul, logo após a passagem',
    porQueAqui: 'A passagem baixa do hall é o gesto de deixar a casa; a primeira coisa do outro lado é a família que partiu.',
    justificativa:
      'Uma família nordestina expulsa pela seca, corpos magros, crianças no colo, urubus no céu e uma paisagem sem nada para ficar. É o avesso da Obra 1: gente que pertencia a uma terra e foi obrigada a deixá-la. Portinari cresceu em Brodowski (SP), por onde passavam retirantes, e transformou essa lembrança em denúncia.',
    placa: 'O avesso do “estar em casa”: gente que pertencia a uma terra e foi obrigada a deixá-la.',
    imagem: '/obras/02-portinari.jpg',
    credito: 'Candido Portinari, Retirantes, 1944. MASP, São Paulo (reprodução via Google Arts & Culture). © Projeto Portinari. Uso educacional.',
    dominioPublico: false,
    proporcao: 0.94,
    larguraM: 1.80,
  },
  {
    n: 3,
    artista: 'Lasar Segall',
    titulo: 'Navio de Emigrantes',
    ano: '1939–41',
    tecnica: 'Óleo sobre tela',
    acervo: 'Museu Lasar Segall, São Paulo',
    movimento: 'partida',
    onde: 'Galeria Oeste, parede oeste',
    porQueAqui: 'Fica de frente para quem caminha e aponta para o corredor: depois da partida vem a travessia.',
    justificativa:
      'Um convés lotado de pessoas espremidas, sem rosto definido, em trânsito. O navio é um “não lugar”: já não se pertence à origem e ainda não se pertence ao destino. Segall, judeu nascido em Vilna (Lituânia), imigrou para o Brasil e pintou a obra durante a Segunda Guerra, quando milhões eram deslocados na Europa. Ao lado de Portinari, mostra que a perda do lugar pode vir da natureza ou da história.',
    placa: 'O navio é um “não lugar”: já não se pertence à origem e ainda não se pertence ao destino.',
    imagem: '/obras/03-segall.jpg',
    credito: 'Lasar Segall, Navio de Emigrantes, 1939–41. Museu Lasar Segall, São Paulo. Uso educacional.',
    dominioPublico: false,
    proporcao: 1.22,
    larguraM: 2.30,
    aConfirmar: 'Técnica exata da obra.',
  },
  {
    n: 4,
    artista: 'Frida Kahlo',
    titulo: 'Autorretrato na fronteira entre o México e os Estados Unidos',
    ano: '1932',
    tecnica: 'Óleo sobre metal',
    acervo: 'Coleção particular',
    movimento: 'fronteira',
    onde: 'Corredor Oeste, parede externa',
    porQueAqui: 'O espaço mais estreito da planta recebe a obra sobre viver entre dois países.',
    justificativa:
      'Frida se pinta em pé sobre um marco de fronteira. De um lado, o México: ruínas pré-hispânicas, sol, lua e plantas com raízes. Do outro, os EUA: chaminés de fábrica, arranha-céus e máquinas. Ela pintou a obra em Detroit, sentindo-se deslocada, e a imagem traduz a experiência de pertencer a dois mundos sem estar inteira em nenhum.',
    placa: 'Pertencer a dois mundos sem estar inteira em nenhum.',
    imagem: '/obras/04-frida-kahlo.jpg',
    credito: 'Frida Kahlo, Autorretrato na fronteira entre o México e os Estados Unidos, 1932. Coleção particular. © Banco de México / Fideicomiso Diego Rivera y Frida Kahlo. Uso educacional.',
    dominioPublico: false,
    proporcao: 1.15,
    larguraM: 0.55,
    aConfirmar: 'Coleção atual da obra (coleção particular).',
  },
  {
    n: 5,
    artista: 'Doris Salcedo',
    titulo: 'Shibboleth',
    ano: '2007',
    tecnica: 'Instalação: uma fenda de cerca de 167 m aberta no piso do Turbine Hall',
    acervo: 'Tate Modern, Londres',
    movimento: 'fronteira',
    onde: 'Corredor Oeste, no piso',
    porQueAqui: 'A fenda percorre o chão do corredor: o visitante caminha literalmente ao lado de uma fronteira.',
    justificativa:
      'A artista colombiana rachou o chão do museu de ponta a ponta. O título vem de um episódio bíblico em que uma palavra, pronunciada “errado”, denunciava o estrangeiro e o condenava. A obra fala das fronteiras invisíveis (racismo, xenofobia) que dividem quem pertence de quem é excluído, mesmo dentro do mesmo espaço. Com Frida, fecha o movimento da fronteira: uma visível, outra invisível.',
    placa: 'As fronteiras invisíveis que dividem quem pertence de quem é excluído, mesmo dentro do mesmo espaço.',
    imagem: '/obras/05-salcedo.jpg',
    credito: 'Doris Salcedo, Shibboleth, 2007. Vista da instalação no Turbine Hall, Tate Modern, Londres. © Doris Salcedo. Uso educacional.',
    dominioPublico: false,
    proporcao: 0.75,
    larguraM: 1.6,
  },
  {
    n: 6,
    artista: 'Rosana Paulino',
    titulo: 'Parede da Memória',
    ano: '1994–2015',
    tecnica: 'Instalação: 1.500 patuás de tecido costurado com 11 fotografias de família da artista',
    acervo: 'Pinacoteca de São Paulo',
    movimento: 'raiz',
    onde: 'Corredor Norte, trecho longo da parede externa',
    porQueAqui: 'A instalação de 1.500 peças pede a parede mais longa; os rostos acompanham a caminhada.',
    justificativa:
      'O patuá é um amuleto de proteção das religiões de matriz africana. Paulino repete os rostos de seus familiares negros até formar uma parede que olha de volta para o visitante. Pertencer aqui é linhagem: saber de onde se vem. A obra também denuncia a invisibilidade histórica da população afro-brasileira, que a artista, paulistana, transforma em presença coletiva.',
    placa: 'Pertencer é linhagem: saber de onde se vem. Uma parede de rostos que olha de volta.',
    imagem: '/obras/06-rosana-paulino.jpg',
    credito: 'Rosana Paulino, Parede da Memória, 1994–2015. Vista da instalação (foto: Revista Continente). Pinacoteca de São Paulo. © Rosana Paulino. Uso educacional.',
    dominioPublico: false,
    proporcao: 1.52,
    larguraM: 4.2,
  },
  {
    n: 7,
    artista: 'Faith Ringgold',
    titulo: 'Tar Beach',
    ano: '1988',
    tecnica: 'Acrílica sobre tela com bordas de tecido (“story quilt”, colcha narrativa)',
    acervo: 'Guggenheim, Nova York',
    movimento: 'raiz',
    onde: 'Corredor Norte, perto da porta da Sala B',
    porQueAqui: 'Uma família tomando posse da cidade é a última imagem antes das salas fechadas.',
    justificativa:
      'No terraço do prédio no Harlem, a “praia de piche”, uma família negra janta em uma noite de verão, e a menina Cassie sonha voar sobre a cidade. Na história escrita na colcha, voar é tomar posse de uma cidade que excluía sua família. A colcha, técnica doméstica e coletiva, faz par com a costura de Paulino: pertencimento feito à mão, em comunidade.',
    placa: 'Voar é tomar posse de uma cidade que excluía sua família. Pertencimento feito à mão, em comunidade.',
    imagem: '/obras/07-faith-ringgold.jpg',
    credito: 'Faith Ringgold, Tar Beach, 1988. Solomon R. Guggenheim Museum, Nova York. © Faith Ringgold / ARS. Uso educacional.',
    dominioPublico: false,
    proporcao: 0.93,
    larguraM: 1.74,
  },
  {
    n: 8,
    artista: 'Diego Velázquez',
    titulo: 'Juan de Pareja',
    ano: '1650',
    tecnica: 'Óleo sobre tela, 81,3 × 69,9 cm',
    acervo: 'The Metropolitan Museum of Art, Nova York',
    movimento: 'reivindicacao',
    onde: 'Sala B, parede leste (à esquerda de quem entra)',
    porQueAqui: 'Abre a antessala com um retrato barroco contemporâneo de Artemisia.',
    justificativa:
      'Retrato do assistente de origem mourisca que Velázquez escravizava, pintado em Roma e exposto no Panteão em 1650 com grande aclamação. Pareja aparece com o porte e a dignidade de um nobre. Em 1650 Velázquez assinou sua carta de liberdade, válida a partir de 1654, e Pareja se tornou pintor reconhecido; anos depois, ele se pintou dentro da própria obra A vocação de São Mateus (1661, Prado). É contemporâneo de Artemisia: outra pessoa que, no século XVII, não “deveria” pertencer ao mundo da pintura e passou a pertencer.',
    placa: 'Outra pessoa que, no século XVII, não “deveria” pertencer ao mundo da pintura e passou a pertencer.',
    imagem: '/obras/08-velazquez.jpg',
    credito: 'Diego Velázquez, Juan de Pareja, 1650. The Metropolitan Museum of Art, Nova York. Domínio público (Open Access, The Met).',
    dominioPublico: true,
    proporcao: 0.86,
    larguraM: 0.70,
  },
  {
    n: 9,
    artista: 'Jaider Esbell',
    titulo: 'Carta ao Velho Mundo',
    ano: '2018–19',
    tecnica: 'Intervenção com desenho e pintura sobre cerca de 400 páginas de um livro de história da arte europeia',
    acervo: 'Exibida na 34ª Bienal de São Paulo (2021); adquirida pelo Centre Pompidou, Paris',
    movimento: 'reivindicacao',
    onde: 'Sala B, parede que divide as salas',
    porQueAqui: 'Reescrever a história da arte é literalmente a parede que dá acesso a Artemisia.',
    justificativa:
      'Esbell, artista Macuxi de Roraima, desenhou e escreveu por cima das imagens consagradas do cânone europeu, sobrepondo grafismos e seres indígenas e denunciando a colonização. É a reivindicação mais direta da exposição: se a história da arte não incluiu os povos indígenas, ele se inclui à força, nas próprias páginas. Prepara o visitante para Artemisia, que fez o mesmo gesto quatro séculos antes, por outros meios.',
    placa: 'Se a história da arte não incluiu os povos indígenas, ele se inclui à força, nas próprias páginas.',
    imagem: '/obras/09-jaider-esbell.jpg',
    credito: 'Jaider Esbell, Carta ao Velho Mundo, 2018–19. Vista da instalação na 34ª Bienal de São Paulo, 2021. Foto: Levi Fanan / Fundação Bienal de São Paulo. Centre Pompidou, Paris. Uso educacional.',
    dominioPublico: false,
    proporcao: 1.50,
    larguraM: 1.0,
  },
  {
    n: 10,
    artista: 'Artemisia Gentileschi',
    titulo: 'Autorretrato como Alegoria da Pintura',
    ano: 'c. 1638–39',
    tecnica: 'Óleo sobre tela, cerca de 96,5 × 73,7 cm',
    acervo: 'Royal Collection, Reino Unido',
    movimento: 'lugar',
    onde: 'Sala A, parede oeste, em frente à abertura',
    porQueAqui: 'Quem atravessa a abertura dá de cara com ela, sozinha na sala mais protegida da planta.',
    justificativa:
      'Artemisia se mostra trabalhando: mangas arregaçadas, cabelo desalinhado, pincel no ar, corrente de ouro com pingente de máscara (símbolo da imitação). Ela segue a descrição da Pintura no manual de Cesare Ripa, mas omite a mordaça que o modelo previa. Uma mulher, num tempo em que mulheres mal entravam nas academias, se declara não “uma pintora”, mas a própria Pintura. É o ponto de chegada da exposição: não esperar ser convidada a pertencer, e ocupar o lugar.',
    placa: 'Não “uma pintora”, mas a própria Pintura. Não esperar ser convidada a pertencer, e ocupar o lugar.',
    imagem: '/obras/10-artemisia.jpg',
    credito: 'Artemisia Gentileschi, Autorretrato como Alegoria da Pintura (La Pittura), c. 1638–39. Royal Collection Trust, Reino Unido. Domínio público (Wikimedia Commons).',
    dominioPublico: true,
    proporcao: 0.74,
    larguraM: 0.74,
  },
]

export const obraPorNumero = (n: number) => obras.find((o) => o.n === n)!
