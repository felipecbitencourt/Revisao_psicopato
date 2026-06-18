#!/usr/bin/env python3
"""Converte DSM-V.pdf para Markdown estruturado."""

from __future__ import annotations

import re
import sys
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parent.parent   # build/ -> raiz do repo
PDF_PATH = ROOT / "DSM-V.pdf"
OUT_DIR = ROOT / "md"
OUT_FILE = OUT_DIR / "DSM-V.md"

# Tamanhos de fonte observados no PDF (Nexus / Palatino)
H1_MIN = 20.0
H2_MIN = 15.0
H3_MIN = 12.0
H4_MIN = 9.8
BODY_MAX = 9.2
HEADER_SIZE = 9.5  # cabeçalho de página (título + número)


def heading_level(size: float, font: str) -> int | None:
    if size >= H1_MIN:
        return 1
    if size >= H2_MIN:
        return 2
    if size >= H3_MIN:
        return 3
    if size >= H4_MIN and "Bold" in font:
        return 4
    return None


PAGE_HEADER_RE = re.compile(
    r"^\*{0,2}\d{1,4}\*{0,2}\s+[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][\w\s,/–-]+$"
)
PAGE_NUMBER_ONLY_RE = re.compile(r"^\*{0,2}\d{1,4}\*{0,2}$")


def is_page_header(line_spans: list[dict]) -> bool:
    texts = [s["text"].strip() for s in line_spans if s["text"].strip()]
    if not texts:
        return True

    joined = " ".join(texts).strip()
    if PAGE_NUMBER_ONLY_RE.match(joined):
        return True

    if len(texts) == 2 and texts[-1].isdigit():
        return all(round(s["size"], 1) <= HEADER_SIZE for s in line_spans)

    if len(texts) == 1 and texts[0].isdigit() and round(line_spans[0]["size"], 1) <= HEADER_SIZE:
        return True

    # Cabeçalho: "Título do Capítulo 57"
    if len(texts) >= 2 and texts[-1].isdigit() and len(texts[-1]) <= 4:
        body = " ".join(texts[:-1])
        if len(body) < 120 and body[0].isupper():
            return True

    return False


def strip_page_header_fragments(text: str) -> str:
    """Remove restos de cabeçalho de página que se fundiram ao parágrafo."""
    text = re.sub(
        r"\s*\*{0,2}\d{1,4}\*{0,2}\s+"
        r"(?:Espectro da Esquizofrenia|Transtornos do|Introdução|Utilização do Manual|"
        r"Transtorno [A-Za-zÁÀÂÃÉÊÍÓÔÕÚÇ]+|Deficiências Intelectuais|Catatonia|Prefácio|"
        r"Classificação|Informações Básicas|Critérios Diagnósticos)[^.\n]{0,80}\s+",
        " ",
        text,
    )
    # NÃO remover números isolados do corpo: a regra anterior apagava limiares
    # clínicos (idades, durações, contagens — ex.: "no mínimo 18 anos").
    # Números de página/cabeçalho já são removidos por is_page_header() no nível
    # da linha, então um stripping cego aqui causava perda de informação.
    return re.sub(r"  +", " ", text).strip()


def spans_to_markdown(spans: list[dict]) -> str:
    parts: list[str] = []
    for span in spans:
        text = span["text"]
        if not text:
            continue
        font = span["font"]
        size = span["size"]
        if "Italic" in font and "Bold" not in font:
            parts.append(f"*{text}*")
        elif "Bold" in font and size < H4_MIN:
            parts.append(f"**{text}**")
        else:
            parts.append(text)
    return "".join(parts).strip()


def line_to_markdown(line: dict) -> tuple[str | None, str]:
    spans = [span for span in line["spans"] if span["text"].strip()]
    if not spans:
        return None, ""

    if is_page_header(spans):
        return None, ""

    max_size = max(s["size"] for s in spans)
    main_font = max(spans, key=lambda s: len(s["text"]))["font"]
    level = heading_level(max_size, main_font)
    text = spans_to_markdown(spans)

    if not text:
        return None, ""

    if level:
        text = re.sub(r"\s+", " ", text)
        return f"{'#' * level} {text}", text

    return spans_to_markdown(spans), text


def extract_page(page: fitz.Page) -> list[str]:
    lines_out: list[str] = []
    blocks = page.get_text("dict")["blocks"]

    for block in blocks:
        if block.get("type") != 0:
            continue
        for line in block["lines"]:
            md_line, plain = line_to_markdown(line)
            if md_line is None:
                continue
            lines_out.append(md_line)

    return lines_out


def merge_lines(lines: list[str]) -> list[str]:
    """Junta linhas de parágrafo quebradas e normaliza espaços."""
    merged: list[str] = []
    buffer = ""

    def flush():
        nonlocal buffer
        if buffer:
            merged.append(strip_page_header_fragments(buffer.strip()))
            buffer = ""

    for line in lines:
        if line.startswith("#"):
            flush()
            merged.append(line)
            continue

        stripped = line.strip()
        if not stripped:
            flush()
            continue

        if buffer:
            if buffer.endswith("-") and not buffer.endswith("--"):
                buffer = buffer[:-1] + stripped
            elif re.search(r"[.!?:;\"'\)]$", buffer) or stripped[0].isupper() and len(buffer) > 80:
                flush()
                buffer = stripped
            else:
                buffer += " " + stripped
        else:
            buffer = stripped

    flush()
    return merged


def build_markdown(doc: fitz.Document) -> str:
    all_lines: list[str] = []

    meta = doc.metadata
    title = meta.get("title") or "DSM-5"
    all_lines.append(f"# {title}\n")
    all_lines.append(f"*Fonte: {meta.get('author', 'American Psychiatric Association')}*\n")
    all_lines.append("---\n")

    total = doc.page_count
    for i in range(total):
        page_lines = extract_page(doc[i])
        if not page_lines:
            continue
        merged = merge_lines(page_lines)
        all_lines.extend(merged)
        all_lines.append("")
        if (i + 1) % 50 == 0:
            print(f"  {i + 1}/{total} páginas processadas...", file=sys.stderr)

    # Remove headings duplicados consecutivos
    cleaned: list[str] = []
    prev = None
    for line in all_lines:
        if line.startswith("#") and line == prev:
            continue
        cleaned.append(line)
        if line.startswith("#"):
            prev = line
        elif line.strip():
            prev = None

    return "\n".join(cleaned).strip() + "\n"


def main() -> None:
    if not PDF_PATH.exists():
        print(f"PDF não encontrado: {PDF_PATH}", file=sys.stderr)
        sys.exit(1)

    OUT_DIR.mkdir(exist_ok=True)
    print(f"Lendo {PDF_PATH}...", file=sys.stderr)

    doc = fitz.open(PDF_PATH)
    print(f"Total: {doc.page_count} páginas", file=sys.stderr)

    markdown = build_markdown(doc)
    doc.close()

    OUT_FILE.write_text(markdown, encoding="utf-8")
    print(f"Salvo em {OUT_FILE} ({len(markdown):,} caracteres)", file=sys.stderr)


if __name__ == "__main__":
    main()
