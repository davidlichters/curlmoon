# Baut templates/product.nap-nest.json für den echten Shop aus der Vorschau (Stand 01.11.2026 abends).
# Ohne Platzhalter-Bewertungen (Playbook D22: Sterne nur aus echten Judge.me-Daten, Block "sterne" bleibt wie er war).
# Aufruf: python3 -I shopify/vorlage_bauen.py <alte_vorlage.json> <bild_urls.json> <ausgabe.json>
import json, re, sys

alt_pfad, urls_pfad, aus_pfad = sys.argv[1:4]
roh = open(alt_pfad).read()
kopf = re.match(r'^\s*/\*.*?\*/', roh, flags=re.S)
t = json.loads(roh[kopf.end():] if kopf else roh)
URL = json.load(open(urls_pfad))
b = t['sections']['nest_details']['blocks']

HAKEN = ('<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" style="flex:none;margin-top:1px"><circle cx="12" cy="12" r="12" fill="#b3261e"/>'
         '<path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>')

# Unterzeile im Ton der Anzeige (Checkliste 16) und drei Bullets: erst Merkmal, dann Nutzen (63)
b['kurz']['settings']['custom_liquid'] = (
    '<p class="nn-unterzeile">Made for curling up. Soft on every side.</p>'
    '<ul class="jn-nest-kurz" style="list-style:none;margin:6px 0 14px;padding:0;display:grid;gap:8px;font-size:15.5px;line-height:1.35">'
    + ''.join(f'<li style="display:flex;gap:10px;align-items:flex-start">{HAKEN}<span>{x}</span></li>' for x in [
        '<strong>Raised rim all the way around</strong>, so they always have something to lean on',
        '<strong>Deep, soft center</strong> to sink into',
        '<strong>Long faux fur</strong>, washable, in 3 colors'])
    + '</ul>')

# Unter der Größenwahl: falsche Größe ist von der Garantie gedeckt (Rückgaberichtlinie)
b['groessen']['settings']['custom_liquid'] = (
    '<p class="jn-nest-groessen" style="margin:6px 0 2px;font-size:13px;color:#6b645c">16" up to 5 lb · 20" up to 11 lb · 24" up to 22 lb · 28" up to 30 lb</p>'
    '<p class="nn-groesse-ok">Wrong size? Covered by our money-back guarantee too.</p>')

# Vier Vertrauenszeilen unter dem Knopf (7, 13, 70); Lieferfenster 7 bis 12 Werktage ohne US-Feiertage (Versandrichtlinie)
b['garantie']['settings']['custom_liquid'] = '''<div class="nn-zeilen">
<div><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M8.5 10.5V7.8a3.5 3.5 0 017 0v2.7" fill="none" stroke="currentColor" stroke-width="1.9"/></svg><span><strong>Secure checkout</strong> with Shop Pay, Apple Pay or card</span></div>
<div><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3.2v2.8h-7z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="7" cy="17.5" r="1.8" fill="#fff" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="17.5" r="1.8" fill="#fff" stroke="currentColor" stroke-width="1.8"/></svg><span><strong>Free US shipping</strong>, duties included · arrives <strong class="nn-liefer">in 7 to 12 business days</strong> (est.)</span></div>
<div><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l7.5 3v5.6c0 4.6-3.2 8.3-7.5 9.8-4.3-1.5-7.5-5.2-7.5-9.8V5.8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8.6 12.2l2.4 2.4 4.5-4.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><span><strong>30-day money-back guarantee</strong>: not their thing? Full refund, and the bed stays with you.</span></div>
<div><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 7l8.5 6 8.5-6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg><span><strong>Real humans</strong> answer every email within 1 business day</span></div>
</div>
<script>
(function(){var F=['2026-11-26','2026-12-25','2027-01-01','2027-01-18','2027-02-15'];
function plus(d,n){var x=new Date(d);while(n>0){x.setDate(x.getDate()+1);var i=x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');if(x.getDay()&&x.getDay()<6&&F.indexOf(i)<0)n--}return x}
function t(d){return d.toLocaleDateString('en-US',{month:'short',day:'numeric'})}
var h=new Date(),v=plus(h,7),b=plus(h,12),s=v.getMonth()===b.getMonth()?t(v)+'–'+b.getDate():t(v)+' – '+t(b);
document.querySelectorAll('.nn-liefer').forEach(function(e){e.textContent=s})})();
</script>'''

