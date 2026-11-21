#!/usr/bin/env python3
"""Gera o material gráfico da Lista B (CC e CR) com o visual dos sites.

Uso:  python3 cartazes/gerar.py            (na raiz do repositório)
Sai:  cartazes/cartaz-cc.pdf/.png e cartazes/cartaz-cr.pdf/.png   cartazes A3, 300 dpi
      assets/logo/*.png                                           logótipos (claro, escuro e só a caixa)
      cientifico/og.png e representantes/og.png                   imagem de partilha (1200x630)

Candidatos, fotos e cores são lidos de cientifico/data.js e representantes/data.js.
Os textos próprios do cartaz (frases curtas das prioridades, nomes abreviados)
estão no dicionário POSTERS e em NOMES, mais abaixo.
"""
import os, re, subprocess, tempfile
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HERE = os.path.join(ROOT, "cartazes")
PW, PH = 3508, 4961            # A3 a 300 dpi
W, H = 842.0, 1191.0           # A3 em pontos
S = PW / W
M = 52                         # margem lateral (pt)

INK, MUTED, PAPER, CARD, LINE, NIGHT = "#161d33", "#5b6579", "#f8f6f1", "#ffffff", "#e4e0d6", "#121930"

# Nomes abreviados (os que cada pessoa usa no SIGARRA), para caberem em letra grande.
NOMES = {
    "202378": "Joaquim Esteves da Silva", "202640": "Alexandre Magalhães", "202659": "José Luís Santos",
    "202781": "Luís Santos", "202806": "Carlos Pereira", "203278": "António Guerner Dias",
    "203285": "José Ferreira Alves", "210334": "Sílvio Gama", "232080": "Rita Gaio",
    "236853": "José Gonçalves", "238695": "Manuel Eduardo Correia", "239074": "Alexandre Lima",
    "248004": "Eduardo Marques", "249128": "Paulo Marques", "249438": "Helena Ribeiro",
    "405494": "Luís Miguel Cunha", "427256": "Inês Dutra", "449052": "Renata Costa",
    "480749": "Luís Pinto da Silva", "485238": "Orfeu Bertolami", "555941": "Alexandra Gaspar",
    "571189": "Rolando Martins", "582375": "Carlos Lima",
}

POSTERS = {
    "cc": {
        "pasta": "cientifico",
        "prio_titulo": "Quatro pilares para o Conselho Científico",
        "prios": [
            ("Transparência, independência e debate", "Fóruns regulares de discussão e um Conselho autónomo dos restantes órgãos de gestão."),
            ("Planeamento e valorização das pessoas", "Plano plurianual de recursos docentes, renovação geracional e combate à precariedade."),
            ("Qualidade académica e inovação", "Rigor pedagógico e científico acima de lógicas administrativas."),
            ("Região e sociedade", "Uma escola de portas abertas, em cooperação com o ecossistema regional."),
        ],
    },
    "cr": {
        "pasta": "representantes",
        "prio_titulo": "Cinco eixos de supervisão e influência",
        "prios": [
            ("Estratégia e Modernização", "O CR como catalisador estratégico da Faculdade."),
            ("Escrutínio e Compromisso Transparente", "Fiscalização rigorosa e permanente das atividades de gestão."),
            ("Participação, Proximidade e Diálogo Aberto", "Elemento de ligação entre a comunidade e os órgãos executivos."),
            ("Interação com a Região e Sociedade", "Parcerias estratégicas e laços com o tecido regional e social."),
            ("Uma Faculdade a Pensar no Futuro", "Preparar o futuro, com pluralidade e renovação democrática."),
        ],
    },
}
DATA_TXT = "25 de novembro de 2026"
DIA_TXT = "Quarta-feira, 25 de novembro de 2026"
HORA_TXT = "10h às 18h · átrio dos edifícios FC4/FC5"
VOTO_TXT = "Voto presencial"

# ---------------------------------------------------------------- utilitários
def rgb(h): h = h.lstrip("#"); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
def mix(a, b, t): a, b = rgb(a), rgb(b); return tuple(round(a[i] * t + b[i] * (1 - t)) for i in range(3))
def px(v): return int(round(v * S))

