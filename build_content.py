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

# Tabelas do DSM que foram achatadas na extração e que substituímos por
# imagem recortada do PDF. Chave: nome do transtorno -> título da seção.
#   keep_first: nº de parágrafos iniciais a manter (ex.: a frase introdutória)
#   images: lista de caminhos; caption: legenda/fonte.
#   keep_first: mantém N parágrafos iniciais e anexa a imagem ao fim
#   drop: lista de intervalos [ini, fim) de parágrafos a remover (tabela
#         achatada no meio da seção); o restante é mantido + imagem ao fim
SECTION_ASSETS = {
    "Deficiência Intelectual (Transtorno do Desenvolvimento Intelectual)": {
        "Especificadores": {
            "keep_first": 1,
            "images": [
                "assets/tabelas/deficiencia-intelectual/gravidade-1.png",
                "assets/tabelas/deficiencia-intelectual/gravidade-2.png",
                "assets/tabelas/deficiencia-intelectual/gravidade-3.png",
            ],
            "caption": "DSM-5-TR — Tabela 1: Níveis de gravidade da deficiência intelectual (domínios conceitual, social e prático).",
        }
    },
    "Transtorno do Espectro Autista": {
        "Especificadores": {
            "drop": [[3, 10]],
            "images": ["assets/tabelas/espectro-autista/gravidade.png"],
            "caption": "DSM-5-TR — Tabela 2: Níveis de gravidade do transtorno do espectro autista (comunicação social; comportamentos restritos e repetitivos).",
        }
    },
    "Leve Devido a Lesão Cerebral Traumática": {
        "Desenvolvimento e curso": {
            "drop": [[2, 7]],
            "images": ["assets/tabelas/lesao-cerebral-traumatica/gravidade.png"],
            "caption": "DSM-5-TR — Tabela 2: Classificações da gravidade de lesão cerebral traumática (LCT).",
        }
    },
}

# Tabelas de "nível-capítulo" (não pertencem a um transtorno só): adicionadas
# como uma seção nova (só imagem) a um transtorno representativo.
ADD_SECTIONS = {
    "Transtorno Neurocognitivo Maior": [
        {
            "title": "Domínios neurocognitivos",
            "images": [
                "assets/tabelas/neurocognitivo/dominios-1.png",
                "assets/tabelas/neurocognitivo/dominios-2.png",
                "assets/tabelas/neurocognitivo/dominios-3.png",
            ],
            "caption": "DSM-5-TR — Tabela 1: Domínios neurocognitivos (sintomas/observações e exemplos de avaliação). Referência do capítulo.",
        }
    ],
    "Transtorno por Uso de Álcool": [
        {
            "title": "Diagnósticos por classe de substância",
            "images": ["assets/tabelas/substancias/diagnosticos-por-classe.png"],
            "caption": "DSM-5-TR — Tabela 1: Diagnósticos associados a classes de substâncias (referência do capítulo de substâncias).",
        }
    ],
}

