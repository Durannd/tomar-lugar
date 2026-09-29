// Captura screenshots das rotas para revisão visual.
// uso: node scripts/shots.mjs [outDir] [base]
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const out = process.argv[2] ?? 'shots'
const base = process.argv[3] ?? 'http://127.0.0.1:5173'
mkdirSync(out, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
})
const page = await browser.newPage()
page.on('pageerror', (e) => console.log('PAGEERROR', e.message))
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') console.log('CONSOLE', m.type(), m.text().slice(0, 300))
})

const shot = async (name, opts = {}) => {
  await page.screenshot({ path: join(out, name + '.png'), ...opts })
  console.log('shot', name)
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const scrollTo = async (sel, ms = 1400) => {
  await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ behavior: 'instant', block: 'start' }), sel)
  await sleep(ms)
}

// ---- desktop narrativa
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await page.goto(base + '/', { waitUntil: 'networkidle0' })
await page.mouse.move(900, 380)
await sleep(3200)
await shot('01-hero')
await scrollTo('#conceito')
await shot('02-conceito')
await scrollTo('#chao')
await shot('03-mov-chao')
await scrollTo('#obra-1', 1800)
await shot('04-obra-1')
await scrollTo('#obra-3', 1800)
await shot('05-obra-3')
await scrollTo('#obra-5', 1800)
await shot('06-obra-5')
await scrollTo('#obra-10', 1800)
await shot('07-obra-10')
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await sleep(1600)
await shot('08-epilogo')

// ---- mobile narrativa
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await page.goto(base + '/', { waitUntil: 'networkidle0' })
await sleep(3000)
await shot('09-m-hero')
await scrollTo('#obra-2', 1800)
await shot('10-m-obra-2')
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
console.log('mobile horizontal overflow px:', overflow)

// ---- catálogo
await page.setViewport({ width: 1200, height: 1000, deviceScaleFactor: 1 })
await page.goto(base + '/catalogo', { waitUntil: 'networkidle0' })
await sleep(1200)
await shot('11-catalogo-capa')
await page.evaluate(() => window.scrollBy(0, 2300))
await sleep(600)
await shot('12-catalogo-planta')
await page.emulateMediaType('print')
await page.pdf({ path: join(out, 'catalogo.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true })
console.log('pdf ok')
await page.emulateMediaType('screen')

// ---- tour
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await page.goto(base + '/tour', { waitUntil: 'networkidle0' })
await sleep(6000)
await shot('13-tour-overlay')
// simula entrada: esconde overlay e força locked
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find((b) => /Entrar na galeria/.test(b.textContent))
  btn?.click()
})
await sleep(1500)
await shot('14-tour-inside')

await browser.close()
