// Ladezeit auf dem Handy messen: iPhone-Format, gedrosseltes 4G (wie Lighthouse "Slow 4G": 1,6 Mbit/s, 150 ms) und 4-fach
// langsamere CPU. Misst LCP, CLS, Bytes, Anzahl Anfragen. Aufruf: node bau/tempo.mjs <url>
import { createRequire } from 'node:module'
const require = createRequire('/Users/david/crosspost/node_modules/')
const { chromium } = require('playwright-core')
const EXE = '/Users/david/Library/Caches/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-mac-arm64/chrome-headless-shell'
const url = process.argv[2]
const b = await chromium.launch({ executablePath: EXE })
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' })
const p = await ctx.newPage()
const cdp = await ctx.newCDPSession(p)
await cdp.send('Network.enable')
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 })
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
let bytes = 0; let anfragen = 0
p.on('response', async r => { anfragen++; try { const h = await r.headerValue('content-length'); bytes += Number(h || 0) } catch {} })
await p.addInitScript(() => {
  window.__lcp = 0; window.__cls = 0
  new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lcp = e.startTime }).observe({ type: 'largest-contentful-paint', buffered: true })
  new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value }).observe({ type: 'layout-shift', buffered: true })
})
const t0 = Date.now()
await p.goto(url, { waitUntil: 'load', timeout: 90000 })
const load = Date.now() - t0
await p.waitForTimeout(2500)
const w = await p.evaluate(() => ({ lcp: Math.round(window.__lcp), cls: Math.round(window.__cls * 1000) / 1000, lcpEl: performance.getEntriesByType('largest-contentful-paint').slice(-1)[0]?.element?.outerHTML?.slice(0, 90) }))
console.log(JSON.stringify({ url, lcp_ms: w.lcp, cls: w.cls, load_ms: load, anfragen, kb_bis_load: Math.round(bytes / 1024), lcpElement: w.lcpEl }, null, 1))
await b.close()
