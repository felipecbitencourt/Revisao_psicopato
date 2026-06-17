#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_content.py  (modelo v2)
=============================
Lê os markdowns em md/categorias/ e gera content.js — um único arquivo
JS que expõe `window.DSM_CONTENT` para a Plataforma DSM (index.html).

Usa .js (e não .json) porque o app roda como site estático aberto via
file://, onde fetch() de arquivos locais é bloqueado por CORS.

Estrutura gerada por transtorno:
  {
    n,                       # nome
    codes: [{dsm, cid, label}],   # 1+ variantes (severidade/subtipo)
    cid, dsm, code,          # primário (codes[0]) p/ chip da lista
    criteriaIntro,           # prosa antes do critério "A." (se houver)
    criteria: [{letter, text}],
    specifier,               # bloco "Especificar se / a gravidade"
    sections: [{title, body:[paragrafos]}],   # seções narrativas do DSM
    summary,                 # 1º parágrafo (p/ cards e flashcards)
  }

Uso:  python build_content.py
"""

import json
import os
import re
import unicodedata

ROOT = os.path.dirname(os.path.abspath(__file__))
CAT_DIR = os.path.join(ROOT, "md", "categorias")
OUT = os.path.join(ROOT, "content.js")

# (cor, nome curto exibido na grade, progresso ilustrativo) — 20 categorias.
CAT_META = [
    ("#6C5CE7", "Transtornos do neurodesenvolvimento", 0.70),
    ("#00A6C7", "Espectro da esquizofrenia e psicóticos", 0.40),
    ("#F4A261", "Transtorno bipolar e relacionados", 0.55),
    ("#4361EE", "Transtornos depressivos", 0.60),
    ("#2A9D8F", "Transtornos de ansiedade", 0.85),
    ("#E76F51", "TOC e transtornos relacionados", 0.30),
    ("#9B5DE5", "Trauma e estressores", 0.50),
    ("#00BBF9", "Transtornos dissociativos", 0.20),
    ("#F15BB5", "Sintomas somáticos e relacionados", 0.35),
    ("#06D6A0", "Transtornos alimentares", 0.65),
    ("#118AB2", "Transtornos da eliminação", 0.10),
    ("#3A86FF", "Transtornos do sono-vigília", 0.25),
    ("#EF476F", "Disfunções sexuais", 0.15),
    ("#8338EC", "Disforia de gênero", 0.40),
    ("#FB5607", "Disruptivos, controle de impulsos e conduta", 0.45),
    ("#D6336C", "Substâncias e transtornos aditivos", 0.50),
    ("#588157", "Transtornos neurocognitivos", 0.30),
    ("#BC6C25", "Transtornos da personalidade", 0.60),
    ("#7209B7", "Transtornos parafílicos", 0.05),
    ("#5C6B73", "Outros transtornos mentais", 0.00),
]

# Seções narrativas reconhecidas (chave normalizada -> título de exibição).
# A ordem aqui não importa; o documento define a ordem final.
SECTION_MAP = [
    ("criterios diagnosticos", None),  # tratada à parte
    ("subtipos", "Subtipos"),
    ("especificadores", "Especificadores"),
    ("caracteristicas diagnosticas", "Características diagnósticas"),
    ("caracteristicas associadas", "Características associadas"),
    ("procedimentos para registro", "Procedimentos para registro"),
    ("marcadores diagnosticos", "Marcadores diagnósticos"),
    ("prevalencia", "Prevalência"),
    ("desenvolvimento e curso", "Desenvolvimento e curso"),
    ("fatores de risco e prognostico", "Fatores de risco e prognóstico"),
    ("questoes diagnosticas relativas a cultura", "Questões diagnósticas relativas à cultura"),
    ("questoes diagnosticas relativas ao genero", "Questões diagnósticas relativas ao gênero"),
    ("risco de suicidio", "Risco de suicídio"),
    ("consequencias funcionais", "Consequências funcionais"),
    ("diagnostico diferencial", "Diagnóstico diferencial"),
    ("comorbidade", "Comorbidade"),
    ("relacao com outras classificacoes", "Relação com outras classificações"),
]

CODE_HEADING = re.compile(r"^#{3,4}\s+[\d(]")              # "### 300.02 (F41.1)" ou "#### ..."
CODE_PAIR = re.compile(r"(\d{3}(?:\.\d+)?)\s*\(([A-Z]\d{2}(?:\.\d+)?)\)[ \t]*([^\n*(:]{0,48})")
LETTER_RE = re.compile(r"^([A-H])\.\s+(.*)$")
PAGE_FOOTER = re.compile(r"^\*\*\d+\*\*")
HEADING_ANY = re.compile(r"^#{1,6}\s+(.*)$")


def normalize(s):
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = s.lower().strip().rstrip(":").strip()
    return re.sub(r"\s+", " ", s)


def clean(text):
    text = text.replace("**", "").replace("*", "")
    text = text.replace("“", '"').replace("”", '"').replace("’", "'")
    return re.sub(r"[ \t]+", " ", text).strip()


def is_section_heading(line):
    """Se a linha é um cabeçalho de seção narrativa reconhecido, devolve o
    título de exibição (ou '' se for 'Critérios Diagnósticos'); senão None."""
    m = HEADING_ANY.match(line)
    if not m:
        return None
    if CODE_HEADING.match(line):
        return None
    norm = normalize(m.group(1))
    for key, disp in SECTION_MAP:
        if norm.startswith(key):
            return disp if disp else ""
    return None


def strip_footer(line):
    return re.sub(r"\*\*\d+\*\*\s+[A-ZÀ-Ú][^.]*?(?=[A-ZÀ-Ú][a-z])", "", line).strip()


def extract_codes(head_text):
    """Extrai códigos (DSM, CID, rótulo) da região de cabeçalho/critérios."""
    codes = []
    seen = set()
    for m in CODE_PAIR.finditer(head_text):
        dsm, cid, label = m.group(1), m.group(2), clean(m.group(3))
        label = label.strip(" .:-")
        if len(label) < 2:
            label = ""
        key = (dsm, cid)
        if key in seen:
            continue
        seen.add(key)
        codes.append({"dsm": dsm, "cid": cid, "label": label})
    return codes


def parse_criteria(head_lines):
    """Extrai (criteriaIntro, criteria[], specifier) da região de critérios,
    de forma independente de existir o cabeçalho 'Critérios Diagnósticos'."""
    intro, criteria, spec = [], [], []
    mode = "intro"           # intro -> crit -> spec
    cur = None
    for raw in head_lines:
        s = raw.strip()
        if not s:
            continue
        if s.startswith("#"):
            continue                      # títulos/cabeçalhos/códigos
        if s in ("---",) or s.startswith("*Categoria:"):
            continue
        if PAGE_FOOTER.match(s):
            s = strip_footer(s)
            if not s:
                continue

        low = normalize(s)
        if low.startswith("especificar"):
            mode = "spec"
            spec.append(clean(s))
            continue
        if mode == "spec":
            spec.append(clean(s))
            continue

        m = LETTER_RE.match(s)
        if m:
            mode = "crit"
            cur = {"letter": m.group(1), "text": clean(m.group(2))}
            criteria.append(cur)
        elif mode == "crit" and cur is not None:
            extra = clean(s)
            if extra:
                cur["text"] += "\n" + extra
        elif mode == "intro":
            intro.append(clean(s))

    return " ".join(intro).strip(), criteria, " ".join(spec).strip()


def parse_sections(lines):
    """Percorre o doc e coleta as seções narrativas reconhecidas, em ordem.
    Cabeçalhos não reconhecidos (fragmentos de título quebrados pelo PDF) são
    absorvidos como texto da seção corrente."""
    sections = []
    cur = None
    for raw in lines:
        s = raw.rstrip()
        disp = is_section_heading(raw)
        if disp is not None:
            if disp == "":          # "Critérios Diagnósticos" -> ignora aqui
                cur = None
                continue
            cur = {"title": disp, "body": []}
            sections.append(cur)
            continue
        if cur is None:
            continue
        t = s.strip()
        if not t:
            continue
        if CODE_HEADING.match(raw):
            continue
        if t.startswith("#"):
            t = HEADING_ANY.match(raw).group(1)   # absorve fragmento de título
        if PAGE_FOOTER.match(t):
            t = strip_footer(t)
            if not t:
                continue
        cur["body"].append(clean(t))
    # remove seções vazias
    return [sec for sec in sections if sec["body"]]


def first_paragraph(text):
    return text.split("\n")[0] if text else ""


def shorten(summary, limit=300):
    if len(summary) <= limit:
        return summary
    cut = summary[:limit]
    dot = cut.rfind(". ")
    return cut[: dot + 1] if dot > 120 else cut.rstrip() + "…"


def parse_transtorno(path, display_name):
    with open(path, encoding="utf-8") as f:
        raw = f.read()
    lines = raw.split("\n")

    # título
    title = display_name
    for ln in lines:
        if ln.startswith("# "):
            title = ln[2:].strip()
            break

    # região de cabeçalho = do início até a 1ª seção narrativa reconhecida
    sec_start = len(lines)
    for i, ln in enumerate(lines):
        if is_section_heading(ln):
            sec_start = i
            break
    head_lines = lines[:sec_start]
    head_text = "\n".join(head_lines)

    codes = extract_codes(head_text)
    criteria_intro, criteria, specifier = parse_criteria(head_lines)
    sections = parse_sections(lines)

    # resumo: 1ª seção "Características diagnósticas" -> senão intro -> senão 1º critério
    summary = ""
    for sec in sections:
        if sec["title"] == "Características diagnósticas":
            summary = sec["body"][0]
            break
    if not summary:
        summary = first_paragraph(criteria_intro)
    if not summary and criteria:
        summary = first_paragraph(criteria[0]["text"])
    summary = shorten(summary)

    primary = codes[0] if codes else {"dsm": "", "cid": "", "label": ""}
    return {
        "n": title,
        "codes": codes,
        "cid": primary["cid"],
        "dsm": primary["dsm"],
        "code": primary["cid"] or primary["dsm"],
        "criteriaIntro": criteria_intro,
        "criteria": criteria,
        "specifier": specifier,
        "sections": sections,
        "summary": summary,
    }


def parse_category_readme(folder):
    readme = os.path.join(folder, "README.md")
    items = []
    if not os.path.exists(readme):
        return items
    with open(readme, encoding="utf-8") as f:
        for ln in f:
            m = re.match(r"^\|\s*(.+?)\s*\|\s*\[([^\]]+)\]\([^)]+\)\s*\|", ln)
            if not m:
                continue
            name, fname = m.group(1).strip(), m.group(2).strip()
            if name.startswith("*") or name.lower() == "transtorno":
                continue
            if not fname.endswith(".md") or fname == "README.md":
                continue
            items.append((name, fname))
    return items


def main():
    folders = sorted(
        d for d in os.listdir(CAT_DIR)
        if os.path.isdir(os.path.join(CAT_DIR, d)) and re.match(r"^\d{2}-", d)
    )
    assert len(folders) == 20, f"esperava 20 categorias, achei {len(folders)}"

    categories, flashcards = [], []
    for idx, folder in enumerate(folders):
        color, name, prog = CAT_META[idx]
        fpath = os.path.join(CAT_DIR, folder)
        items = []
        for disp_name, fname in parse_category_readme(fpath):
            full = os.path.join(fpath, fname)
            if os.path.exists(full):
                items.append(parse_transtorno(full, disp_name))

        categories.append({"name": name, "color": color, "prog": prog, "items": items})

        picked = 0
        for it in items:
            if picked >= 2:
                break
            if it["summary"] and it["criteria"]:
                flashcards.append({"front": it["n"], "back": it["summary"]})
                picked += 1

    data = {"categories": categories, "flashcards": flashcards}
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    header = (
        "/* GERADO por build_content.py — não edite à mão.\n"
        "   Reconstrua com: python build_content.py */\n"
        "window.DSM_CONTENT = "
    )
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(header + payload + ";\n")

    total = sum(len(c["items"]) for c in categories)
    with_crit = sum(1 for c in categories for it in c["items"] if it["criteria"])
    with_sec = sum(1 for c in categories for it in c["items"] if it["sections"])
    print(f"Categorias: {len(categories)}")
    print(f"Transtornos: {total}  (com critérios: {with_crit} · com seções: {with_sec})")
    print(f"Flashcards: {len(flashcards)}")
    print(f"Gerado: {OUT}  ({os.path.getsize(OUT)//1024} KB)")


if __name__ == "__main__":
    main()