# Subgrupos da "Classificação do DSM-5" dentro de cada categoria.
# índice da categoria -> lista ordenada de (nome do subgrupo, nível, nome do
# 1º transtorno que inicia o subgrupo). nível 2 = aninhado no subgrupo anterior.
SUBGROUPS = {
    0: [  # Transtornos do Neurodesenvolvimento
        ("Deficiências Intelectuais", 1, "Deficiência Intelectual (Transtorno do Desenvolvimento Intelectual)"),
        ("Transtornos da Comunicação", 1, "Transtorno da Linguagem"),
        ("Transtorno do Espectro Autista", 1, "Transtorno do Espectro Autista"),
        ("Transtorno de Déficit de Atenção/Hiperatividade", 1, "Transtorno de Déficit de Atenção/Hiperatividade"),
        ("Transtorno Específico da Aprendizagem", 1, "Transtorno Específico da Aprendizagem"),
        ("Transtornos Motores", 1, "Transtorno do Desenvolvimento da Coordenação"),
        ("Transtornos de Tique", 2, "Transtorno de Tourette"),
        ("Outros Transtornos do Neurodesenvolvimento", 1, "Outro Transtorno do Neurodesenvolvimento Especificado"),
    ],
    11: [  # Transtornos do Sono-Vigília  (nome "" = volta ao nível superior)
        ("Transtornos do Sono Relacionados à Respiração", 1, "Apneia e Hipopneia Obstrutivas do Sono"),
        ("", 0, "Transtorno do Sono-Vigília do Ritmo Circadiano"),
        ("Parassonias", 1, "Transtornos de Despertar do Sono Não REM"),
        ("", 0, "Síndrome das Pernas Inquietas"),
    ],
    15: [  # Substâncias e transtornos aditivos (por classe de substância)
        ("Transtornos Relacionados ao Álcool", 1, "Transtorno por Uso de Álcool"),
        ("Transtornos Relacionados à Cafeína", 1, "Intoxicação por Cafeína"),
        ("Transtornos Relacionados à Cannabis", 1, "Transtorno por Uso de Cannabis"),
        ("Transtornos Relacionados aos Alucinógenos", 1, "Transtorno por Uso de Fenciclidina"),
        ("Transtornos Relacionados aos Inalantes", 1, "Transtorno por Uso de Inalantes"),
        ("Transtornos Relacionados aos Opioides", 1, "Transtorno por Uso de Opioides"),
        ("Transtornos Relacionados aos Sedativos, Hipnóticos ou Ansiolíticos", 1, "Transtorno por Uso de Sedativos, Hipnóticos ou Ansiolíticos"),
        ("Transtornos Relacionados aos Estimulantes", 1, "Transtorno por Uso de Estimulantes"),
        ("Transtornos Relacionados ao Tabaco", 1, "Transtorno por Uso de Tabaco"),
        ("Transtornos Relacionados a Outras Substâncias (ou Desconhecidas)", 1, "(ou Substância Desconhecida)"),
        ("Transtornos Não Relacionados a Substâncias", 1, "Transtorno do Jogo"),
    ],
    16: [  # Transtornos neurocognitivos
        ("Delirium", 1, "Outro Delirium Especificado"),
        ("Transtornos Neurocognitivos Maiores e Leves", 1, "Transtorno Neurocognitivo Maior"),
    ],
    17: [  # Transtornos da personalidade (grupos A/B/C + outros)
        ("Transtornos da Personalidade do Grupo A", 1, "Transtorno da Personalidade Paranoide"),
        ("Transtornos da Personalidade do Grupo B", 1, "Transtorno da Personalidade Antissocial"),
        ("Transtornos da Personalidade do Grupo C", 1, "Transtorno da Personalidade Evitativa"),
        ("Outros Transtornos da Personalidade", 1, "Mudança de Personalidade Devido a Outra Condição Médica"),
    ],
}

# itens que vazaram como "transtorno" mas são apenas cabeçalhos de subgrupo
# (sem critérios/seções próprios) — removidos da lista de transtornos.
DROP_ITEMS = {
    11: ["Transtornos do Sono Relacionados à Respiração"],
    15: ["Transtornos por Uso de Substâncias"],
}


def drop_fake_items(cat_index, items):
    names = set(DROP_ITEMS.get(cat_index, []))
    return [it for it in items if it["n"] not in names] if names else items


def apply_subgroups(cat_index, items):
    """Atribui item['sg'] (nome do subgrupo) e item['sgl'] (nível) conforme o
    manifesto, percorrendo os transtornos na ordem do documento."""
    spec = SUBGROUPS.get(cat_index)
    if not spec:
        return
    starts = {s[2]: (s[0], s[1]) for s in spec}
    found = set()
    cur_name, cur_level = "", 0
    for it in items:
        if it["n"] in starts:
            cur_name, cur_level = starts[it["n"]]
            found.add(it["n"])
        if cur_name:
            it["sg"] = cur_name
            it["sgl"] = cur_level
    missing = set(starts) - found
    if missing:
        print(f"  [subgrupos] cat {cat_index}: inicios nao encontrados: {sorted(missing)}")


