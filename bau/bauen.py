# Baut die Vorschau-Seiten: bau/seiten/<ziel>.html -> <ziel>, Platzhalter {{...}} aus teile.py.
# Aufruf: python3 -I bau/bauen.py   (aus dem Ordner curlmoon)
import pathlib, re, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import teile

WURZEL = pathlib.Path(__file__).resolve().parent.parent
SYMBOLE = (WURZEL / 'assets/symbole.svg.html').read_text()
SEITEN = {
    'index.html': '.',
    'products/curlmoon-nest/index.html': '../..',
    'pages/about-us/index.html': '../..',
    'pages/contact/index.html': '../..',
    'pages/shipping-policy/index.html': '../..',
    'pages/refund-policy/index.html': '../..',
}
# 02.11.2026: keine Bewertungen und keine Sterne, solange es keine echten Kunden gibt (Playbook D22, Musk-Urteil 11:09).
# Abschnitte je Seite, in dieser Reihenfolge aus bau/teil_<name>.html (Begründung je Abschnitt: ANALYSE.md)
ABSCHNITTE = {
    'index.html': ['vergleich', 'band', 'garantie', 'fragen', 'schluss_home'],
    'products/curlmoon-nest/index.html': ['vergleich', 'band', 'garantie', 'groessen', 'fragen', 'schluss'],
}

for ziel, b in SEITEN.items():
    quelle = WURZEL / 'bau/seiten' / ziel.replace('/', '__')
    t = quelle.read_text()
    block = '<!--ABSCHNITTE_ANFANG-->\n' + '\n'.join((WURZEL / f'bau/teil_{k}.html').read_text() for k in ABSCHNITTE.get(ziel, [])) + '\n<!--ABSCHNITTE_ENDE-->'
    t = re.sub(r'<!--ABSCHNITTE_ANFANG-->.*?<!--ABSCHNITTE_ENDE-->', lambda m: block, t, flags=re.S)
    ersatz = {
        'VORSCHAU': teile.vorschau(), 'LEISTE': teile.leiste(), 'KOPF': teile.kopf(b),
        'SCHUBLADEN': teile.schubladen(b), 'FUSS': teile.fuss(b), 'SYMBOLE': SYMBOLE,
        'ZAHLARTEN': teile.zahlarten(), 'B': b,
    }
    t = re.sub(r'\{\{(\w+)\}\}', lambda m: ersatz[m.group(1)], t)
    aus = WURZEL / ziel
    aus.parent.mkdir(parents=True, exist_ok=True)
    aus.write_text(t)
    print('gebaut', ziel, len(t), 'Zeichen')
