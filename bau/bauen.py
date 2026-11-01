# Baut die Vorschau-Seiten: bau/seiten/<ziel>.html -> <ziel>, Platzhalter {{...}} aus teile.py.
# Aufruf: python3 -I bau/bauen.py   (aus dem Ordner porchnap-vorschau)
import pathlib, re, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import teile

WURZEL = pathlib.Path(__file__).resolve().parent.parent
SYMBOLE = (WURZEL / 'assets/symbole.svg.html').read_text()
SEITEN = {
    'index.html': '.',
    'products/porchnap-nap-nest/index.html': '../..',
}

for ziel, b in SEITEN.items():
    quelle = WURZEL / 'bau/seiten' / ziel.replace('/', '__')
    t = quelle.read_text()
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