CODE_HEADING = re.compile(r"^#{3,4}\s+[\d(]")              # "### 300.02 (F41.1)" ou "#### ..."
CODE_PAIR = re.compile(r"(\d{3}(?:\.\d+)?)\s*\(([A-Z]\d{2}(?:\.\d+)?)\)[ \t]*([^\n*(:]{0,48})")
LETTER_RE = re.compile(r"^([A-H])\.(?=\s|[A-ZÀ-Ú])\s*(.*)$")  # tolera "C.A duração" (sem espaço)
SUBITEM_RE = re.compile(r"^\s*(?:[a-z]|\d{1,2})[.)]\s")   # "a. ", "1. ", "2) " ...
# cabeçalho de bloco de especificador: "Especificar se:", "Determinar o subtipo:" ...
SPEC_HEAD_RE = re.compile(r"^\*?\s*(?:Especificar|Determinar)\b[^:]*:", re.IGNORECASE)
# linha de opção: "**Rótulo:** descrição" (rótulo pode ter código/prefixo)
SPEC_ITEM_RE = re.compile(r"^\*\*\s*(.+?)\s*\*\*\s*:?\s*(.*)$")
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
    # remove referências dangling a tabelas/figuras/quadros que não levam a nada
    text = re.sub(r"\s*\(ver (?:a |as |o |os )?(?:Tabela|Figura|Quadro)[^)]*\)", "", text)
    return re.sub(r"[ \t]+", " ", text).strip()


# Run-in heading do DSM: "**Rótulo. **texto..." (sub-rótulo em negrito no
# início do parágrafo). Preservar como hierarquia em vez de achatar.
RUNIN_RE = re.compile(r"^\*\*\s*([A-ZÀ-Ú][^*]{2,70}?[.:])\s*\*\*\s*(.*)$")


def make_body_entry(t):
    """Devolve {'lead','text'} se a linha for um run-in heading; senão string."""
    m = RUNIN_RE.match(t)
    if m:
        return {"lead": clean(m.group(1)), "text": clean(m.group(2))}
    return clean(t)


def body_text(entry):
    """Texto plano de uma entrada de corpo (string ou {'lead','text'})."""
    if isinstance(entry, dict):
        return (entry.get("lead", "") + " " + entry.get("text", "")).strip()
    return entry


