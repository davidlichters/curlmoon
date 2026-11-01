// Seite im Handyformat ansehen (390 px, iPhone), headless: Bildstreifen + Prüfwerte (Überbreite, Konsolenfehler).
// Aufruf: node bau/ansehen.mjs <url> <ausgabeordner> [breite] [--klick]
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
const require = createRequire('/Users/david/crosspost/node_modules/')
const { chromium } = require('playwright-core')

const [url, aus, breiteArg] = process.argv.slice(2)
const breite = Number(breiteArg || 390)
const KLICK = process.argv.includes('--klick')
fs.mkdirSync(aus, { recursive: true })
const EXE = '/Users/david/Library/Caches/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-mac-arm64/chrome-headless-shell'
const browser = await chromium.launch({ executablePath: EXE, headless: true })
const handy = breite < 700
const ctx = await browser.newContext({ viewport: { width: breite, height: handy ? 844 : 900 }, deviceScaleFactor: 2, isMobile: handy, hasTouch: handy, userAgent: handy ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' : undefined })
const page = await ctx.newPage()
const fehler = []
page.on('console', m => { if (m.type() === 'error') fehler.push(m.text()) })
page.on('pageerror', e => fehler.push(String(e)))
page.on('requestfailed', r => fehler.push('LADEFEHLER ' + r.url()))
await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForTimeout(800)
await page.screenshot({ path: path.join(aus, 'erster_bildschirm.png') })
const werte = await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
  hoehe: document.documentElement.scrollHeight,
  breiter: [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > innerWidth + 1 && getComputedStyle(e).position !== 'fixed' && !e.closest('.galerie__spur,.daumen,.band,.bew-filter,.schnell,.schublade,.leiste') }).slice(0, 8).map(e => e.tagName + '.' + e.className.toString().slice(0, 40) + ' r=' + Math.round(e.getBoundingClientRect().right))
}))
// ganze Seite in Streifen
for (let y = 0, n = 1; y < werte.hoehe; y += 1400, n++) {
  await page.evaluate((y) => window.scrollTo(0, y), y)
  await page.waitForTimeout(250)
}
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(400)
const full = path.join(aus, 'ganz.png')
await page.screenshot({ path: full, fullPage: true })
if (KLICK) {
  // Auswahl testen: Farbe Kakao, Größe 24, 2 Betten, in den Korb
  await page.click('[data-farbe="cocoa"]'); await page.click('[data-groesse="24"]'); await page.click('[data-stufe="2"]')
  await page.waitForTimeout(500)
  werte.knopf = await page.textContent('#hauptknopf')
  await page.click('#hauptknopf'); await page.waitForTimeout(600)
  await page.screenshot({ path: path.join(aus, 'korb.png') })
  werte.korb = (await page.textContent('#korb-liste')).replace(/\s+/g, ' ').trim().slice(0, 200)
  werte.summe = await page.textContent('#korb-summe')
  await page.click('#korb [data-zu]'); await page.waitForTimeout(400)
  await page.evaluate(() => window.scrollTo(0, 2600)); await page.waitForTimeout(700)
  await page.screenshot({ path: path.join(aus, 'haftend.png') })
  werte.haftendSichtbar = await page.evaluate(() => document.querySelector('.haftend')?.classList.contains('zeigen'))
}
werte.fehler = fehler
fs.writeFileSync(path.join(aus, 'werte.json'), JSON.stringify(werte, null, 1))
console.log(JSON.stringify(werte, null, 1))
await browser.close()
