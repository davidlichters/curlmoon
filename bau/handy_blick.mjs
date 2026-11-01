// So sieht ein Mensch die Seite auf dem iPhone: Bildschirm für Bildschirm wischen und jeden Bildschirm fotografieren
// (keine Ganzseiten-Aufnahme, damit haftende Leisten und Blätter so erscheinen wie auf dem Handy).
// Aufruf: node bau/handy_blick.mjs <url> <ordner> [schritt_px]
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
const require = createRequire('/Users/david/crosspost/node_modules/')
const { chromium } = require('playwright-core')
const [url, aus, schrittArg] = process.argv.slice(2)
const schritt = Number(schrittArg || 760)
fs.mkdirSync(aus, { recursive: true })
for (const f of fs.readdirSync(aus)) if (/^b\d+\.png$/.test(f)) fs.unlinkSync(path.join(aus, f))
const EXE = '/Users/david/Library/Caches/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-mac-arm64/chrome-headless-shell'
const b = await chromium.launch({ executablePath: EXE })
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' })
const p = await ctx.newPage()
await p.goto(url, { waitUntil: 'networkidle' })
await p.waitForTimeout(600)
const hoehe = await p.evaluate(() => document.documentElement.scrollHeight)
let n = 0
for (let y = 0; y < hoehe; y += schritt) {
  await p.evaluate((y) => window.scrollTo(0, y), y)
  await p.waitForTimeout(450)
  n++
  await p.screenshot({ path: path.join(aus, `b${String(n).padStart(2, '0')}.png`) })
}
console.log(n, 'Bildschirme,', hoehe, 'px')
await b.close()
