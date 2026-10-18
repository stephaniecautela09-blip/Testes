"""Monta ansiedade.html e depressao.html a partir do estilo, do motor e do script de cada página.

Uso: python3 src/build.py
"""
from pathlib import Path

SRC = Path(__file__).parent
ROOT = SRC.parent
FONTS = (
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400'
    '&family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=IBM+Plex+Mono:wght@400;500&display=swap">\n'
)
PAGES = {
    "ansiedade": ("Avaliação de Ansiedade", "Avaliação detalhada de ansiedade: GAD-7, critérios do TAG, pânico, ansiedade social, agorafobia, TEPT e OASIS. Não é diagnóstico."),
    "depressao": ("Avaliação de Depressão", "Avaliação detalhada de depressão: PHQ-9, gravidade e especificadores do DSM-5-TR, anedonia, risco de suicídio e bipolaridade. Não é diagnóstico."),
}

style = (SRC / "style.html").read_text(encoding="utf-8")
engine = (SRC / "engine.js").read_text(encoding="utf-8")
for name, (title, desc) in PAGES.items():
    page_js = (SRC / f"{name}.js").read_text(encoding="utf-8")
    html = (
        f"<title>{title}</title>\n"
        '<meta name="claude:viewport-fit-sides" content="cover">\n'
        f'<meta name="description" content="{desc}">\n'
        f"{FONTS}{style}\n"
        "<!-- Gerado por src/build.py; edite os arquivos em src/. -->\n"
        '<div class="wrap" id="app"></div>\n\n'
        f"<script>\n{page_js}</script>\n<script>\n{engine}</script>\n"
    )
    (ROOT / f"{name}.html").write_text(html, encoding="utf-8")
    print(f"{name}.html: {len(html)} bytes")
