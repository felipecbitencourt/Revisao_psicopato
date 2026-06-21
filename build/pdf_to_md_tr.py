#!/usr/bin/env python3
"""Extrai os 20 capítulos clínicos do DSM-5-TR (tradução Artmed, PDF digital)
para markdown por transtorno.

Robustez:
- escala tipográfica detectada POR CAPÍTULO (cada capítulo usa tamanhos
  diferentes — Neurodesenvolvimento corpo 9pt, Substâncias corpo 6pt);
- segmentação ANCORADA nos nomes de transtornos que já existem em md/
  (ground-truth), tolerante a diferenças de redação DSM-5 → DSM-5-TR;
- reconstrução do bloco de Critérios (re-letra A/B/C/D + quebra itens 1/2/3).

Saída: build/_pilot_tr/<slug>/   (NÃO toca em md/).
"""
from __future__ import annotations

import re
import sys
import unicodedata
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / "manual-diagnostico-e-estatistico-de-transtornos-mentais-dsm-5-tr-9780890425763-9786558820949_compress.pdf"
MD = ROOT / "md" / "categorias"
OUTROOT = ROOT / "build" / "_pilot_tr"

# (slug, primeira página, última página) — índices fitz, inclusive
CHAPTERS = [
    ("01-transtornos-do-neurodesenvolvimento", 131, 217),
    ("02-espectro-da-esquizofrenia-e-outros-transtornos-psicoticos", 218, 265),
    ("03-transtorno-bipolar-e-transtornos-relacionados", 266, 313),
    ("04-transtornos-depressivos", 314, 363),
    ("05-transtornos-de-ansiedade", 364, 425),
    ("06-transtorno-obsessivo-compulsivo-e-transtornos-relacionados", 426, 467),
    ("07-transtornos-relacionados-a-trauma-e-a-estressores", 468, 511),
    ("08-transtornos-dissociativos", 512, 537),
    ("09-transtorno-de-sintomas-somaticos-e-transtornos-relacionados", 538, 566),
    ("10-transtornos-alimentares", 567, 601),
    ("11-transtornos-da-eliminacao", 602, 610),
    ("12-transtornos-do-sono-vigilia", 611, 703),
    ("13-disfuncoes-sexuais", 704, 746),
    ("14-disforia-de-genero", 747, 760),
    ("15-transtornos-disruptivos-do-controle-de-impulsos-e-da-conduta", 761, 788),
    ("16-transtornos-relacionados-a-substancias-e-transtornos-aditivos", 789, 871),
    ("17-transtornos-neurocognitivos", 872, 944),
    ("18-transtornos-da-personalidade", 945, 1003),
    ("19-transtornos-parafilicos", 1004, 1034),
    ("20-outros-transtornos-mentais", 1035, 1074),
]

CODE_RE = re.compile(r"\s+([A-TV-Z]\d{2}(?:\.\d+\w*)?)\s*$")
NUM_ONLY_RE = re.compile(r"^\**\d{1,4}\**$")