_fonts = {}
def fontpx(kind, size_px, wght=400, opsz=None):
    key = (kind, size_px, wght, opsz)
    if key not in _fonts:
        f = {"serif": "Fraunces.ttf", "serif-i": "Fraunces-Italic.ttf", "sans": "Inter.ttf"}[kind]
        ft = ImageFont.truetype(os.path.join(HERE, "fonts", f), size_px)
        ft.set_variation_by_axes([opsz or 144, wght, 0, 0] if kind != "sans" else [opsz or 14, wght])
        _fonts[key] = ft
    return _fonts[key]
def font(kind, size, wght=400):
    return fontpx(kind, px(size), wght, min(144, max(9, size)) if kind != "sans" else min(32, max(14, size)))

# ---------------------------------------------------------------- logótipo
def _texto(im, xy, s, ft, cor):
    """Texto sobre fundo transparente sem franjas escuras nas margens."""
    m = Image.new("L", im.size, 0); ImageDraw.Draw(m).text(xy, s, font=ft, fill=255, anchor="ls")
    cam = Image.new("RGBA", im.size, (*cor, 0)); cam.putalpha(m); im.alpha_composite(cam)

def tracos_mao(n=18, cap=7):
    """Os dois traços da cruz «à mão», como polígonos em unidades do lado da caixa (origem no canto superior esquerdo)."""
    import math
    def traco(p0, p1, w0, w1, curva):
        (x0, y0), (x1, y1) = p0, p1; L = math.hypot(x1 - x0, y1 - y0)
        nx, ny = -(y1 - y0) / L, (x1 - x0) / L; cx, cy = (x0 + x1) / 2 + nx * curva * L, (y0 + y1) / 2 + ny * curva * L
        esq, dir_, pts = [], [], []
        for i in range(n + 1):
            t = i / n; x = (1 - t) ** 2 * x0 + 2 * t * (1 - t) * cx + t * t * x1; y = (1 - t) ** 2 * y0 + 2 * t * (1 - t) * cy + t * t * y1
            tx, ty = 2 * (1 - t) * (cx - x0) + 2 * t * (x1 - cx), 2 * (1 - t) * (cy - y0) + 2 * t * (y1 - cy); tl = math.hypot(tx, ty); tx, ty = tx / tl, ty / tl
            r = (w0 + (w1 - w0) * t) / 2; pts.append((x, y, tx, ty, r))
            esq.append((x - ty * r, y + tx * r)); dir_.append((x + ty * r, y - tx * r))
        def meia(x, y, tx, ty, r, s_):   # meia-lua na ponta, de «esq» para «dir» (s_=1 no fim, -1 no início)
            return [(x + r * (-ty * math.cos(a) * s_ + tx * math.sin(a) * s_), y + r * (tx * math.cos(a) * s_ + ty * math.sin(a) * s_))
                    for a in (math.pi * k / (cap + 1) for k in range(1, cap + 1))]
        return esq + meia(*pts[-1], 1) + dir_[::-1] + meia(*pts[0], -1)
    return [traco((.24, .27), (.77, .78), .15, .10, .05), traco((1.10, -.12), (.25, .78), .07, .16, -.07)]

def marca_svg(n=18, cap=7, casas=1):
    """SVG da marca «à mão» (viewBox 0 0 49 48; caixa de 40 com origem em 2,7), para colar no site."""
    f = lambda v: ("%.*f" % (casas, v)).rstrip("0").rstrip(".")
    ds = ["M" + "L".join(f"{f(2 + 40 * x)} {f(7 + 40 * y)}" for x, y in pol) + "Z" for pol in tracos_mao(n, cap)]
    return '<rect x="3.7" y="8.7" width="36.6" height="36.6" rx="7.4"/>' + "".join(f'<path d="{d}"/>' for d in ds)

