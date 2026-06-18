#!/usr/bin/env python3
"""Divide cada categoria do DSM-5 em arquivos Markdown por transtorno."""

from __future__ import annotations

import re
import sys
import unicodedata
from pathlib import Path

CATEGORIAS_DIR = Path(__file__).resolve().parent.parent / "md" / "categorias"  # build/ -> raiz

ICD_LINE = re.compile(
    r"^#{3,4}\s+(?:\*\*)?(?:\d{3}(?:\.\d+)?|___.__)\s*\([A-Z]\d",
    re.IGNORECASE,
)
MERGE_ENDINGS = (
    " e",
    " a",
    " de",
    " do",
    " da",
    " dos",
    " das",
    " com",
    " por",
    " ao",
    " à",
    " os",
    " as",
    " no",
    " na",
    " induzido",
    " induzida",
)

SKIP_TITLE_PATTERNS = (
    r"caracter[ií]sticas essenciais",
    r"definem os transtornos",
    r"transtornos neste cap[ií]tulo",
    r"avalia[cç][aã]o de sintomas",
    r"fen[oô]menos cl[ií]nicos",
    r"especificadores para",
    r"dom[ií]nios neurocognitivos",
    r"modelos dimensionais",
    r"transtornos da personalidade do grupo [abc]$",
    r"gravidade e especificadores",
    r"procedimentos para registro",
    r"^caracter[ií]sticas$",
    r"^desenvolvimento e curso$",
    r"transtornos por uso de subst[aâ]ncias caracter[ií]sticas",
    r"^transtornos induzidos por subst[aâ]ncias$",
    r"^intoxica[cç][aã]o e abstin[eê]ncia de subst[aâ]ncia$",
    r"transtornos mentais induzidos por subst[aâ]ncia/medicamento$",
    r"^transtornos neurocognitivos maiores e leves$",
    r"^transtorno da personalidade$",
)

DISORDER_TITLE_PATTERNS = (
    r"transtorno",
    r"defici[eê]ncia",
    r"atraso global",
    r"esquizofrenia",
    r"catatonia",
    r"del[ií]rium",
    r"disforia",
    r"disfun",
    r"enurese",
    r"encoprese",
    r"pica",
    r"anorexia",
    r"bulimia",
    r"narcolepsia",
    r"ins[oô]nia",
    r"hipersonol",
    r"intoxica",
    r"abstin",
    r"piromania",
    r"cleptomania",
    r"mutismo",
    r"fobia",
    r"simula",
    r"dem[eê]ncia",
    r"neurocognitivo",
    r"especificado",
    r"n[aã]o especificado",
    r"pedof",
    r"voyeur",
    r"exibicion",
    r"frotteur",
    r"masoqu",
    r"sadismo",
    r"fetich",
    r"transvest",
)

EPISODE_H4 = re.compile(
    r"^epis[oó]dio ",
    re.IGNORECASE,
)


def normalize(text: str) -> str:
    text = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in text if not unicodedata.combining(c))
    return re.sub(r"\s+", " ", text).strip().lower()


def slugify(title: str) -> str:
    text = normalize(title)
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")[:90]


CONTINUATION_STARTS = (
    "mental",
    "relacionado",
    "relacionados",
    "relacionada",
    "relacionadas",
    "especificado",
    "especificada",
    "nao",
    "induzido",
    "induzida",
    "devido",
    "pragmatica",
    "gagueira",
    "neurodesenvolvimento",
    "aditivos",
    "medicamento",
    "substancia",
    "condicao",
    "psicotico",
    "psicoticos",
)


def should_merge_heading(current: str, nxt: str | None = None) -> bool:
    if nxt:
        # heading-continuação entre parênteses: "Título" seguido de
        # "(nome alternativo)" ou "(ou Substância Desconhecida)" — o PDF quebrou
        # o título em duas linhas; nunca é um transtorno próprio.
        if nxt.strip().startswith("("):
            return True
        first = normalize(nxt).split()[0] if nxt.split() else ""
        if nxt[0].islower() or first in CONTINUATION_STARTS:
            return True
    if current.endswith(MERGE_ENDINGS):
        return True
    if "(" in current and ")" not in current:
        return True
    if current.endswith(","):
        return True
    if re.search(r"\btranstornos?$", normalize(current)) and nxt:
        return True
    return False


