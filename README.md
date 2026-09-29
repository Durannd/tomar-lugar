# Tomar Lugar — exposição virtual

Site da exposição **"Tomar Lugar — pertencimento, exclusão e a conquista de um espaço"**, curadoria de Ricael Menezes (Artes · Diálogos que perpassam o teatro ou as artes visuais). Temática: Pertencimento. Artista recebida: Artemisia Gentileschi.

Três rotas, um único front-end (Vite + React + TypeScript):

| Rota | O que é |
|---|---|
| `/` | Narrativa em scroll: hero, conceito curatorial, seis movimentos, dez obras e planta baixa que se desenha conforme a leitura |
| `/tour` | Tour 3D em primeira pessoa (React Three Fiber): W A S D anda, mouse olha, Shift corre, E ou clique abre a ficha da obra |
| `/catalogo` | Catálogo imprimível (capa, textos, planta com legenda, uma ficha por obra, quadro de posicionamento, fontes). Ctrl+P → Salvar como PDF, A4, com fundos ativados |

## Rodar

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera dist/ (base './', pronto para Vercel, Netlify ou GitHub Pages)
npm run preview
```

Deploy: `vercel.json` e `public/_redirects` já fazem o fallback de SPA. Para GitHub Pages sem fallback, use apenas a rota `/` ou troque para `HashRouter`.

## Onde está o conteúdo

Todo o conteúdo fixo da spec vive em `src/data/`:

- `obras.ts` — as 10 obras (ficha técnica, justificativa, posição na planta, crédito da imagem).
- `movimentos.ts` — os 6 movimentos e os textos de placa.
- `textos.ts` — título, autor, texto curatorial, narrativa e fontes.
- `planta.ts` — geometria da planta baixa da professora (paredes, portas, salas, percurso, âncoras das obras). É a fonte única para a planta 2D, a galeria 3D e o catálogo.

Imagens das obras em `public/obras/` (máx. 1600 px). Velázquez, Artemisia e Almeida Júnior são domínio público; as demais estão aqui como uso educacional com crédito completo.

## Scripts auxiliares

- `node scripts/optimize-images.mjs` — reduz as imagens de `public/obras/` para 1600 px.
- `node scripts/shots.mjs <pasta>` — captura telas de todas as rotas e gera o PDF do catálogo (usa o Chrome instalado via puppeteer-core; o servidor de dev precisa estar rodando).
- `node scripts/tour-walk.mjs <pasta>` — fotografa o tour 3D do ponto de vista de cada obra.

## A confirmar antes da entrega (da spec)

- Técnica exata de *Navio de Emigrantes* (Segall).
- Coleção atual do autorretrato de Frida Kahlo (coleção particular).
