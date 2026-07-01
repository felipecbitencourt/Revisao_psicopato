#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_psico.py
==============
Lê os JSONs em md_psico/ (um por função psíquica) e gera psico-content.js —
expõe `window.PSICO_CONTENT` para a seção de Psicopatologia/Semiologia
(fichas de sintomas/fenômenos, à parte das fichas de transtornos do DSM).

Fonte: Dalgalarrondo, Psicopatologia (redação autoral a partir do livro,
revisada por pipeline de fact-checking — ver md_psico/README quando houver
mais funções). Cada JSON de entrada tem a forma:
  {funcao, color, items: [{n, sg, tldr, definicao, fenomenologia, exemplos,
                            diferencial, apareceEm, fonte}, ...]}

Uso:  python build/build_psico.py
"""

import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # build/ -> raiz do repo
SRC_DIR = os.path.join(ROOT, "md_psico")
OUT = os.path.join(ROOT, "psico-content.js")

HEADER = ("/* GERADO por build/build_psico.py — não edite à mão.\n"
          "   Fonte editável: md_psico/*.json. Reconstrua com:\n"
          "   python build/build_psico.py */\n")


def load_categories():
    if not os.path.isdir(SRC_DIR):
        return []
    files = sorted(f for f in os.listdir(SRC_DIR) if f.endswith(".json"))
    cats = []
    for fn in files:
        with open(os.path.join(SRC_DIR, fn), encoding="utf-8") as fh:
            data = json.load(fh)
        cats.append({
            "name": data["funcao"],
            "color": data.get("color", "#6C5CE7"),
            "items": data.get("items", []),
        })
    return cats


def main():
    categories = load_categories()
    n_items = sum(len(c["items"]) for c in categories)
    payload = "window.PSICO_CONTENT = " + json.dumps({"categories": categories}, ensure_ascii=False) + ";\n"
    with open(OUT, "w", encoding="utf-8") as fh:
        fh.write(HEADER + payload)
    print(f"psico-content.js gerado: {len(categories)} função(ões), {n_items} ficha(s).")


if __name__ == "__main__":
    main()