# Reiter: Beschreibung offen (57), Größe mit Lieferantenmaßen und Messregel (1), Versand, Garantie, Pflege
akk = b['akkordeons']['settings']['custom_liquid']
def ersetze_inhalt(titel, neu):
    global akk
    muster = re.compile(r'(<span class="jn-p-akk__titel">' + re.escape(titel) + r'</span>.*?<div class="jn-p-akk__inhalt">)(.*?)(</div></div></div></details>)', re.S)
    assert muster.search(akk), titel
    akk = muster.sub(lambda m: m.group(1) + neu + m.group(3), akk, count=1)
ersetze_inhalt('Size guide', '<p>Measure your dog curled up asleep, from the nose to the base of the tail, and add about 4 inches so they can turn.</p>'
               '<p><strong>16"</strong>: outer diameter 15.7 in (40 cm), dogs up to 5 lb<br><strong>20"</strong>: 19.7 in (50 cm), up to 11 lb<br>'
               '<strong>24"</strong>: 23.6 in (60 cm), up to 22 lb<br><strong>28"</strong>: 27.6 in (70 cm), up to 30 lb</p>'
               '<p>Between two sizes? Size up. Not sure? Email support@porchnap.com with your dog\'s length and weight, we confirm the fit before you order.</p>')
ersetze_inhalt('Shipping &amp; Delivery', '<p>Free shipping on every US order, customs duties and taxes included. We hand your order to the carrier within 1 to 2 business days, delivery takes 6 to 10 business days after that. You get a tracking link by email.</p>')
ersetze_inhalt('30-Day Guarantee', '<p>If your dog does not take to the bed, or the size does not fit, email support@porchnap.com within 30 days of delivery with your order number and a photo of the bed. You get a full refund of the bed and you keep it. Nothing to send back, $0 fees. One refund per household.</p>')
akk = akk.replace('<span class="jn-p-akk__titel">30-Day Guarantee</span>', '<span class="jn-p-akk__titel">30-Day Money-Back Guarantee</span>')
b['akkordeons']['settings']['custom_liquid'] = akk

STIL = '''<style>
#shopify-section-sections--27998229791105__jn_countdown,#shopify-section-sections--27998229791105__custom_announcement_bar_inxgM4{display:none!important}
.nn-leiste{background:#b3261e;color:#fff;font:700 13px/1.25 inherit;text-align:center;padding:9px 12px}
.nn-unterzeile{margin:2px 0 10px;color:#6b645c;font-size:16px}
.nn-groesse-ok{margin:6px 0 0;font-size:13.5px;font-weight:700;color:#2e7d4f}
.nn-zeilen{display:grid;gap:9px;margin:12px 0 4px;font-size:14.5px;line-height:1.35}
.nn-zeilen div{display:flex;gap:10px;align-items:flex-start}
.nn-zeilen svg{width:20px;height:20px;flex:0 0 20px;color:#2e7d4f;margin-top:1px}
.nn-abschnitt{padding:56px 16px;font-size:17px;line-height:1.5;color:#1c1c1c}
.nn-creme{background:#fbf7f0}.nn-kakao{background:#3e2614;color:#fff}
.nn-vor{text-align:center;font-size:13px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#b3261e;margin:0 0 8px}
.nn-h2{font-size:28px;line-height:1.12;font-weight:850;text-align:center;margin:0 0 10px;letter-spacing:-.01em}
.nn-h2 em{font-style:normal;color:#b3261e}.nn-kakao .nn-h2 em{color:#ffb4a8}
.nn-satz{text-align:center;color:#6b645c;max-width:560px;margin:0 auto 24px;font-size:18px}.nn-kakao .nn-satz{color:#e9dcc9}
.nn-tab{max-width:720px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 14px rgba(28,28,28,.06)}
.nn-tab table{width:100%;border-collapse:collapse;font-size:15px}
.nn-tab th,.nn-tab td{padding:13px 10px;border-bottom:1px solid #e6e1d9;text-align:center}
.nn-tab th:first-child,.nn-tab td:first-child{text-align:left;padding-left:16px;font-weight:700}
.nn-tab thead th{font-size:13.5px;font-weight:800}.nn-tab th.nn-wir{background:#b3261e;color:#fff}.nn-tab td.nn-wir{background:#fbedeb}
.nn-tab tr:last-child td{border-bottom:0}
.nn-ja,.nn-nein{display:inline-grid;place-items:center;width:24px;height:24px;border-radius:50%;font-weight:900;font-size:14px}.nn-ja{background:#b3261e;color:#fff}.nn-nein{background:#edeae5;color:#9b948a}
.nn-band{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;margin:0 -16px;padding:4px 16px 8px;scrollbar-width:none}
.nn-band::-webkit-scrollbar{display:none}
.nn-band figure{flex:0 0 72%;max-width:300px;margin:0;scroll-snap-align:start;border-radius:16px;overflow:hidden;background:#fff;box-shadow:0 4px 14px rgba(28,28,28,.06)}
.nn-band img{width:100%;height:auto;aspect-ratio:4/5;object-fit:cover;display:block}
.nn-band figcaption{padding:10px 12px 12px;font-size:15px;color:#6b645c}.nn-band figcaption b{display:block;color:#1c1c1c;font-size:16px}
.nn-siegel{width:112px;height:112px;border-radius:50%;background:#b3261e;color:#fff;display:grid;place-items:center;text-align:center;font-weight:900;line-height:1;margin:0 auto 14px}
.nn-siegel b{font-size:38px;display:block}.nn-siegel span{font-size:10.5px;letter-spacing:.08em}
.nn-schritte{list-style:none;padding:0;margin:18px auto 0;display:grid;gap:10px;max-width:560px}
.nn-schritte li{display:flex;gap:12px;align-items:center;background:rgba(255,255,255,.08);border-radius:10px;padding:12px 14px;font-weight:600}
.nn-schritte i{font-style:normal;width:28px;height:28px;flex:0 0 28px;border-radius:50%;background:#fff;color:#3e2614;display:grid;place-items:center;font-weight:900}
.nn-gtab th{background:#1c1c1c;color:#fff;text-align:left!important}.nn-gtab td{text-align:left!important;vertical-align:top}.nn-gtab small{display:block;color:#6b645c;font-size:12.5px}
@media(min-width:900px){.nn-band{display:grid;grid-template-columns:repeat(4,1fr);overflow:visible;margin:0;padding:0}.nn-band figure{max-width:none}.nn-h2{font-size:38px}}
</style>'''