def is_meta_title(title: str) -> bool:
    norm = normalize(title)
    for pattern in SKIP_TITLE_PATTERNS:
        if re.search(pattern, norm):
            return True
    return False


def looks_like_disorder_title(title: str) -> bool:
    norm = normalize(title)
    return any(re.search(p, norm) for p in DISORDER_TITLE_PATTERNS)


def section_has_diagnostic_content(body: str) -> bool:
    if "### Critérios Diagnósticos" in body or "### Critérios diagnósticos" in body:
        return True
    return bool(ICD_LINE.search(body))


def is_disorder_section(title: str, body: str) -> bool:
    if is_meta_title(title):
        return False
    if section_has_diagnostic_content(body):
        return True
    if looks_like_disorder_title(title):
        return True
    return False


def parse_h2_sections(lines: list[str]) -> tuple[list[str], list[tuple[str, list[str]]]]:
    intro: list[str] = []
    sections: list[tuple[str, list[str]]] = []
    current_title_parts: list[str] = []
    current_body: list[str] = []
    in_section = False

    def flush_section():
        nonlocal current_title_parts, current_body, in_section
        if not current_title_parts:
            return
        title = " ".join(current_title_parts)
        sections.append((title, current_body))
        current_title_parts = []
        current_body = []
        in_section = False

    for line in lines:
        if line.startswith("## "):
            text = line[3:].strip()
            if not in_section:
                current_title_parts = [text]
                current_body = []
                in_section = True
            elif should_merge_heading(current_title_parts[-1], text):
                current_title_parts.append(text)
            else:
                flush_section()
                current_title_parts = [text]
                current_body = []
                in_section = True
            continue

        if in_section:
            current_body.append(line)
        else:
            intro.append(line)

    flush_section()
    return intro, sections


def split_h4_disorders(title: str, body_lines: list[str]) -> list[tuple[str, list[str]]]:
    """Divide seções com vários transtornos em #### (ex.: transtornos de tique)."""
    body = "".join(body_lines)
    if "#### Transtorno" not in body and "#### Deficiência" not in body:
        return [(title, body_lines)]

    subsections: list[tuple[str, list[str]]] = []
    current_title: str | None = None
    current_lines: list[str] = []

    def flush():
        nonlocal current_title, current_lines
        if current_title is not None:
            subsections.append((current_title, current_lines))
        current_title = None
        current_lines = []

    for line in body_lines:
        if line.startswith("#### "):
            heading = line[5:].strip()
            # continuação entre parênteses do título anterior (ex.: "Transtorno
            # Factício Imposto a Outro" + "(Antes Transtorno Factício por
            # Procuração)") — funde no título, não cria um item novo.
            if heading.startswith("(") and current_title is not None:
                current_title = f"{current_title} {heading}"
                continue
            if EPISODE_H4.match(heading):
                if current_title is not None:
                    current_lines.append(line)
                continue
            if ICD_LINE.match(line):
                if current_title is not None:
                    current_lines.append(line)
                continue
            flush()
            current_title = heading
            current_lines = []
            continue
        if current_title is not None:
            current_lines.append(line)

    flush()

    valid = [s for s in subsections if section_has_diagnostic_content("".join(s[1])) or looks_like_disorder_title(s[0])]
    return valid if len(valid) >= 2 else [(title, body_lines)]


def build_disorder_header(category_title: str, disorder_title: str) -> str:
    return (
        f"# {disorder_title}\n\n"
        f"*Categoria: {category_title}*\n\n"
        f"---\n\n"
    )


