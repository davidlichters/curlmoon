// Porchnap Vorschau: Galerie, Auswahl, Mengenstufen, Warenkorb, haftender Kaufbalken.
// Keine echte Kasse: "Checkout" zeigt nur einen Hinweis, es wird nichts gesendet.
(() => {
  const $ = (s, w = document) => w.querySelector(s)
  const $$ = (s, w = document) => [...w.querySelectorAll(s)]
  const geld = (n) => '$' + n.toFixed(2)

  const PREISE = { 16: 44.99, 20: 49.99, 24: 59.99, 28: 69.99 }
  const GEWICHT = { 16: 'dogs up to 5 lb', 20: 'dogs up to 11 lb', 24: 'dogs up to 22 lb', 28: 'dogs up to 30 lb' }
  const FARBEN = {
    gray: { name: 'Cloud Gray', bild: 'pn_02_cloud_gray', hinweis: 'Calm gray that goes with almost any room.' },
    cocoa: { name: 'Cocoa', bild: 'pn_03_cocoa', hinweis: 'Warm brown, forgiving with darker fur.' },
    blush: { name: 'Blush', bild: 'pn_04_blush', hinweis: 'Soft pink, the coziest look in the room.' }
  }
  const STUFEN = { 1: 0, 2: 0.10 } // 1 Bett voller Preis (D17), 2 Betten 10 %: mit den angebotenen DDP-Preisen hält nur das 67 % Marge (D1), 15 % gäbe 65,7 %
  const BASIS = document.body.dataset.basis || '.'

  // Lieferfenster: Bearbeitung 1 bis 2 plus Transport 6 bis 10 Werktage = 7 bis 12 Werktage (Versandrichtlinie),
  // ohne Wochenenden und US-Feiertage (Kursagent 01.11.: Thanksgiving und Weihnachten fehlten)
  const FEIERTAGE = ['2026-11-26', '2026-12-25', '2027-01-01', '2027-01-18', '2027-02-15']
  function plusWerktage (d, n) {
    const x = new Date(d)
    while (n > 0) {
      x.setDate(x.getDate() + 1)
      const iso = `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
      if (x.getDay() !== 0 && x.getDay() !== 6 && !FEIERTAGE.includes(iso)) n--
    }
    return x
  }
  const tag = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const heute = new Date()
  const von = plusWerktage(heute, 7); const bis = plusWerktage(heute, 12)
  const spanne = von.getMonth() === bis.getMonth() ? `${tag(von)}–${bis.getDate()}` : `${tag(von)} – ${tag(bis)}`

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
      $$('[data-bildnr]').forEach(e => { e.textContent = i + 1 })
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
    // Antippen öffnet das Bild im Vollbild (Fell aus der Nähe, mit zwei Fingern zoomen)
    const voll = $('#vollbild')
    if (voll) {
      const vspur = $('.vollbild__spur', voll)
      vspur.innerHTML = bilder.map(b => `<div><img src="${$('img', b).getAttribute('src')}" alt="${$('img', b).alt}"></div>`).join('')
      const vzahl = $('.vollbild__zahl', voll)
      vspur.addEventListener('scroll', () => { vzahl.textContent = `${Math.round(vspur.scrollLeft / vspur.clientWidth) + 1} / ${bilder.length}` }, { passive: true })
      bilder.forEach((b, i) => b.addEventListener('click', () => {
        voll.hidden = false; document.documentElement.style.overflow = 'hidden'
        vspur.scrollLeft = i * vspur.clientWidth; vzahl.textContent = `${i + 1} / ${bilder.length}`
      }))
      $('.vollbild__zu', voll).addEventListener('click', () => { voll.hidden = true; document.documentElement.style.overflow = '' })
    }
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
      $$(`[data-stufenspar="${s}"]`).forEach(e => { e.textContent = 'you save ' + geld(p.voll - p.jetzt) })
      $$(`[data-stufeje="${s}"]`).forEach(e => { e.textContent = geld(Math.round(p.jetzt / s * 100) / 100) })
    }
    const p = stufenPreis(zustand.stufe)
    $$('[data-text="knopfpreis"]').forEach(e => { e.textContent = geld(p.jetzt) })
    // Kaufbalken zeigt die Auswahl und kauft direkt (RANGLISTE R1: ein Balken, der nur springt, bringt keine Bestellungen)
    $$('[data-text="haftwahl"]').forEach(e => {
      e.textContent = `${zustand.groesse}" · ${FARBEN[zustand.farbe].name}${zustand.stufe > 1 ? ' + ' + FARBEN[zustand.farbe2].name : ''}`
    })
    $$('[data-haftbild]').forEach(e => { e.src = `${BASIS}/img/${FARBEN[zustand.farbe].bild}.webp` })
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
    liste.innerHTML = `<div class="korb__gut"><b>Good choice.</b> 30 days to try it, and the bed stays either way.</div><div class="korb__hinweis"><svg width="22" height="22"><use href="#i-laster"/></svg><span><b>Free US shipping</b>, duties included. Arrives <b>${spanne}</b> (est.)</span></div>` +
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
  // sichtbar, solange weder der Hauptknopf noch der Knopf am Seitenende im Bild ist
  const haupt = $('#hauptknopf'); const haftend = $('.haftend')
  if (haupt && haftend && 'IntersectionObserver' in window) {
    const ziele = [haupt, $('.schluss .knopf')].filter(Boolean); const sicht = new Map()
    const io = new IntersectionObserver((eintraege) => {
      eintraege.forEach(e => sicht.set(e.target, e.isIntersecting))
      haftend.classList.toggle('zeigen', ![...sicht.values()].some(Boolean))
    })
    ziele.forEach(z => io.observe(z))
  }
  // Kopf beim Runterwischen ausblenden, beim Hochwischen zeigen (nur Handy)
  const kopf = $('.kopf'); let zuletzt = scrollY
  addEventListener('scroll', () => {
    const y = scrollY
    if (kopf && innerWidth < 900) kopf.classList.toggle('weg', y > zuletzt && y > 220)
    zuletzt = y
  }, { passive: true })
  $$('[data-hoch]').forEach(b => b.addEventListener('click', () => { $('#kaufen-oben')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }))

  // ---------- Bewertungen: Filter und "mehr"
  $$('.bew-filter button').forEach(b => b.addEventListener('click', () => {
    $$('.bew-filter button').forEach(x => x.classList.toggle('an', x === b))
    const f = b.dataset.filter
    $$('.bew').forEach(r => { r.hidden = r.hasAttribute('data-spaeter') || !(f === 'alle' || (f === 'bilder' && r.querySelector('.bew__bilder')) || r.dataset.sterne === f) })
  }))
  $('[data-mehr]')?.addEventListener('click', (e) => { $$('.bew[data-spaeter]').forEach(r => { r.hidden = false; r.removeAttribute('data-spaeter') }); e.currentTarget.remove() })

  const farbeAusAdresse = new URLSearchParams(location.search).get('color')
  if (farbeAusAdresse && FARBEN[farbeAusAdresse]) { zustand.farbe = farbeAusAdresse; setTimeout(() => spur?.zeige?.(FARBEN[farbeAusAdresse].bild), 50) }

  zeichne(); zeichneKorb()
  $$('[data-text="liefer"]').forEach(e => { e.textContent = spanne })
})()
