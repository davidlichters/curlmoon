# Gemeinsame Teile jeder Seite (Kopf, Schubladen, Fuß). bauen.py setzt sie in die Seiten aus bau/seiten/ ein.

def vorschau():
    return '<div class="vorschau"><b>VORSCHAU</b> · Sterne und Bewertungen sind Platzhalter</div>'


def leiste():
    # Nur wahre Sätze: Versand gratis (Playbook A3), Garantie (D21). Kein Datum, keine Frist.
    return ('<div class="leiste" role="region" aria-label="Announcements"><div class="leiste__spur">'
            '<span>Free US shipping on every order</span>'
            '<span>30-day guarantee: not their thing? Full refund</span>'
            '<span>Washable faux fur · 4 sizes · 3 colors</span>'
            '</div></div>')


def kopf(b):
    return f'''<header class="kopf"><div class="kopf__innen">
  <button class="symbol kopf__menue" data-oeffne="#menue" aria-label="Menu"><svg><use href="#i-menue"/></svg></button>
  <nav class="kopf__nav" aria-label="Main"><a href="{b}/products/porchnap-nap-nest/">Nap Nest</a><a href="{b}/products/porchnap-nap-nest/#groessen">Size guide</a><a href="{b}/products/porchnap-nap-nest/#bewertungen">Reviews</a></nav>
  <a class="kopf__logo" href="{b}/" aria-label="Porchnap home"><img src="{b}/img/logo_schwarz.webp" alt="Porchnap" width="99" height="22"></a>
  <div class="kopf__rechts" style="justify-self:end"><button class="symbol" data-oeffne="#korb" aria-label="Cart"><svg><use href="#i-korb"/></svg><span class="korb-zahl" data-leer="1">0</span></button></div>
</div></header>'''


def schubladen(b):
    return f'''<div class="schublade schublade--links" id="menue" aria-hidden="true"><div class="schublade__grund"></div>
  <div class="schublade__tafel"><div class="schublade__kopf"><span>Menu</span><button class="symbol" data-zu aria-label="Close"><svg><use href="#i-zu"/></svg></button></div>
  <ul class="menue-liste">
    <li><a href="{b}/products/porchnap-nap-nest/">Shop the Nap Nest <svg width="18" height="18"><use href="#i-pfeil"/></svg></a></li>
    <li><a href="{b}/products/porchnap-nap-nest/#groessen">Size guide <svg width="18" height="18"><use href="#i-pfeil"/></svg></a></li>
    <li><a href="{b}/products/porchnap-nap-nest/#bewertungen">Reviews <svg width="18" height="18"><use href="#i-pfeil"/></svg></a></li>
    <li><a href="{b}/products/porchnap-nap-nest/#garantie">30-day guarantee <svg width="18" height="18"><use href="#i-pfeil"/></svg></a></li>
    <li><a href="{b}/products/porchnap-nap-nest/#fragen">FAQ <svg width="18" height="18"><use href="#i-pfeil"/></svg></a></li>
    <li><a href="mailto:support@porchnap.com">Contact us <svg width="18" height="18"><use href="#i-pfeil"/></svg></a></li>
  </ul></div></div>
<div class="schublade schublade--rechts" id="korb" aria-hidden="true"><div class="schublade__grund"></div>
  <div class="schublade__tafel"><div class="schublade__kopf"><span>Your cart</span><button class="symbol" data-zu aria-label="Close"><svg><use href="#i-zu"/></svg></button></div>
  <div class="korb__liste" id="korb-liste"></div>
  <div class="korb__fuss">
    <div class="korb__summe"><span>Subtotal</span><span id="korb-summe">$0.00</span></div>
    <div class="korb__klein">Free US shipping. Taxes calculated at checkout.</div>
    <button class="knopf" data-kasse>Checkout</button>
    <div class="unter-knopf" style="margin-top:12px">
      <div><svg><use href="#i-schild"/></svg><span><b>30-day guarantee:</b> not their thing? Full refund, keep the bed.</span></div>
    </div>
  </div></div></div>
<div class="toast" id="toast" role="status"></div>'''


def zahlarten():
    return ('<div class="zahlarten" aria-label="Payment methods"><span>VISA</span><span>MC</span><span>AMEX</span>'
            '<span>Apple Pay</span><span>G Pay</span><span>Shop Pay</span></div>')


def fuss(b):
    return f'''<footer class="fuss"><div class="huelle">
  <div class="fuss__raster">
    <div><img class="fuss__logo" src="{b}/img/logo_creme.webp" alt="Porchnap" width="90" height="20">
      <p style="margin:0;max-width:340px">Cozy beds for dogs who love to curl up. Questions? We answer every email within one business day.</p>
      <p style="margin:12px 0 0"><a href="mailto:support@porchnap.com">support@porchnap.com</a></p></div>
    <div><h5>Shop</h5><ul><li><a href="{b}/products/porchnap-nap-nest/">Nap Nest</a></li><li><a href="{b}/products/porchnap-nap-nest/#groessen">Size guide</a></li><li><a href="{b}/products/porchnap-nap-nest/#bewertungen">Reviews</a></li></ul></div>
    <div><h5>Help</h5><ul><li><a href="{b}/products/porchnap-nap-nest/#fragen">FAQ</a></li><li><a href="{b}/products/porchnap-nap-nest/#garantie">30-day guarantee</a></li><li><a href="mailto:support@porchnap.com">Contact</a></li></ul></div>
  </div>
  {zahlarten()}
  <div class="fuss__klein">© 2026 Porchnap · Preview build, not a live store. Reviews shown are placeholders.</div>
</div></footer>'''