def marca(h, cor, escuro=False, mao=False):
    """A caixa do boletim de voto com a cruz (RGBA, altura h). mao=True: cruz desenhada à mão, a sair da caixa."""
    k = 4; n = h * k; borda = rgb("#ffffff" if escuro else NIGHT)
    if mao:
        u = n / 48; im = Image.new("RGBA", (round(n * 49 / 48), n), (*borda, 0)); d = ImageDraw.Draw(im)
        d.rounded_rectangle([2 * u, 7 * u, 42 * u, 47 * u], round(9.1 * u), fill="#ffffff", outline=borda, width=round(3.4 * u))
        for pol in tracos_mao(40): d.polygon([((2 + 40 * x) * u, (7 + 40 * y) * u) for x, y in pol], fill=cor)
        return im.resize((im.width // k, h), Image.LANCZOS)
    im = Image.new("RGBA", (n, n), (*borda, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, n - 1, n - 1], round(n * 0.24), fill="#ffffff", outline=borda, width=round(n * 0.08))
    a, b, lw = n * 0.31, n * 0.69, round(n * 0.115)
    for x0, y0, x1, y1 in ((a, a, b, b), (b, a, a, b)):
        d.line([x0, y0, x1, y1], fill=cor, width=lw)
        for ex, ey in ((x0, y0), (x1, y1)): d.ellipse([ex - lw / 2, ey - lw / 2, ex + lw / 2, ey + lw / 2], fill=cor)
    return im.resize((h, h), Image.LANCZOS)

def logo(h, cor, sub=None, escuro=False, lista="B", mao=False):
    """Logótipo: caixa com cruz + «Lista B» (+ linha do órgão). RGBA, fundo transparente, altura h."""
    c1 = rgb("#ffffff" if escuro else INK); cb = mix(cor, "#ffffff", 0.42) if escuro else rgb(cor)
    c2 = mix("#ffffff", NIGHT, 0.76) if escuro else rgb(MUTED)
    f1 = fontpx("serif", round(h * (0.70 if sub else 0.88)), 700, 30)   # opsz baixo: traços mais cheios, lê-se melhor
    f2 = fontpx("sans", round(h * 0.27), 600, 20)
    m = marca(h, cor, escuro, mao); mw = m.width if not mao else round(h * 42 / 48)
    gap = round(h * 0.30); w1 = f1.getlength("Lista "); wb = f1.getlength(lista)
    wt = max(w1 + wb, f2.getlength(sub) if sub else 0)
    x = mw + gap + (round(h * 0.06) if mao else 0)
    im = Image.new("RGBA", (int(x + wt + h * 0.06) + 2, h), (*c1, 0)); im.alpha_composite(m)
    base = round(h * (0.62 if mao else 0.60)) if sub else round(h * 0.81)
    _texto(im, (x, base), "Lista ", f1, c1); _texto(im, (x + w1, base), lista, f1, cb)
    if sub: _texto(im, (x + round(h * 0.02), round(h * 0.965)), sub, f2, c2)
    return im

def tw(s, ft, track=0): return ft.getlength(s) / S + track * max(0, len(s) - 1)

class Canvas:
    def __init__(self, bg, size=(PW, PH)):
        self.im = Image.new("RGB", size, bg); self.d = ImageDraw.Draw(self.im)
    def cola(self, x, y, im):
        self.im.paste(im, (px(x), px(y)), im)
    def text(self, x, y, s, ft, fill, anchor="ls", track=0):
        """x, y em pt; y é a linha de base."""
        if not track:
            self.d.text((px(x), px(y)), s, font=ft, fill=fill, anchor=anchor); return
        if anchor[0] == "r": x -= tw(s, ft, track)
        elif anchor[0] == "m": x -= tw(s, ft, track) / 2
        for ch in s:
            self.d.text((px(x), px(y)), ch, font=ft, fill=fill, anchor="l" + anchor[1]); x += ft.getlength(ch) / S + track
    def rrect(self, x0, y0, x1, y1, r, fill=None, outline=None, width=0.75, alpha=None):
        box = [px(x0), px(y0), px(x1), px(y1)]
        if alpha is None:
            self.d.rounded_rectangle(box, px(r), fill=fill, outline=outline, width=max(1, px(width)) if outline else 0); return
        ov = Image.new("RGBA", (box[2] - box[0] + 1, box[3] - box[1] + 1), (0, 0, 0, 0)); od = ImageDraw.Draw(ov)
        f = (*(rgb(fill) if isinstance(fill, str) else fill), round(255 * alpha[0])) if fill else None
        o = (*(rgb(outline) if isinstance(outline, str) else outline), round(255 * alpha[1])) if outline else None
        od.rounded_rectangle([0, 0, ov.width - 1, ov.height - 1], px(r), fill=f, outline=o, width=max(1, px(width)) if o else 0)
        self.im.paste(ov, (box[0], box[1]), ov)
    def night(self, y0, y1, accent, grid=True, glows=((0.88, 0.08, 0.55, 0.75, 0.60), (0.0, 1.0, 0.45, 0.60, 0.30))):
        """Fundo escuro do hero do site: brilhos radiais na cor de destaque e grelha ténue."""
        k = 4; w, h = self.im.width // k, (px(y1) - px(y0)) // k
        yy, xx = np.mgrid[0:h, 0:w].astype(np.float32); xx /= w; yy /= h
        img = np.empty((h, w, 3), np.float32); img[:] = rgb(NIGHT)
        ac = np.array(rgb(accent), np.float32)
        for cx, cy, rx, ry, a in glows:
            dist = np.sqrt(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2)
            al = (a * np.clip(1 - dist / 0.70, 0, 1))[..., None]
            img = img * (1 - al) + ac * al
        if grid:
            step = 44 * S / k; fade = np.clip(1 - yy / 0.85, 0, 1) * 0.045
            gx = (np.mod(xx * w, step) < 1.2); gy = (np.mod(yy * h, step) < 1.2)
            al = (fade * (gx | gy))[..., None]; img = img * (1 - al) + 255 * al
        tile = Image.fromarray(img.clip(0, 255).astype(np.uint8)).resize((self.im.width, px(y1) - px(y0)), Image.BICUBIC)
        self.im.paste(tile, (0, px(y0)))

def wrap(s, ft, maxw):
    out, cur = [], ""
    for w_ in s.split():
        t = (cur + " " + w_).strip()
        if cur and tw(t, ft) > maxw: out.append(cur); cur = w_
        else: cur = t
    if cur: out.append(cur)
    return out

def avatar(path, d):
    """Recorte circular como no site (object-fit: cover; object-position: center 18%)."""
    im = Image.open(path).convert("RGB"); w, h = im.size; s = min(w, h)
    left, top = (w - s) // 2, int((h - s) * 0.18)
    im = im.crop((left, top, left + s, top + s)).resize((d, d), Image.LANCZOS)
    m = Image.new("L", (d * 4, d * 4), 0); ImageDraw.Draw(m).ellipse([0, 0, d * 4 - 1, d * 4 - 1], fill=255)
    return im, m.resize((d, d), Image.LANCZOS)

def ler_site(pasta):
    s = open(os.path.join(ROOT, pasta, "data.js"), encoding="utf-8").read()
    g = lambda k: re.search(r'"?%s"?:\s*"([^"]*)"' % k, s).group(1)
    site = {k: g(k) for k in ("lista", "orgao", "instituicao", "ano", "dominio", "cor", "lead")}
    site["titulo"], site["destaque"] = re.search(r'hero:\s*\{\s*"titulo":\s*"([^"]*)",\s*"destaque":\s*"([^"]*)"', s).groups()
    site["grupos"] = []
    for m in re.finditer(r'titulo:\s*"(Efetivos|Suplentes)",\s*membros:\s*\[(.*?)\n\s*\],', s, re.S):
        mem = [dict(nome=a, categoria=b, unidade=c, foto=d_, cod=e) for a, b, c, d_, e in re.findall(
            r'nome:\s*"([^"]*)",\s*categoria:\s*"([^"]*)",\s*unidade:\s*"([^"]*)".*?foto:\s*"([^"]*)".*?p_codigo=(\d+)', m.group(2))]
        site["grupos"].append((m.group(1), mem))
    return site

def qr(url, size):
    with tempfile.TemporaryDirectory() as t:
        f = os.path.join(t, "q.png")
        subprocess.run(["qrencode", "-o", f, "-s", "1", "-m", "0", "-l", "M", "--foreground=121930", url], check=True)
        q = Image.open(f).convert("RGB"); k = size // q.width          # módulos com um número inteiro de píxeis
        out = Image.new("RGB", (size, size), "#ffffff"); q = q.resize((q.width * k, q.width * k), Image.NEAREST)
        out.paste(q, ((size - q.width) // 2, (size - q.width) // 2)); return out

# ---------------------------------------------------------------- cartaz
def cartaz(chave):
    cfg = POSTERS[chave]; site = ler_site(cfg["pasta"]); pasta = os.path.join(ROOT, cfg["pasta"])
    AC = site["cor"]; AC_LIGHT = mix(AC, "#ffffff", 0.42); AC_SOFT = mix(AC, "#ffffff", 0.11)
    c = Canvas(PAPER); orgao = site["orgao"]

    # ---------- hero (medir primeiro, desenhar depois) ----------
    card_w = 236; card_x = W - M - card_w; col_w = card_x - M - 34
    words = [(w_, False) for w_ in site["titulo"].split()] + [(w_, True) for w_ in site["destaque"].split()]
    for hs in range(50, 34, -1):
        fr, fi = font("serif", hs, 700), font("serif-i", hs, 700); sp = hs * 0.24
        lines, cur, curw = [], [], 0
        for w_, em in words:
            ww = tw(w_, fi if em else fr)
            if cur and curw + sp + ww > col_w: lines.append(cur); cur, curw = [], 0
            curw += (sp if cur else 0) + ww; cur.append((w_, em))
        lines.append(cur)
        if len(lines) <= 4: break
    lead_f = font("sans", 13.5, 400); lead = wrap(site["lead"], lead_f, col_w)
    y_brand, y_pill = 40, 98
    y_h1 = y_pill + 26 + 20 + hs * 0.82                      # linha de base da 1.ª linha
    y_lead = y_h1 + (len(lines) - 1) * hs * 1.06 + 38
    card_y, card_h = 40, 342
    hero_h = max(y_lead + (len(lead) - 1) * 20 + 36, card_y + card_h + 34)
    c.night(0, hero_h, AC)

    # logótipo
    c.cola(M, y_brand, logo(px(40), AC, f"{orgao} · {site['instituicao']} {site['ano']}", escuro=True, lista=site["lista"]))
    # pílula
    ptxt = "Faculdade de Ciências · Universidade do Porto"
    pf = font("sans", 10.5, 600); pwid = tw(ptxt, pf) + 44
    c.rrect(M, y_pill, M + pwid, y_pill + 26, 13, fill="#ffffff", outline="#ffffff", alpha=(0.10, 0.20))
    c.d.ellipse([px(M + 13), px(y_pill + 10), px(M + 19), px(y_pill + 16)], fill=AC_LIGHT)
    c.text(M + 27, y_pill + 13.2, ptxt, pf, "#ffffff", "lm")
    # título
    y = y_h1
    for ln in lines:
        x = M
        for w_, em in ln:
            f_ = fi if em else fr
            c.text(x, y, w_, f_, AC_LIGHT if em else "#ffffff"); x += tw(w_, f_) + sp
        y += hs * 1.06
    y = y_lead
    for ln in lead:
        c.text(M, y, ln, lead_f, mix("#ffffff", NIGHT, 0.80)); y += 20

    # cartão de voto (vidro) com boletim e código QR
    cx0, cy0 = card_x, card_y
    c.rrect(cx0, cy0, cx0 + card_w, cy0 + card_h, 20, fill="#ffffff", outline="#ffffff", alpha=(0.09, 0.22))
    c.text(cx0 + 20, cy0 + 30, "NO BOLETIM DE VOTO", font("sans", 8.5, 800), mix("#ffffff", NIGHT, 0.72), track=1.2)
    bx0, by0, bx1, by1 = cx0 + 16, cy0 + 42, cx0 + card_w - 16, cy0 + 106
    c.rrect(bx0, by0, bx1, by1, 13, fill="#ffffff")
    c.cola(bx0 + 12, by0 + 11, marca(px(42), AC))
    fb = font("serif", 26, 700)
    c.text(bx0 + 66, by0 + 34, "Lista ", fb, NIGHT); c.text(bx0 + 66 + tw("Lista ", fb), by0 + 34, site["lista"], fb, AC)
    c.text(bx0 + 66, by0 + 49, orgao, font("sans", 9.2, 500), MUTED)
    c.text(cx0 + 20, cy0 + 132, DATA_TXT, font("sans", 14.5, 700), "#ffffff")
    c.text(cx0 + 20, cy0 + 149, "Quarta-feira · 10h às 18h", font("sans", 10.5, 500), mix("#ffffff", NIGHT, 0.80))
    c.text(cx0 + 20, cy0 + 164, "Átrio FC4/FC5 · voto presencial", font("sans", 10.5, 500), mix("#ffffff", NIGHT, 0.80))
    qs, qpad = 96, 16                                        # margem branca de 4 módulos à volta do código
    qx = cx0 + (card_w - qs - 2 * qpad) / 2; qy = cy0 + 180
    c.rrect(qx, qy, qx + qs + 2 * qpad, qy + qs + 2 * qpad, 13, fill="#ffffff")
    c.im.paste(qr("https://" + site["dominio"], px(qs)), (px(qx + qpad), px(qy + qpad)))
    c.text(cx0 + card_w / 2, cy0 + card_h - 16, site["dominio"], font("sans", 13, 800), "#ffffff", "ms")

    # ---------- prioridades ----------
    def cabecalho(y, eyebrow, titulo):
        c.d.rectangle([px(M), px(y - 3.6), px(M + 24), px(y - 2.2)], fill=AC)
        c.text(M + 32, y, eyebrow, font("sans", 9, 800), AC, track=1.4)
        c.text(M, y + 27, titulo, font("serif", 22, 700), INK)
        return y + 27
    y = cabecalho(hero_h + 30, "PRIORIDADES", cfg["prio_titulo"]) + 15
    n = len(cfg["prios"]); gap = 11; cw = (W - 2 * M - gap * (n - 1)) / n; pad = 12; chip = 26
    tf = font("sans", 11.2 if n <= 4 else 10.2, 700); xf = font("sans", 9.4 if n <= 4 else 8.8, 400)
    tl, xl = (14.2, 13.2) if n <= 4 else (13.2, 12.4)
    blocos = [(wrap(t, tf, cw - 2 * pad), wrap(x_, xf, cw - 2 * pad)) for t, x_ in cfg["prios"]]
    maxt = max(len(b[0]) for b in blocos)
    ch = pad + chip + 14 + maxt * tl + 3 + max(len(b[1]) for b in blocos) * xl + pad - 5
    for i, (tls, xls) in enumerate(blocos):
        x0 = M + i * (cw + gap)
        c.rrect(x0, y, x0 + cw, y + ch, 13, fill=CARD, outline=LINE)
        c.rrect(x0 + pad, y + pad, x0 + pad + chip, y + pad + chip, 8, fill=AC_SOFT)
        c.text(x0 + pad + chip / 2, y + pad + chip / 2 + 0.5, str(i + 1), font("serif", 14.5, 700), AC, "mm")
        yy = y + pad + chip + 14 + 2
        for ln in tls: c.text(x0 + pad, yy, ln, tf, INK); yy += tl
        yy = y + pad + chip + 14 + maxt * tl + 5
        for ln in xls: c.text(x0 + pad, yy, ln, xf, MUTED); yy += xl
    y += ch

    # ---------- candidatos ----------
    foot_h = 76; foot_y = H - foot_h
    y = cabecalho(y + 30, "CANDIDATOS", "Os nossos candidatos") + 10
    gapc = 16; colw = (W - 2 * M - gapc) / 2
    rows = max(len(m) for _, m in site["grupos"])
    y_lbl = y + 15; y_rows = y_lbl + 9
    pitch = min(46, (foot_y - 16 - y_rows + 5) / rows); rh = pitch - 5; av = rh - 8
    nf = font("sans", min(14, rh * 0.40), 700); cf = font("sans", min(9.6, rh * 0.275), 500); tgf = font("sans", 8.2, 800)
    for gi, (titulo, membros) in enumerate(site["grupos"]):
        x0 = M + gi * (colw + gapc)
        c.text(x0, y_lbl, titulo.upper(), font("sans", 9.5, 800), INK, track=1.3)
        c.text(x0 + colw, y_lbl, f"{len(membros)} candidatos", font("sans", 9, 500), MUTED, "rs")
        for i, m in enumerate(membros):
            ry = y_rows + i * pitch
            c.rrect(x0, ry, x0 + colw, ry + rh, 11, fill=CARD, outline=LINE)
            d_ = px(av); im, mask = avatar(os.path.join(pasta, m["foto"]), d_)
            c.text(x0 + 16, ry + rh / 2 + 0.3, str(i + 1), font("sans", 11, 800), AC, "mm")
            ax, ay = x0 + 30, ry + 4
            c.im.paste(im, (px(ax), px(ay)), mask)
            tx = ax + av + 11
            c.text(tx, ry + rh * 0.46, NOMES.get(m["cod"], m["nome"]), nf, INK)
            c.text(tx, ry + rh * 0.80, m["categoria"], cf, MUTED)
            tgw = tw(m["unidade"], tgf, 0.5) + 14
            c.rrect(x0 + colw - 10 - tgw, ry + rh / 2 - 8, x0 + colw - 10, ry + rh / 2 + 8, 5, fill=AC_SOFT)
            c.text(x0 + colw - 10 - tgw / 2, ry + rh / 2 + 0.3, m["unidade"], tgf, AC, "mm", track=0.5)

    # ---------- rodapé ----------
    c.night(foot_y, H, AC, grid=False, glows=((1.0, 0.0, 0.45, 1.6, 0.55), (0.0, 1.0, 0.30, 1.2, 0.25)))
    c.cola(M, foot_y + 19, marca(px(38), AC, escuro=True))
    f1, f2 = font("serif", 27, 700), font("serif-i", 27, 700); fx = M + 52
    c.text(fx, foot_y + 36, "Vote", f1, "#ffffff")
    c.text(fx + tw("Vote", f1) + 7, foot_y + 36, f"Lista {site['lista']}", f2, AC_LIGHT)
    c.text(fx, foot_y + 56, f"{DIA_TXT} · {HORA_TXT}", font("sans", 10.8, 500), mix("#ffffff", NIGHT, 0.82))
    uf = font("sans", 15, 800); uw = tw(site["dominio"], uf) + 34
    c.rrect(W - M - uw, foot_y + 20, W - M, foot_y + 56, 18, fill=AC)
    c.text(W - M - uw / 2, foot_y + 38.3, site["dominio"], uf, "#ffffff", "mm")

    base = os.path.join(HERE, f"cartaz-{chave}")
    c.im.save(base + ".png", optimize=True, dpi=(300, 300))
    c.im.save(base + ".pdf", resolution=300.0, quality=95, title=f"Lista {site['lista']} · {orgao} · {site['instituicao']} {site['ano']}")
    print("gerado:", base + ".pdf", "/ .png")

def partilha(chave):
    """Imagem de pré-visualização das ligações (og.png, 1200x630)."""
    global S
    site = ler_site(POSTERS[chave]["pasta"]); AC = site["cor"]; S0, S = S, 1.0
    try:
        c = Canvas(NIGHT, (1200, 630)); c.night(0, 630, AC, grid=False)
        c.cola(80, 60, logo(96, AC, f"{site['orgao']} · {site['instituicao']} {site['ano']}", escuro=True, lista=site["lista"], mao=True))
        for hs in range(78, 40, -2):
            fr, fi = font("serif", hs, 700), font("serif-i", hs, 700)
            if max(tw(site["titulo"], fr), tw(site["destaque"], fi)) <= 1040: break
        c.text(80, 318, site["titulo"], fr, "#ffffff"); c.text(80, 318 + hs * 1.14, site["destaque"], fi, mix(AC, "#ffffff", 0.42))
        pf = font("sans", 25, 700); pt = f"{DATA_TXT} · 10h às 18h"; pw_ = tw(pt, pf) + 56
        c.rrect(80, 500, 80 + pw_, 560, 30, fill="#ffffff"); c.text(108, 531, pt, pf, NIGHT, "lm")
        c.text(80 + pw_ + 28, 531, "Átrio FC4/FC5 · voto presencial", font("sans", 23, 500), mix("#ffffff", NIGHT, 0.82), "lm")
        c.im.save(os.path.join(ROOT, POSTERS[chave]["pasta"], "og.png"), optimize=True)
    finally: S = S0

def logos(chave):
    site = ler_site(POSTERS[chave]["pasta"]); AC = site["cor"]; d = os.path.join(ROOT, "assets", "logo"); os.makedirs(d, exist_ok=True)
    sub = f"{site['orgao']} · {site['instituicao']} {site['ano']}"
    logo(256, AC, sub, lista=site["lista"], mao=True).save(os.path.join(d, f"lista-b-{chave}.png"))
    logo(256, AC, sub, escuro=True, lista=site["lista"], mao=True).save(os.path.join(d, f"lista-b-{chave}-escuro.png"))
    marca(512, AC, mao=True).save(os.path.join(d, f"marca-{chave}.png"))

if __name__ == "__main__":
    import sys
    if "--svg" in sys.argv: print(marca_svg()); sys.exit()
    for k in POSTERS:
        logos(k); partilha(k)
        if "--sem-cartazes" not in sys.argv: cartaz(k)