def norm(s: str) -> str:
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    s = re.sub(r"[^a-z0-9 ]", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def slugify(s: str) -> str:
    return re.sub(r"[\s_]+", "-", norm(s)).strip("-")


def span_md(s: dict) -> str:
    t = s["text"]
    if not t:
        return ""
    f = s["font"]
    if "Italic" in f and "Bold" not in f:
        return f"*{t}*"
    if "Bold" in f:
        return f"**{t}**"
    return t


def block_plain(b: dict) -> str:
    lines = ["".join(s["text"] for s in l["spans"]) for l in b["lines"]]
    return re.sub(r"\s+", " ", " ".join(lines)).strip()


def block_rich(b: dict) -> str:
    lines = ["".join(span_md(s) for s in l["spans"]) for l in b["lines"]]
    txt = re.sub(r"\*\*\s*\*\*", "", " ".join(lines))
    return re.sub(r"\s+", " ", txt).strip()


def block_size(b: dict) -> float:
    return max((s["size"] for l in b["lines"] for s in l["spans"]), default=0.0)


def block_bold(b: dict) -> bool:
    big = max(b["lines"], key=lambda l: sum(len(s["text"]) for s in l["spans"]))
    return any("Bold" in s["font"] for s in big["spans"])


def expected_names(slug: str) -> list[str]:
    d = MD / slug
    names = []
    if not d.exists():
        return names
    for m in sorted(d.glob("*.md")):
        if m.name in ("README.md", "00-introducao.md"):
            continue
        first = m.read_text(encoding="utf-8").splitlines()[0]
        names.append(first.lstrip("# ").strip())
    return names


def strip_paren(s: str) -> str:
    return re.sub(r"\s*\([^)]*\)\s*", " ", s).strip()


def exact_match(title: str, expected: list[str]) -> str | None:
    """Exato, tolerando parênteses editoriais no nome esperado (ex.: '(Antes …)')."""
    tn = norm(title)
    for e in expected:
        if norm(e) == tn or norm(strip_paren(e)) == tn:
            return e
    return None


def match_expected(title: str, expected: list[str]) -> str | None:
    tn = norm(title)
    if not tn:
        return None
    # 1) match exato (prioridade — evita "Tipo I" casar com "Tipo II")
    em = exact_match(title, expected)
    if em:
        return em
    # 2) o título CONTÉM o nome esperado (título estendido/quebrado). NÃO a
    #    direção inversa (título ⊂ esperado) — senão cabeçalhos curtos de grupo
    #    casam com transtornos (ex.: "Catatonia" ⊂ "Catatonia Associada a…").
    subs = []
    for e in expected:
        en = norm(e)
        if en in tn:
            subs.append((abs(len(en) - len(tn)), e))
    if subs:
        return min(subs)[1]
    # 3) sobreposição de tokens
    tset = set(tn.split())
    best, bestv = None, 0.0
    for e in expected:
        es = set(norm(e).split())
        if not es:
            continue
        j = len(tset & es) / len(tset | es)
        if j > bestv:
            best, bestv = e, j
    return best if bestv >= 0.7 else None


def fix_criteria(paras: list[str]) -> list[str]:
    text = " ".join(paras)
    parts = re.split(r"(?<![A-Za-zÀ-ÿ])([A-H])\.\s+(?=[A-ZÀ-Ý\"])", text)
    if len(parts) < 3:
        return paras
    out = []
    pre = parts[0].strip()
    if pre:
        out.append(pre)
    letters = "ABCDEFGH"
    idx, i = 0, 1
    while i + 1 < len(parts) + 1 and idx < len(letters):
        seg = parts[i + 1].strip() if i + 1 < len(parts) else ""
        if not seg:
            i += 2
            continue
        seg = re.sub(r"\s+(\d+)\.\s+", lambda m: "\n" + m.group(1) + ". ", seg)
        out.append(f"{letters[idx]}. {seg}")
        idx += 1
        i += 2
    return out


def stream_blocks(doc, p0, p1):
    """Lista (size, bold, plain, rich) já filtrada de ruído, por página em ordem."""
    out = []
    for pno in range(p0, p1 + 1):
        blocks = [b for b in doc[pno].get_text("dict")["blocks"] if b.get("type") == 0]
        blocks.sort(key=lambda b: (round(b["bbox"][1]), round(b["bbox"][0])))
        for b in blocks:
            plain = block_plain(b)
            if len(plain) < 2 or NUM_ONLY_RE.match(plain):
                continue
            out.append((block_size(b), block_bold(b), plain, block_rich(b)))
    return out


def body_size(blocks) -> float:
    weight = {}
    for size, _b, plain, _r in blocks:
        weight[round(size, 1)] = weight.get(round(size, 1), 0) + len(plain)
    return max(weight, key=weight.get) if weight else 9.0


def classify(blocks, body):
    """Marca cada bloco: 'title' (>= body*1.4) / 'sub' (bold, médio, curto) / 'body'."""
    tmin = body * 1.4
    items = []
    for size, bold, plain, rich in blocks:
        if size >= tmin:
            items.append(["title", round(size, 1), plain, None])
        elif bold and size >= body * 0.97 and len(plain) <= 80:
            code = None
            m = CODE_RE.search(plain)
            if m:
                code, plain = m.group(1), plain[: m.start()].strip()
            items.append(["sub", round(size, 1), plain, code])
        elif size >= body - 0.6:
            items.append(["body", round(size, 1), rich, None])
    # junta títulos consecutivos de MESMO tamanho (linhas quebradas)
    merged = []
    for it in items:
        if it[0] == "title" and merged and merged[-1][0] == "title" and merged[-1][1] == it[1]:
            merged[-1][2] += " " + it[2]
        else:
            merged.append(it)
    return merged


def build(slug, p0, p1, doc):
    expected = expected_names(slug)
    blocks = stream_blocks(doc, p0, p1)
    items = classify(blocks, body_size(blocks))
    chap_norm = norm(" ".join(slug.split("-")[1:]))
    disorders, cur, matched = [], None, set()
    for kind, _size, text, code in items:
        if kind == "title":
            if norm(text) == chap_norm and _size >= 17:
                cur = None  # cabeçalho do capítulo (18pt) — divisor
                continue
            e = match_expected(text, expected)
            if e is None:
                cur = None  # cabeçalho de grupo/capítulo — divisor
                continue
            if cur and cur["match"] == e:
                continue  # grupo + título duplicado do mesmo transtorno
            cur = {"name": text, "match": e, "subs": [], "code": None}
            disorders.append(cur)
            matched.add(e)
            continue
        if kind == "sub":
            # promove subtítulo (bold, tamanho de corpo) a transtorno quando o
            # nome bate EXATAMENTE com um esperado (ex.: tiques, "Outros
            # Induzidos por…", que a TR diagrama como subtítulos)
            em = exact_match(text, expected)
            if em and not (cur and cur["match"] == em):
                cur = {"name": text, "match": em, "subs": [], "code": code}
                disorders.append(cur)
                matched.add(em)
                continue
        if cur is None:
            continue
        if kind == "sub":
            if code and not cur["code"]:
                cur["code"] = code
            cur["subs"].append({"title": text, "body": []})
        else:
            if not cur["subs"]:
                cur["subs"].append({"title": None, "body": []})
            cur["subs"][-1]["body"].append(text)
    disorders = [d for d in disorders if any(s["body"] for s in d["subs"])]
    return disorders, expected, matched


def emit(d, chapter_title) -> str:
    out = [f"# {d['name']}", "", f"*Categoria: {chapter_title}*", "", "---", ""]
    for s in d["subs"]:
        body = s["body"]
        if s["title"] and s["title"].lower().startswith("crit"):
            body = fix_criteria(body)
        if s["title"]:
            out.append(f"### {s['title']}")
            if s["title"].lower().startswith("crit") and d["code"]:
                out.append(f"### {d['code']}")
        out.extend(body)
    return "\n".join(out).strip() + "\n"


def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    doc = fitz.open(PDF)
    print(f"{'CATEGORIA':52} {'esper.':>6} {'achou':>6} {'faltam'}")
    for slug, p0, p1 in CHAPTERS:
        if only and not slug.startswith(only):
            continue
        disorders, expected, matched = build(slug, p0, p1, doc)
        chapter_title = " ".join(w.capitalize() if w not in ("e", "a", "de", "do", "da", "dos", "das", "com", "os") else w
                                 for w in slug.split("-")[1:])
        outdir = OUTROOT / slug
        outdir.mkdir(parents=True, exist_ok=True)
        for d in disorders:
            (outdir / f"{slugify(d['name'])}.md").write_text(emit(d, chapter_title), encoding="utf-8")
        missing = [e for e in expected if e not in matched]
        miss_str = "" if not missing else " · ".join(missing[:4]) + (" …" if len(missing) > 4 else "")
        print(f"{slug:52} {len(expected):>6} {len(disorders):>6}  {miss_str}")
    doc.close()


if __name__ == "__main__":
    main()
