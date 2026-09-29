// Procura um asset no Google Arts & Culture e baixa a imagem principal (og:image) em alta.
// uso: node scripts/find-gac.mjs "<busca>" <arquivo de saída>
import puppeteer from 'puppeteer-core'
import { writeFileSync } from 'node:fs'

const [q, outFile] = process.argv.slice(2)
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
const page = await browser.newPage()
await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) TomarLugarExpo/1.0 (educational; ricaelmenezes@gmail.com)')
await page.goto('https://artsandculture.google.com/search/asset?q=' + encodeURIComponent(q), { waitUntil: 'networkidle2', timeout: 60000 })
await new Promise((r) => setTimeout(r, 3000))
const links = await page.evaluate(() => [...document.querySelectorAll('a[href*="/asset/"]')].map((a) => ({ href: a.getAttribute('href'), t: a.textContent.trim().slice(0, 80) })))
console.log(links.slice(0, 8))
const pick = links.find((l) => /retirantes/i.test(l.href) || /retirantes/i.test(l.t)) ?? links[0]
if (!pick) {
  console.log('nenhum asset')
  await browser.close()
  process.exit(1)
}
const url = new URL(pick.href, 'https://artsandculture.google.com').toString()
console.log('asset:', url)
await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })
const og = await page.evaluate(() => document.querySelector('meta[property="og:image"]')?.getAttribute('content'))
const title = await page.title()
console.log('title:', title, '\nog:', og)
if (og && outFile) {
  const big = og.replace(/=s\d+.*$/, '=s1600').replace(/=w\d+.*$/, '=s1600')
  const res = await fetch(big, { headers: { 'User-Agent': 'TomarLugarExpo/1.0' } })
  const buf = Buffer.from(await res.arrayBuffer())
  writeFileSync(outFile, buf)
  console.log('saved', outFile, buf.length, 'bytes from', big)
}
await browser.close()