def abschnitt(liquid, oben=0, unten=0):
    return {'type': 'custom-liquid', 'settings': {'custom_liquid': liquid, 'padding_top': oben, 'padding_bottom': unten}}

t['sections']['nn_oben'] = abschnitt(STIL + '<div class="nn-leiste">Free US shipping · 30-day money-back guarantee</div>')
t['sections']['nn_vergleich'] = abschnitt('''<div class="nn-abschnitt"><p class="nn-vor">Flat bed vs. Nap Nest</p><h2 class="nn-h2">Flat beds give them <em>nothing to lean on.</em></h2>
<p class="nn-satz">Where does their head go at night? On the rim, all the way around.</p>
<div class="nn-tab"><table><thead><tr><th></th><th class="nn-wir">Nap Nest</th><th>Flat bed</th></tr></thead><tbody>
<tr><td>Rim to rest the chin</td><td class="nn-wir"><span class="nn-ja">✓</span></td><td><span class="nn-nein">✕</span></td></tr>
<tr><td>Deep center to curl into</td><td class="nn-wir"><span class="nn-ja">✓</span></td><td><span class="nn-nein">✕</span></td></tr>
<tr><td>Soft on every side</td><td class="nn-wir"><span class="nn-ja">✓</span></td><td><span class="nn-nein">✕</span></td></tr>
<tr><td>30 days money-back, keep the bed</td><td class="nn-wir"><span class="nn-ja">✓</span></td><td><span class="nn-nein">✕</span></td></tr>
</tbody></table></div></div>''')
band = [('A3_nutzen_naps_deeper.webp', 'Naps, but deeper.', 'A deep, soft center to sink into.'),
        ('A4_nutzen_every_part.webp', 'Every part is made to sink into.', 'Rim, sides and center: long faux fur.'),
        ('A2_nutzen_soft_every_side.webp', 'Soft on every side.', 'In Cloud Gray, Cocoa and Blush.'),
        ('C3_vergleich_where_head_rests.webp', 'Where does their head go?', 'On the rim, not over the edge.')]
t['sections']['nn_band'] = abschnitt('<div class="nn-abschnitt nn-creme"><p class="nn-vor">Made for curling up</p><h2 class="nn-h2">Soft on <em>every side</em></h2><div class="nn-band">'
    + ''.join(f'<figure><img src="{URL[d]}&width=720" alt="{ti}" loading="lazy" width="720" height="900"><figcaption><b>{ti}</b>{u}</figcaption></figure>' for d, ti, u in band)
    + '</div></div>')
