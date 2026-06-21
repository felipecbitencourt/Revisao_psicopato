#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Dump per-disorder bundles for the tldr+facts generation workflow.

Reuses build_content's own parsing so the composite key (<folder>::<file>) and
the section text line up exactly with the build. Writes build/_gen/<key>.json
(one bundle per disorder) + build/_gen/_manifest.json (the index the workflow
iterates over). Read-only w.r.t. the app's data; safe to delete _gen/ after.

Run:  python tools/dump_gen_bundles.py
"""
import os
import re
import json
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "build"))
import build_content as B  # noqa: E402

OUT_DIR = os.path.join(B.ROOT, "build", "_gen")
RELEVANT = {
    "sec_caracteristicas": "Características diagnósticas",
    "sec_prevalencia": "Prevalência",
    "sec_curso": "Desenvolvimento e curso",
    "sec_genero": "Questões diagnósticas relativas ao gênero",
    "sec_diferencial": "Diagnóstico diferencial",
}


def sec_text(sections, title, limit):
    for sec in sections:
        if sec["title"] == title:
            return " ".join(B.body_text(b) for b in sec.get("body", []))[:limit]
    return ""


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    folders = sorted(
        d for d in os.listdir(B.CAT_DIR)
        if os.path.isdir(os.path.join(B.CAT_DIR, d)) and re.match(r"^\d{2}-", d)
    )
    manifest = []
    for folder in folders:
        fpath = os.path.join(B.CAT_DIR, folder)
        for disp_name, fname in B.parse_category_readme(fpath):
            full = os.path.join(fpath, fname)
            if not os.path.exists(full):
                continue
            d = B.parse_transtorno(full, disp_name)
            key = folder + "::" + fname[:-3]
            bundle = {
                "key": key,
                "n": d["n"],
                "criteriaIntro": (d.get("criteriaIntro") or "")[:800],
                "criteria": [{"letter": c["letter"], "text": (c.get("text") or "")[:300]} for c in d.get("criteria", [])],
            }
            for field, title in RELEVANT.items():
                bundle[field] = sec_text(d.get("sections", []), title, 1600)
            fn = key.replace("::", "__").replace("/", "_") + ".json"
            with open(os.path.join(OUT_DIR, fn), "w", encoding="utf-8") as fo:
                json.dump(bundle, fo, ensure_ascii=False)
            manifest.append({
                "key": key, "n": d["n"], "file": "build/_gen/" + fn,
                "hasSecs": bool(bundle["sec_caracteristicas"] or bundle["sec_prevalencia"]),
            })
    with open(os.path.join(OUT_DIR, "_manifest.json"), "w", encoding="utf-8") as fo:
        json.dump(manifest, fo, ensure_ascii=False, indent=1)
    print("bundles:", len(manifest), "| com seções:", sum(1 for m in manifest if m["hasSecs"]))


if __name__ == "__main__":
    main()
