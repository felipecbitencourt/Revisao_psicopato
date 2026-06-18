# DSM · Revisa

Plataforma de estudos e revisão dos transtornos do **DSM-5-TR** — fichas-resumo
com critérios diagnósticos, especificadores e seções narrativas, exercícios
(flashcards, quiz, casos), gamificação (XP, níveis, medalhas), ranking e
feedback. App estático em **HTML/CSS/JS vanilla**, com **Supabase** para
login, progresso e métricas.

## Estrutura

```
/                         site servido (raiz)
├── index.html            página única
├── app.js                UI + lógica (render por estado, sem framework)
├── db.js                 camada de dados (Supabase ou modo visitante/demo)
├── styles.css            estilos
├── content.js            ⚙️ GERADO — as 20 categorias / 229 fichas
├── supabase-config.js    URL + chave anon do Supabase
├── logo-128.png, favicon-*.png, apple-touch-icon.png
├── DSM-V.pdf             manual (exibido na aba DSM-5-TR + fonte do build)
├── assets/tabelas/       imagens de tabelas recortadas do PDF (servidas nas fichas)
├── md/                   markdown intermediário (saída do build, entrada do content.js)
│
├── build/                pipeline Python que gera o conteúdo
│   ├── pdf_to_md.py          DSM-V.pdf  -> md/DSM-V.md
│   ├── split_categorias.py   md/DSM-V.md -> md/categorias/NN-*.md
│   ├── split_transtornos.py  -> md/categorias/NN-*/<transtorno>.md
│   └── build_content.py      md/categorias/ -> content.js
├── sql/                  setup do banco (rodar no SQL Editor do Supabase)
│   ├── schema.sql            perfis, progresso, eventos + RLS
│   ├── gamification.sql      função leaderboard() (ranking por período)
│   └── feedback.sql          tabela de feedback + RLS
├── tools/
│   └── scan_fichas.cjs   auditoria determinística das fichas (regressão)
└── docs/
    ├── SUPABASE_SETUP.md         passo a passo do Supabase
    └── RELATORIO_AUDITORIA_FICHAS.md
```

## Rodar (local)

É um site estático — basta servir a raiz:

```bash
python -m http.server 8000
```

Abra <http://localhost:8000>. Sem o Supabase configurado, roda em **modo
demonstração**; com as chaves em `supabase-config.js`, liga login e dados.

## Reconstruir o conteúdo (`content.js`)

`content.js` é **gerado** — não edite à mão. Para reconstruir a partir do PDF:

```bash
python build/pdf_to_md.py        # PDF -> md/DSM-V.md
python build/split_categorias.py # -> md/categorias/NN-*.md
python build/split_transtornos.py# -> arquivos por transtorno
python build/build_content.py    # -> content.js
```

Requer `PyMuPDF` (`pip install pymupdf`). Correções de dados que o parser não
captura ficam em dicionários curados no `build_content.py`
(`CODE_OVERRIDES`, `SPECIFIER_OVERRIDES`, `TEXT_FIXES`, `SECTION_ASSETS`).

Para auditar as fichas (códigos faltando, truncamento, etc.):
`node tools/scan_fichas.cjs`.

## Banco de dados (Supabase)

Veja [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md). Em resumo: rodar
`sql/schema.sql`, `sql/gamification.sql` e `sql/feedback.sql` no SQL Editor e
preencher `supabase-config.js`.
