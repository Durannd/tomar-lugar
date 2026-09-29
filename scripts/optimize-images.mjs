// Reduz as reproduções para no máximo 1600px de largura/altura, JPEG q82 progressivo.
// uso: node scripts/optimize-images.mjs
import sharp from 'sharp'
import { readdirSync, statSync, renameSync } from 'node:fs'
import { join } from 'node:path'

const dir = 'public/obras'
const MAX = 1600
for (const f of readdirSync(dir).filter((n) => /\.(jpe?g|png)$/i.test(n))) {
  const src = join(dir, f)
  const before = statSync(src).size
  const meta = await sharp(src).metadata()
  const tmp = src + '.tmp'
  await sharp(src)
    .rotate()
    .resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, progressive: true, mozjpeg: true })
    .toFile(tmp)
  renameSync(tmp, src.replace(/\.png$/i, '.jpg'))
  const after = statSync(src.replace(/\.png$/i, '.jpg')).size
  const m2 = await sharp(src.replace(/\.png$/i, '.jpg')).metadata()
  console.log(f, `${meta.width}x${meta.height}`, '→', `${m2.width}x${m2.height}`, `${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB`, 'ratio', (m2.width / m2.height).toFixed(2))
}