def process_category_file(cat_path: Path) -> list[tuple[str, int]]:
    text = cat_path.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=True)

    category_title = cat_path.stem
    # Extrai título legível do cabeçalho do arquivo de categoria
    m = re.search(r"^# \d+\.\s+(.+)$", text, re.MULTILINE)
    category_name = m.group(1).strip() if m else cat_path.stem

    out_dir = cat_path.parent / cat_path.stem
    if out_dir.exists():
        for old in out_dir.glob("*.md"):
            old.unlink()
    out_dir.mkdir(exist_ok=True)

    # Remove cabeçalho gerado pelo split anterior (até ---)
    content_start = 0
    for i, line in enumerate(lines):
        if line.strip() == "---":
            content_start = i + 1
            break
    content_lines = lines[content_start:]

    intro, sections = parse_h2_sections(content_lines)

    if intro:
        intro_path = out_dir / "00-introducao.md"
        intro_content = (
            f"# Introdução — {category_name}\n\n"
            f"*Categoria: {category_name}*\n\n---\n\n"
            + "".join(intro).lstrip()
        )
        intro_path.write_text(intro_content, encoding="utf-8")

    slug_counts: dict[str, int] = {}
    written: list[tuple[str, str, int]] = []

    for section_title, section_body in sections:
        if not is_disorder_section(section_title, "".join(section_body)):
            continue

        for disorder_title, disorder_lines in split_h4_disorders(section_title, section_body):
            if not any(line.strip() for line in disorder_lines):
                continue
            slug_base = slugify(disorder_title)
            count = slug_counts.get(slug_base, 0) + 1
            slug_counts[slug_base] = count
            slug = slug_base if count == 1 else f"{slug_base}-{count}"

            filename = f"{slug}.md"

            out_path = out_dir / filename
            content = build_disorder_header(category_name, disorder_title) + "".join(disorder_lines).lstrip()
            out_path.write_text(content, encoding="utf-8")
            written.append((disorder_title, filename, len(disorder_lines)))

    # README da categoria
    readme_lines = [
        f"# {category_name}\n",
        f"Transtornos extraídos de `{cat_path.name}`.\n",
        "| Transtorno | Arquivo | Linhas |",
        "|-----------|---------|--------|",
    ]
    if intro:
        readme_lines.append(f"| *Introdução* | [00-introducao.md](00-introducao.md) | — |")
    for title, filename, line_count in written:
        readme_lines.append(f"| {title} | [{filename}]({filename}) | {line_count:,} |")

    (out_dir / "README.md").write_text("\n".join(readme_lines) + "\n", encoding="utf-8")
    return written


def update_main_readme(counts: list[tuple[int, str, str, str, int]]) -> None:
    lines = [
        "# Categorias Diagnósticas — DSM-5 (Seção II)\n",
        "Conteúdo extraído de `DSM-V.md`, dividido nas 20 categorias de transtornos mentais.\n",
        "Cada categoria possui uma subpasta com um arquivo `.md` por transtorno.\n",
        "| # | Categoria | Pasta | Transtornos |",
        "|---|-----------|-------|-------------|",
    ]
    for num, title, slug, folder, disorder_count in counts:
        lines.append(
            f"| {num:02d} | {title} | [{slug}/]({folder}/README.md) | {disorder_count} |"
        )
    lines.append("")
    (CATEGORIAS_DIR / "README.md").write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    cat_files = sorted(CATEGORIAS_DIR.glob("[0-9][0-9]-*.md"))
    if not cat_files:
        print(f"Nenhuma categoria em {CATEGORIAS_DIR}", file=sys.stderr)
        sys.exit(1)

    total_disorders = 0
    readme_counts: list[tuple[int, str, str, str, int]] = []

    for cat_path in cat_files:
        written = process_category_file(cat_path)
        total_disorders += len(written)
        m = re.search(r"^(\d+)-(.+)\.md$", cat_path.name)
        num = int(m.group(1)) if m else 0
        slug = m.group(2) if m else cat_path.stem
        title_m = re.search(r"^# \d+\.\s+(.+)$", cat_path.read_text(encoding="utf-8"), re.MULTILINE)
        title = title_m.group(1).strip() if title_m else slug
        readme_counts.append((num, title, slug, cat_path.stem, len(written)))
        print(f"{cat_path.name}: {len(written)} transtornos", file=sys.stderr)

    update_main_readme(readme_counts)
    print(f"\nTotal: {total_disorders} arquivos de transtornos", file=sys.stderr)


if __name__ == "__main__":
    main()
