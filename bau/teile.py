# Gemeinsame Teile jeder Seite (Kopf, Schubladen, Fuß). bauen.py setzt sie in die Seiten aus bau/seiten/ ein.
# Regeln: WEBSITE_CHECKLISTE_MOBIL.md (Repo ecom), Nummern in Klammern.

def vorschau():
    return '<div class="vorschau"><b>VORSCHAU</b> · der echte Shop ist curlmoon.com</div>'


def leiste():
    # Eine feste Botschaft statt drei wechselnden (RANGLISTE: wechselnd nur ein Drittel der Zeit sichtbar);
    # nur wahre Sätze, gleicher Wortlaut wie in den Anzeigen (24): free US shipping, money-back guarantee.
    return ('<div class="leiste" role="region" aria-label="Announcement">'
            '<span>Free US shipping · 30-day money-back guarantee</span></div>')


def kopf(b):
    # Logo links, kleiner Kopf (41)
    return f'''<header class="kopf"><div class="kopf__innen">
  <a class="kopf__logo" href="{b}/" aria-label="Curlmoon home"><img src="{b}/img/logo_schwarz.webp" alt="Curlmoon" width="99" height="22"></a>
  <nav class="kopf__nav" aria-label="Main"><a href="{b}/products/curlmoon-nest/">Shop</a><a href="{b}/products/curlmoon-nest/#groessen">Size guide</a><a href="{b}/pages/contact/">Contact</a></nav>
  <div class="kopf__rechts">
    <button class="symbol" data-oeffne="#korb" aria-label="Cart"><svg><use href="#i-korb"/></svg><span class="korb-zahl" data-leer="1">0</span></button>
    <button class="symbol kopf__menue" data-oeffne="#menue" aria-label="Menu"><svg><use href="#i-menue"/></svg></button>
  </div>
</div></header>'''


def schubladen(b):
    pfeil = '<svg width="18" height="18"><use href="#i-pfeil"/></svg>'
    return f'''<div class="schublade schublade--rechts" id="menue" aria-hidden="true"><div class="schublade__grund"></div>
  <div class="schublade__tafel"><div class="schublade__kopf"><span>Menu</span><button class="symbol" data-zu aria-label="Close"><svg><use href="#i-zu"/></svg></button></div>
  <ul class="menue-liste">
    <li><a href="{b}/products/curlmoon-nest/">Shop the Curlmoon Nest {pfeil}</a></li>
    <li><a href="{b}/products/curlmoon-nest/#groessen">Size guide {pfeil}</a></li>
    <li><a href="mailto:curlmoon@lichters.email?subject=Where%20is%20my%20order%3F">Track your order {pfeil}</a></li>
    <li><a href="{b}/products/curlmoon-nest/#fragen">FAQ {pfeil}</a></li>
    <li><a href="{b}/pages/about-us/">About us {pfeil}</a></li>
    <li><a href="{b}/pages/contact/">Contact us {pfeil}</a></li>
  </ul></div></div>
<div class="schublade schublade--rechts" id="korb" aria-hidden="true"><div class="schublade__grund"></div>
  <div class="schublade__tafel"><div class="schublade__kopf"><span>Your cart</span><button class="symbol" data-zu aria-label="Close"><svg><use href="#i-zu"/></svg></button></div>
  <div class="korb__liste" id="korb-liste"></div>
  <div class="korb__fuss">
    <div class="korb__summe"><span>Subtotal</span><span id="korb-summe">$0.00</span></div>
    <div class="korb__klein">Shipping: <b>Free</b> · duties included · arrives <span data-text="liefer">in 7–12 business days</span> (est.)</div>
    <button class="knopf" data-kasse><svg width="18" height="18"><use href="#i-schloss"/></svg> Secure checkout</button>
    <div class="express"><button data-kasse class="express__shop">Shop Pay</button><button data-kasse class="express__g">G Pay</button></div>
    <div class="unter-knopf" style="margin-top:12px">
      <div><svg><use href="#i-schild"/></svg><span><b>30-day money-back guarantee:</b> not their thing? Full refund, keep the bed.</span></div>
    </div>
    {zahlarten()}
  </div></div></div>
<div class="toast" id="toast" role="status"></div>'''


def zahlarten():
    return ('<div class="zahlarten" aria-label="Payment methods"><span>VISA</span><span>MC</span><span>AMEX</span>'
            '<span>Apple Pay</span><span>G Pay</span><span>Shop Pay</span></div>')


def fuss(b):
    return f'''<footer class="fuss"><div class="huelle">
  <div class="fuss__raster">
    <div><img class="fuss__logo" src="{b}/img/logo_creme.webp" alt="Curlmoon" width="90" height="20">
      <p style="margin:0;max-width:340px">Soft, round beds for dogs who sleep curled up. Real humans answer every email within 1 business day.</p>
      <p style="margin:12px 0 0"><a href="mailto:curlmoon@lichters.email">curlmoon@lichters.email</a> · <a href="{b}/pages/contact/">Contact form</a></p></div>
    <div><h5>Help</h5><ul><li><a href="mailto:curlmoon@lichters.email?subject=Where%20is%20my%20order%3F">Track your order</a></li><li><a href="{b}/products/curlmoon-nest/#fragen">FAQ</a></li><li><a href="{b}/pages/shipping-policy/">Shipping policy</a></li><li><a href="{b}/pages/refund-policy/">30-day money-back guarantee</a></li></ul></div>
    <div><h5>Company</h5><ul><li><a href="{b}/pages/about-us/">About us</a></li><li><a href="{b}/pages/contact/">Contact</a></li></ul></div>
  </div>
  {zahlarten()}
  <div class="fuss__klein">© 2026 Curlmoon · Preview build, not a live store. Reviews shown are placeholders.</div>
</div></footer>'''
