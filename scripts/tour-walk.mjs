// Fotografa o tour 3D do ponto de vista de cada obra (usa window.__tour, só em dev).
// uso: node scripts/tour-walk.mjs [outDir] [base]
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const out = process.argv[2] ?? 'shots'
const base = process.argv[3] ?? 'http://127.0.0.1:5173'
mkdirSync(out, { recursive: true })

// [svg x, svg y, yaw]: yaw 0 olha para −z (norte da planta); +yaw gira para a esquerda (oeste)
const vistas = [
  ['00-fora', 437, 630, 0],
  ['01-hall', 449, 470, 0],
  ['01b-hall-aviso', 380, 425, Math.PI / 2],
  ['02-galeria-portinari', 216, 440, Math.PI],
  ['00b-fora-tras', 437, 630, Math.PI],
  ['00c-patio', 437, 560, Math.PI],
  ['03-galeria-segall', 150, 470, Math.PI / 2],
  ['04-corredor-frida', 100, 330, Math.PI / 2],
  ['05-corredor-fenda', 82, 345, 0],
  ['06-norte-paulino', 196, 150, 0],
  ['07-norte-ringgold', 336, 150, 0],
  ['08-salab-velazquez', 430, 280, -Math.PI / 2],
  ['09-salab-esbell', 420, 229, Math.PI / 2],
  ['10-salaa-artemisia', 200, 280, Math.PI / 2],
  ['10b-salaa-abertura', 340, 274, Math.PI / 2],
]

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
})
const page = await browser.newPage()
page.on('pageerror', (e) => console.log('PAGEERROR', e.message))
page.on('console', (m) => {
  if (m.type() === 'error') console.log('CONSOLE', m.text().slice(0, 200))
})
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 })
await page.goto(base + '/tour', { waitUntil: 'domcontentloaded', timeout: 90000 })
await sleep(12000)
await page.evaluate(() => window.__tour.patch({ locked: true, iniciou: true }))
await sleep(500)
for (const [name, x, y, yaw] of vistas) {
  await page.evaluate((x, y, yaw) => window.__tour.patch({ teleport: { pos: [x, y], yaw } }), x, y, yaw)
  await sleep(900)
  const st = await page.evaluate(() => ({ perto: window.__tour.get().perto, sala: window.__tour.get().sala, pos: window.__tour.get().pos }))
  await page.screenshot({ path: join(out, `tour-${name}.png`) })
  console.log('shot', name, JSON.stringify(st))
}
// info card
await page.evaluate(() => window.__tour.patch({ aberta: 10 }))
await sleep(800)
await page.screenshot({ path: join(out, 'tour-card.png') })
await browser.close()
