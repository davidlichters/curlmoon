// Porchnap Vorschau: Galerie, Auswahl, Mengenstufen, Warenkorb, haftender Kaufbalken.
// Keine echte Kasse: "Checkout" zeigt nur einen Hinweis, es wird nichts gesendet.
(() => {
  const $ = (s, w = document) => w.querySelector(s)
  const $$ = (s, w = document) => [...w.querySelectorAll(s)]
  const geld = (n) => '$' + n.toFixed(2)

  const PREISE = { 16: 44.99, 20: 49.99, 24: 59.99, 28: 69.99 }
  const GEWICHT = { 16: 'up to 5 lb', 20: 'up to 11 lb', 24: 'up to 22 lb', 28: 'up to 30 lb' }
  const FARBEN = {
    gray: { name: 'Cloud Gray', bild: 'pn_02_cloud_gray', hinweis: 'Calm gray that goes with almost any room.' },
    cocoa: { name: 'Cocoa', bild: 'pn_03_cocoa', hinweis: 'Warm brown, forgiving with darker fur.' },
    blush: { name: 'Blush', bild: 'pn_04_blush', hinweis: 'Soft pink, the coziest look in the room.' }
  }
  const STUFEN = { 1: 0, 2: 0.10 } // 1 Bett voller Preis (D17), 2 Betten 10 %: mehr hält die 67 % Marge (D1) bei 24" und 28" nicht
  const BASIS = document.body.dataset.basis || '.'

  const zustand = { groesse: 20, farbe: 'gray', farbe2: 'blush', stufe: 1 }
  let korb = []
  try { korb = JSON.parse(sessionStorage.getItem('pn_korb') || '[]') } catch {}

  function toast (text) {
    const t = $('#toast'); if (!t) return
    t.textContent = text; t.classList.add('zeigen')
    clearTimeout(toast.uhr); toast.uhr = setTimeout(() => t.classList.remove('zeigen'), 2600)
  }

  // ---------- Schubladen (Menü, Warenkorb)
  function oeffne (id) { $(id)?.classList.add('offen'); document.documentElement.style.overflow = 'hidden' }
  function schliesse (el) { el.classList.remove('offen'); document.documentElement.style.overflow = '' }
  $$('[data-oeffne]').forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); oeffne(b.dataset.oeffne) }))
  $$('.schublade').forEach(s => {
    s.addEventListener('click', (e) => { if (e.target.matches('.schublade__grund, [data-zu], [data-zu] *')) schliesse(s) })
  })
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') $$('.schublade.offen').forEach(schliesse) })

  // ---------- Galerie
  const spur = $('.galerie__spur')
  if (spur) {
    const bilder = $$('.galerie__bild', spur)
    const punkte = $('.galerie__punkte')
    const daumen = $$('.daumen button')
    if (punkte) punkte.innerHTML = bilder.map(() => '<i></i>').join('')
    const markiere = (i) => {
      $$('.galerie__punkte i').forEach((p, k) => p.classList.toggle('an', k === i))
      daumen.forEach((d, k) => d.classList.toggle('an', k === i))
    }
    let uhr
    spur.addEventListener('scroll', () => {
      clearTimeout(uhr)
      uhr = setTimeout(() => markiere(Math.round(spur.scrollLeft / spur.clientWidth)), 60)
    }, { passive: true })
    daumen.forEach((d, i) => d.addEventListener('click', () => { spur.scrollTo({ left: i * spur.clientWidth, behavior: 'smooth' }); markiere(i) }))
    markiere(0)
    spur.zeige = (name) => {
      const i = bilder.findIndex(b => b.dataset.bild === name)
      if (i >= 0) { spur.scrollTo({ left: i * spur.clientWidth, behavior: 'smooth' }); markiere(i) }
    }
  }

  // ---------- Auswahl und Preise
  function stufenPreis (stufe) {
    const einzel = PREISE[zustand.groesse]
    const voll = einzel * stufe
    return { voll, jetzt: Math.round(voll * (1 - STUFEN[stufe]) * 100) / 100 }
  }
  function zeichne () {
    $$('[data-groesse]').forEach(b => b.classList.toggle('an', +b.dataset.groesse === zustand.groesse))
    $$('[data-farbe]').forEach(b => b.classList.toggle('an', b.dataset.farbe === zustand.farbe))
    $$('[data-stufe]').forEach(b => b.classList.toggle('an', +b.dataset.stufe === zustand.stufe))
    $$('[data-zweite]').forEach(e => { e.hidden = zustand.stufe !== 2 })
    $$('[data-farbe2]').forEach(b => b.classList.toggle('an', b.dataset.farbe2 === zustand.farbe2))
    $$('[data-text="farbe2"]').forEach(e => { e.textContent = FARBEN[zustand.farbe2].name })
    $$('[data-text="farbe"]').forEach(e => { e.textContent = FARBEN[zustand.farbe].name })
    $$('[data-text="farbhinweis"]').forEach(e => { e.textContent = FARBEN[zustand.farbe].hinweis })
    $$('[data-text="groesse"]').forEach(e => { e.textContent = zustand.groesse + '"' })
    $$('[data-text="gewicht"]').forEach(e => { e.textContent = GEWICHT[zustand.groesse] })
    $$('[data-text="preis"]').forEach(e => { e.textContent = geld(PREISE[zustand.groesse]) })
    for (const s of [1, 2]) {
      const p = stufenPreis(s)
      $$(`[data-stufenpreis="${s}"]`).forEach(e => { e.textContent = geld(p.jetzt) })
      $$(`[data-stufenvoll="${s}"]`).forEach(e => { e.textContent = s > 1 ? geld(p.voll) : '' })
      $$(`[data-stufenspar="${s}"]`).forEach(e => { e.textContent = 'You save ' + geld(p.voll - p.jetzt) })
    }
    const p = stufenPreis(zustand.stufe)
    $$('[data-text="knopfpreis"]').forEach(e => { e.textContent = geld(p.jetzt) })
    $$('[data-text="haftend-var"]').forEach(e => {
      e.textContent = `${zustand.groesse}" · ${FARBEN[zustand.farbe].name}${zustand.stufe > 1 ? ' + ' + FARBEN[zustand.farbe2].name : ''}`
    })
  }
  $$('[data-groesse]').forEach(b => b.addEventListener('click', () => { zustand.groesse = +b.dataset.groesse; zeichne() }))
  $$('[data-farbe]').forEach(b => b.addEventListener('click', () => {
    zustand.farbe = b.dataset.farbe; zeichne(); spur?.zeige?.(FARBEN[zustand.farbe].bild)
  }))
  $$('[data-stufe]').forEach(b => b.addEventListener('click', () => { zustand.stufe = +b.dataset.stufe; zeichne() }))
  $$('[data-farbe2]').forEach(b => b.addEventListener('click', () => { zustand.farbe2 = b.dataset.farbe2; zeichne() }))

  // ---------- Warenkorb
  function speichere () { try { sessionStorage.setItem('pn_korb', JSON.stringify(korb)) } catch {} }
  function zeichneKorb () {
    const liste = $('#korb-liste'); if (!liste) return
    const zahl = korb.reduce((s, p) => s + p.menge * p.betten, 0)
    $$('.korb-zahl').forEach(z => { z.textContent = zahl; z.dataset.leer = zahl ? '0' : '1' })
    if (!korb.length) {
      liste.innerHTML = `<div class="korb__leer"><p>Your cart is empty.</p><a class="knopf" href="${BASIS}/products/porchnap-nap-nest/">Shop the Nap Nest</a></div>`
      $('#korb-summe').textContent = geld(0); return
    }
    liste.innerHTML = `<div class="korb__hinweis"><svg width="22" height="22"><use href="#i-laster"/></svg><span><b>Free US shipping</b> is included on every order.</span></div>` +
      korb.map((p, i) => `<div class="korb__posten">
        <img src="${BASIS}/img/${FARBEN[p.farbe].bild}.webp" alt="">
        <div><div class="korb__name">Porchnap Nap Nest${p.betten > 1 ? ' (2 beds)' : ''}</div>
        <div class="korb__var">${p.groesse}" · ${FARBEN[p.farbe].name}${p.farbe2 ? ' + ' + FARBEN[p.farbe2].name : ''}</div>
        <div class="menge"><button data-minus="${i}" aria-label="Less">−</button><span>${p.menge}</span><button data-plus="${i}" aria-label="More">+</button></div></div>
        <div class="korb__preis">${geld(p.preis * p.menge)}</div></div>`).join('')
    $('#korb-summe').textContent = geld(korb.reduce((s, p) => s + p.preis * p.menge, 0))
  }
  document.addEventListener('click', (e) => {
    const plus = e.target.closest('[data-plus]'); const minus = e.target.closest('[data-minus]')
    if (plus) { korb[+plus.dataset.plus].menge++; speichere(); zeichneKorb() }
    if (minus) { const p = korb[+minus.dataset.minus]; p.menge--; if (p.menge < 1) korb.splice(+minus.dataset.minus, 1); speichere(); zeichneKorb() }
  })
  function inDenKorb () {
    const p = stufenPreis(zustand.stufe)
    const schluessel = `${zustand.groesse}-${zustand.farbe}-${zustand.stufe}-${zustand.stufe > 1 ? zustand.farbe2 : ''}`
    const da = korb.find(k => k.schluessel === schluessel)
    if (da) da.menge++
    else korb.push({ schluessel, groesse: zustand.groesse, farbe: zustand.farbe, farbe2: zustand.stufe > 1 ? zustand.farbe2 : null, betten: zustand.stufe, preis: p.jetzt, menge: 1 })
    speichere(); zeichneKorb(); oeffne('#korb')
  }
  $$('[data-kaufen]').forEach(b => b.addEventListener('click', inDenKorb))
  $$('[data-kasse]').forEach(b => b.addEventListener('click', () => toast('Preview only: no real checkout here.')))

  // ---------- Haftender Kaufbalken: erscheint, sobald der Hauptknopf aus dem Bild ist
  const haupt = $('#hauptknopf'); const haftend = $('.haftend')
  if (haupt && haftend && 'IntersectionObserver' in window) {
    let unterKnopf = false
    new IntersectionObserver(([e]) => {
      unterKnopf = !e.isIntersecting && e.boundingClientRect.top < 0
      haftend.classList.toggle('zeigen', unterKnopf)
    }).observe(haupt)
  }
  $$('[data-hoch]').forEach(b => b.addEventListener('click', () => { $('#kaufen-oben')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }))

  // ---------- Bewertungen: Filter und "mehr"
  $$('.bew-filter button').forEach(b => b.addEventListener('click', () => {
    $$('.bew-filter button').forEach(x => x.classList.toggle('an', x === b))
    const f = b.dataset.filter
    $$('.bew').forEach(r => { r.hidden = r.hasAttribute('data-spaeter') || !(f === 'alle' || (f === 'bilder' && r.querySelector('.bew__bilder')) || r.dataset.sterne === f) })
  }))
  $('[data-mehr]')?.addEventListener('click', (e) => { $$('.bew[data-spaeter]').forEach(r => { r.hidden = false; r.removeAttribute('data-spaeter') }); e.currentTarget.remove() })

  // ---------- Lieferfenster: 6 bis 10 Werktage ab heute (Playbook A3), Wochenenden zählen nicht
  function plusWerktage (d, n) {
    const x = new Date(d)
    while (n > 0) { x.setDate(x.getDate() + 1); if (x.getDay() !== 0 && x.getDay() !== 6) n-- }
    return x
  }
  const tag = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const heute = new Date()
  const von = plusWerktage(heute, 6); const bis = plusWerktage(heute, 10)
  const spanne = von.getMonth() === bis.getMonth() ? `${tag(von)}–${bis.getDate()}` : `${tag(von)} – ${tag(bis)}`
  $$('[data-text="liefer"]').forEach(e => { e.textContent = spanne })

  zeichne(); zeichneKorb()
})()
