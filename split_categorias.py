#!/usr/bin/env python3
"""Divide DSM-V.md em 20 arquivos por categoria diagnóstica (Seção II)."""

from __future__ import annotations

import re
import sys
from pathlib import Path

SOURCE = Path(__file__).parent / "md" / "DSM-V.md"
OUT_DIR = Path(__file__).parent / "md" / "categorias"

CATEGORIAS: list[tuple[int, str, str]] = [
    (1, "transtornos-do-neurodesenvolvimento", "Transtornos do Neurodesenvolvimento"),
    (2, "espectro-da-esquizofrenia-e-outros-transtornos-psicoticos", "Espectro da Esquizofrenia e Outros Transtornos Psicóticos"),
    (3, "transtorno-bipolar-e-transtornos-relacionados", "Transtorno Bipolar e Transtornos Relacionados"),
    (4, "transtornos-depressivos", "Transtornos Depressivos"),
    (5, "transtornos-de-ansiedade", "Transtornos de Ansiedade"),
    (6, "transtorno-obsessivo-compulsivo-e-transtornos-relacionados", "Transtorno Obsessivo-compulsivo e Transtornos Relacionados"),
    (7, "transtornos-relacionados-a-trauma-e-a-estressores", "Transtornos Relacionados a Trauma e a Estressores"),
    (8, "transtornos-dissociativos", "Transtornos Dissociativos"),
    (9, "transtorno-de-sintomas-somaticos-e-transtornos-relacionados", "Transtorno de Sintomas Somáticos e Transtornos Relacionados"),
    (10, "transtornos-alimentares", "Transtornos Alimentares"),
    (11, "transtornos-da-eliminacao", "Transtornos da Eliminação"),
    (12, "transtornos-do-sono-vigilia", "Transtornos do Sono-Vigília"),
    (13, "disfuncoes-sexuais", "Disfunções Sexuais"),
    (14, "disforia-de-genero", "Disforia de Gênero"),
    (15, "transtornos-disruptivos-do-controle-de-impulsos-e-da-conduta", "Transtornos Disruptivos, do Controle de Impulsos e da Conduta"),
    (16, "transtornos-relacionados-a-substancias-e-transtornos-aditivos", "Transtornos Relacionados a Substâncias e Transtornos Aditivos"),
    (17, "transtornos-neurocognitivos", "Transtornos Neurocognitivos"),
    (18, "transtornos-da-personalidade", "Transtornos da Personalidade"),
    (19, "transtornos-parafilicos", "Transtornos Parafílicos"),
    (20, "outros-transtornos-mentais", "Outros Transtornos Mentais"),
]

# Marcadores de início de capítulo (primeira linha H1 de cada categoria)
START_MARKERS: list[str] = [
    "# Transtornos do",
    "# Espectro da Esquizofrenia e",
    "# Transtorno Bipolar e",
    "# Transtornos\n# Depressivos",
    "# Transtornos de",
    "# Transtorno\n# Obsessivo-compulsivo e",
    "# Transtornos Relacionados a\n# Trauma e a Estressores",
    "# Transtornos\n# Dissociativos",
    "# Transtorno de Sintomas",
    "# Transtornos\n# Alimentares",
    "# Transtornos da\n# Eliminação",
    "# Transtornos do\n# Sono-Vigília",
    "# Disfunções",
    "# Disforia de",
    "# Transtornos Disruptivos,",
    "# Transtornos Relacionados\n# a Substâncias e",
    "# Transtornos\n# Neurocognitivos",
    "# Transtornos da\n# Personalidade",
    "# Transtornos\n# Parafílicos",
    "# Outros Transtornos",
]


def find_category_starts(lines: list[str]) -> list[int]:
    """Localiza linha (0-based) de início de cada categoria após a Seção II."""
    section_ii = next(i for i, line in enumerate(lines) if line.strip() == "# SEÇÃO II")
    starts: list[int] = []
    search_from = section_ii

    for marker in START_MARKERS:
        if "\n" in marker:
            parts = marker.split("\n")
            found = None
            for i in range(search_from, len(lines) - len(parts) + 1):
                if all(lines[i + j].strip() == parts[j].strip() for j in range(len(parts))):
                    found = i
                    break
            if found is None:
                raise ValueError(f"Marcador não encontrado: {marker!r}")
            starts.append(found)
            search_from = found + 1
        else:
            found = None
            for i in range(search_from, len(lines)):
                if lines[i].strip() == marker.strip():
                    found = i
                    break
            if found is None:
                raise ValueError(f"Marcador não encontrado: {marker!r}")
            starts.append(found)
            search_from = found + 1

    return starts


def build_file_header(num: int, title: str) -> str:
    return (
        f"# {num:02d}. {title}\n\n"
        f"*DSM-5 — Seção II: Critérios Diagnósticos e Códigos*\n\n"
        f"---\n\n"
    )


def build_readme(files: list[tuple[str, str, int]]) -> str:
    lines = [
        "# Categorias Diagnósticas — DSM-5 (Seção II)\n",
        "Conteúdo extraído de `DSM-V.md`, dividido nas 20 categorias de transtornos mentais.\n",
        "| # | Categoria | Arquivo | Linhas |",
        "|---|-----------|---------|--------|",
    ]
    for num, title, filename, line_count in files:
        lines.append(f"| {num:02d} | {title} | [{filename}]({filename}) | {line_count:,} |")
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    if not SOURCE.exists():
        print(f"Arquivo não encontrado: {SOURCE}", file=sys.stderr)
        sys.exit(1)

    lines = SOURCE.read_text(encoding="utf-8").splitlines(keepends=True)
    starts = find_category_starts(lines)
    movement_disorders = next(
        i for i, line in enumerate(lines) if line.strip() == "# Transtornos do Movimento"
    )
    ends = starts[1:] + [movement_disorders]

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    readme_entries: list[tuple[int, str, str, int]] = []

    for (num, slug, title), start, end in zip(CATEGORIAS, starts, ends):
        chunk = lines[start:end]
        filename = f"{num:02d}-{slug}.md"
        out_path = OUT_DIR / filename
        content = build_file_header(num, title) + "".join(chunk).lstrip()
        out_path.write_text(content, encoding="utf-8")
        readme_entries.append((num, title, filename, len(chunk)))
        print(f"  {filename}: {len(chunk):,} linhas", file=sys.stderr)

    readme_path = OUT_DIR / "README.md"
    readme_path.write_text(build_readme(readme_entries), encoding="utf-8")
    print(f"\nÍndice: {readme_path}", file=sys.stderr)
    print(f"Total: {len(CATEGORIAS)} categorias em {OUT_DIR}", file=sys.stderr)


if __name__ == "__main__":
    main()