t['sections']['nn_garantie'] = abschnitt('''<div class="nn-abschnitt nn-kakao" style="text-align:center"><div class="nn-siegel"><div><b>30</b><span>DAY<br>MONEY-BACK</span></div></div>
<h2 class="nn-h2" style="color:#fff">Your dog won't use it? <em>Full refund.</em></h2>
<p class="nn-satz">And the bed stays with you. Nothing to send back, $0 fees. Wrong size? Covered too.</p>
<ol class="nn-schritte"><li><i>1</i>Email us a photo of the bed within 30 days</li><li><i>2</i>Get a full refund within 5 business days</li><li><i>3</i>Keep the bed, or pass it on</li></ol></div>''')
t['sections']['nn_groessen'] = abschnitt('''<div class="nn-abschnitt" id="groessen"><p class="nn-vor">Size guide</p><h2 class="nn-h2">Find the <em>right size</em></h2>
<p class="nn-satz">Measure your dog curled up asleep, nose to base of tail, and add about 4 in. Between two sizes? Size up.</p>
<div class="nn-tab nn-gtab"><table><thead><tr><th>Size</th><th>Outer diameter</th><th>Dogs up to</th></tr></thead><tbody>
<tr><td><b>16"</b></td><td>15.7 in · 40 cm</td><td><b>5 lb</b><small>Chihuahua, Yorkie</small></td></tr>
<tr><td><b>20"</b></td><td>19.7 in · 50 cm</td><td><b>11 lb</b><small>Maltese, Toy Poodle</small></td></tr>
<tr><td><b>24"</b></td><td>23.6 in · 60 cm</td><td><b>22 lb</b><small>Shih Tzu, Pug</small></td></tr>
<tr><td><b>28"</b></td><td>27.6 in · 70 cm</td><td><b>30 lb</b><small>Beagle, Frenchie</small></td></tr>
</tbody></table></div>
<p class="nn-satz" style="margin-top:16px;margin-bottom:0">Not sure? Email support@porchnap.com with your dog's length and weight, we confirm the fit before you order.</p></div>''')

# FAQ in den Worten der Käufer, ehrliche Antworten (Kundenrecherche, Lieferantenbild vakuum_B.png)
FAQ = [
 ('Which size should I get?', 'Pick by weight: 16" for dogs up to 5 lb, 20" up to 11 lb, 24" up to 22 lb, 28" up to 30 lb. Or measure your dog curled up, nose to base of tail, and add about 4 in. Between two sizes, size up. Wrong size is covered by the money-back guarantee.'),
 ('Will my dog actually use it?', 'We cannot promise that, every dog is different. Tip: put an old blanket or a T-shirt that smells like you inside and give it 2 to 3 days. If your dog still does not take to it within 30 days, you get a full refund and keep the bed.'),
 ('Why does it look flat when it arrives?', 'It ships vacuum-packed. Unpack it, rub the filling evenly with your hands and let it rest, in the sun if you can. It fluffs up within 6 to 12 hours, the biggest size can take up to 48 hours.'),
 ('Can I wash it?', 'Yes. Wash it gently and let it air dry. Please do not put it in the dryer. Shake it afterwards to fluff the fur back up.'),
 ('Is it chew-proof?', 'No. It is a soft plush bed. If your dog shreds beds, this is not the right one.'),
 ('When will it arrive?', 'We hand your order to the carrier within 1 to 2 business days, delivery takes 6 to 10 business days after that. Shipping is free, customs duties are included, and you get a tracking link by email.'),
 ('Can I send it as a gift?', "Yes. Enter the recipient's address as the shipping address at checkout."),
 ('Is it good for older dogs?', 'Many older dogs love a soft spot with something to rest the head on. It is a plush bed, not a firm orthopedic mattress, so if your vet asked for firm support, choose an orthopedic bed instead.'),
]
faq = t['sections']['nest_faq']
faq['blocks'] = {f'frage_{i+1}': {'type': 'frage', 'settings': {'frage': q, 'antwort': f'<p>{a}</p>'}} for i, (q, a) in enumerate(FAQ)}
faq['block_order'] = [f'frage_{i+1}' for i in range(len(FAQ))]

t['order'] = ['jn_produkt_stil', 'nn_oben', 'nest_details', 'nn_vergleich', 'nn_band', 'nn_garantie', 'nn_groessen', 'nest_faq', 'nest_sticky']
json.dump(t, open(aus_pfad, 'w'), ensure_ascii=False, indent=2)
print('ok', aus_pfad, len(json.dumps(t)))