def spec_add(block, raw):
    """Adiciona uma linha-opção a um bloco de especificador: {label, desc}.
    Linha sem rótulo (continuação) é anexada à descrição da opção anterior."""
    raw = re.sub(r"^\*\s+", "", raw.strip())   # remove "* " de fechamento de itálico
    m = SPEC_ITEM_RE.match(raw)
    if m:
        label = clean(m.group(1)).rstrip(": ")
        desc = clean(m.group(2))
        block["items"].append({"label": label, "desc": desc})
        return
    txt = clean(raw)
    if not txt:
        return
    if block["items"]:                          # continuação -> última opção
        prev = block["items"][-1]
        prev["desc"] = (prev["desc"] + " " + txt).strip()
    else:
        block["items"].append({"label": "", "desc": txt})


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
    # cabeçalho de página colado ANTES de uma letra de critério ou de um
    # "Especificar/Determinar": "**172** Transtornos Depressivos B. Um..." ->
    # "B. Um..."; "**430** Disfunções Sexuais *Determinar*..." -> "*Determinar*..."
    line = re.sub(
        r"^\*\*\d+\*\*\s+[A-ZÀ-Ú][^.]*?\s+(?=(?:[A-H]\.\s|\*{0,2}(?:Especificar|Determinar)\b))",
        "", line)
    line = re.sub(r"\*\*\d+\*\*\s+[A-ZÀ-Ú][^.]*?(?=[A-ZÀ-Ú][a-z])", "", line)
    return line.strip()


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
    """Extrai (criteriaIntro, criteria[], specifier, note) da região de
    critérios. 'Nota:' e 'Especificar' NÃO entram no texto do critério:
    a nota vira um bloco à parte e o especificar vai para o specifier."""
    intro, criteria, spec_blocks, notes = [], [], [], []
    mode = "intro"           # intro -> crit -> note -> spec
    cur = None
    cur_group = None         # grupo ativo (ex.: "Episódio Maníaco")
    pending_group = None     # H4 visto, só vira grupo se um critério "A" seguir
    for raw in head_lines:
        s = raw.strip()
        if not s:
            continue
        if s.startswith("#"):
            # H4 com texto (não código) = possível grupo de critérios (bipolar)
            if s.startswith("####"):
                htext = s[4:].strip()
                if htext and re.match(r"[A-Za-zÀ-ÿ]", htext) and not CODE_HEADING.match(s):
                    pending_group = clean(htext)
            continue                      # títulos/cabeçalhos/códigos
        if s in ("---",) or s.startswith("*Categoria:"):
            continue
        if PAGE_FOOTER.match(s):
            s = strip_footer(s)
            if not s:
                continue

        # detecção sobre o texto JÁ limpo (sem ** / * do markdown)
        low = normalize(clean(s))

        # uma letra de critério (A., B., ...) SEMPRE reabre o modo critério —
        # mesmo após um "Especificar"/"Nota" inline (ex.: gravidade entre A e B)
        m = LETTER_RE.match(s)
        if m:
            mode = "crit"
            letter = m.group(1)
            if letter == "A" and pending_group:   # novo conjunto de critérios
                cur_group = pending_group
            pending_group = None                  # H4 não seguido de "A" é descartado
            cur = {"letter": letter, "text": clean(m.group(2))}
            if cur_group:
                cur["group"] = cur_group
            criteria.append(cur)
            continue
        if low.startswith("especificar") or low.startswith("determinar"):
            mode = "spec"          # novo bloco de especificador
            hm = SPEC_HEAD_RE.match(s)
            head = clean(hm.group(0) if hm else s).rstrip(": ")
            blk = {"head": head, "items": []}
            spec_blocks.append(blk)
            rest = s[hm.end():] if hm else ""   # 1ª opção inline (ex.: Bipolar)
            if rest.strip().strip("*").strip():
                spec_add(blk, rest)
            continue
        if re.match(r"nota\b", low):        # "Nota:" sai do critério -> bloco à parte
            mode = "note"
            c = clean(s)
            if c not in notes:              # evita notas duplicadas
                notes.append(c)
            continue

        # um sub-item (a., b., 1., 2.) encerra uma nota inline e RETOMA o
        # critério atual — senão a lista de sintomas iria toda para a nota
        if mode == "note" and cur is not None and SUBITEM_RE.match(s):
            mode = "crit"

        if mode == "spec":
            if not spec_blocks:
                spec_blocks.append({"head": "", "items": []})
            spec_add(spec_blocks[-1], s)
        elif mode == "note":
            c = clean(s)
            if c not in notes:
                notes.append(c)
        elif mode == "crit" and cur is not None:
            extra = clean(s)
            if extra:
                cur["text"] += "\n" + extra
        elif mode == "intro":
            intro.append(clean(s))

    note = " ".join(notes).strip()
    note = re.sub(r"^Nota[:.]?\s*", "", note, flags=re.IGNORECASE)
    # remove blocos de especificador vazios
    spec_blocks = [b for b in spec_blocks if b["items"]]
    return " ".join(intro).strip(), criteria, spec_blocks, note


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
        cur["body"].append(make_body_entry(t))
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

    # título (remove marcadores de itálico * que vazaram do markdown)
    title = display_name.replace("*", "")
    for ln in lines:
        if ln.startswith("# "):
            title = ln[2:].strip().replace("*", "")
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
    criteria_intro, criteria, specifier, criteria_note = parse_criteria(head_lines)
    sections = parse_sections(lines)

    # substitui/anexa tabelas (imagem recortada do PDF) em seções existentes
    assets = SECTION_ASSETS.get(title)
    if assets:
        for sec in sections:
            a = assets.get(sec["title"])
            if not a:
                continue
            body = sec["body"]
            if "drop" in a:
                for s, e in sorted(a["drop"], reverse=True):
                    body = body[:s] + body[e:]
                sec["body"] = body
            else:
                sec["body"] = body[: a.get("keep_first", 0)]
            sec["images"] = a["images"]
            if a.get("caption"):
                sec["caption"] = a["caption"]

    # adiciona seções novas só com imagem (tabelas de nível-capítulo)
    for e in ADD_SECTIONS.get(title, []):
        sec = {"title": e["title"], "body": [], "images": e["images"]}
        if e.get("caption"):
            sec["caption"] = e["caption"]
        sections.append(sec)

    # resumo: 1ª seção "Características diagnósticas" -> senão intro -> senão 1º critério
    summary = ""
    for sec in sections:
        if sec["title"] == "Características diagnósticas":
            summary = body_text(sec["body"][0])
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
        "criteriaNote": criteria_note,
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

        items = drop_fake_items(idx, items)
        apply_subgroups(idx, items)
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
