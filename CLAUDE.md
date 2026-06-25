# CLAUDE.md — contexto do projeto Psico·Pato

Guia para sessões do Claude Code neste repositório. Leia antes de editar.

## O que é
**Psico·Pato** — plataforma de **estudo e revisão do DSM-5-TR** (fichas-resumo,
exercícios, estudos de caso), com gamificação (XP/níveis/medalhas), ranking,
rede social leve (amigos por código), busca avançada e notificações.
É um **site estático vanilla** (HTML/CSS/JS, sem framework, sem build do front)
+ **Supabase** (auth, Postgres com RLS, Storage, Edge Functions).

Rodar local: `python -m http.server 8000` → <http://localhost:8000>. Sem as
chaves do Supabase, roda em **modo demonstração**.

## ⚠️ Convenções que NÃO podem ser quebradas
1. **`content.js` é GERADO** por `build/build_content.py` (a partir de `md/` +
   dicionários de override). **Nunca edite à mão.** Correções de dado vão nos
   dicts do `build_content.py` (`CODE_OVERRIDES`, `TEXT_FIXES`, `CRIT_DROP`,
   `SPECIFIER_OVERRIDES`, `SECTION_ASSETS`) e depois `python build/build_content.py`.
2. **Os testes ficam com o usuário.** NÃO rode preview/navegador para verificar.
   Faça `node --check app.js` (e `db.js`/`search-engine.js`) e entregue; o usuário
   testa no próprio servidor.
3. **Cache-busting:** ao editar um asset, **suba o `?v=`** dele em `index.html`.
   Estado atual: `styles.css?v=48`, `content.js?v=30`, `db.js?v=38`,
   `search-engine.js?v=2`, `app.js?v=117`, `a11y-kit ?v=2`. O `service-worker.js`
   não tem `?v=` (usa `CACHE='psicopato-v2'`; bumpe a constante se mexer nele).
4. **SQL roda manualmente** no SQL Editor do Supabase (ver abaixo). Várias
   funções já mudaram de assinatura e têm `drop function` antes do `create` —
   ao mudar o retorno de uma função, faça o mesmo.

## Arquitetura do front (app.js)
- **Render por estado:** `setState(patch)` → `render()` reescreve todo o `#app`.
- **Cliques:** delegação via `data-action`/`data-arg` + `handleClick` (no nível do
  documento). `goScreen` é especial. `handleClick` converte `data-arg` numérico
  para Number (UUIDs/strings ficam string).
- **Hover/active:** `data-hover`/`data-active` + `bindFx(root)` (reanexado a cada render).
- **Binds imperativos** (reanexados após cada render, dentro de `render()`):
  `bindSearch` (busca do header), `bindClassify` (drag dos chips no Classificar),
  `bindAmigos` (input de código), `bindAdv` (textarea da busca avançada).
- **Telas:** `currentScreen()` faz o switch por `state.screen`.
- **`window.DB`** (db.js) é a camada de dados; `tracking()` = `DB.ready` (logado,
  não-visitante). Modo visitante persiste em localStorage.

## Mapa de arquivos
| Arquivo | Papel |
|---|---|
| `app.js` | UI + lógica (≈4600 linhas). Telas, ações, engines do quiz, gamificação. |
| `db.js` | Camada Supabase (auth, perfil, progresso, eventos, amigos, push, admin). |
| `content.js` | **GERADO** — 20 categorias / 222 transtornos do DSM-5-TR. |
| `search-engine.js` | Busca avançada (motor léxico). Exposto em `window.SemanticSearch`. |
| `styles.css` | Estilos. |
| `service-worker.js` | PWA (cache offline) + handlers de push. |
| `supabase-config.js` | `url`, `anonKey` e `vapidPublicKey` (push). |
| `termos.html` / `privacidade.html` | Documentos LGPD (páginas estáticas). |
| `build/` | Pipeline Python (PDF/md → content.js). |
| `tools/quiz_audit.cjs` | Regressão do gerador de quiz (replica a lógica). |
| `tools/search_eval.cjs` | Avaliação da busca (top-1/top-3/MRR sobre casos curados). |

## Banco (sql/, rodar no SQL Editor — idempotentes)
Ordem/dependências:
1. `schema.sql` — `profiles`/`progress`/`events` + RLS + trigger `handle_new_user`
   (cria perfil no signup, captura `termos_versao` + `now()`); RPC `accept_terms`.
2. `gamification.sql` — RPC `leaderboard(period,lim)` (XP derivado; retorna avatar).
3. `feedback.sql` — tabela `feedback` + RLS + **`is_admin()`** (e-mail dono:
   `felipe.cb2511@gmail.com`) + `feedback_list`/`feedback_delete`.
4. `friends.sql` — `codigo` em profiles + tabela `follows` + RPCs `find_by_code`,
   `follow_add/remove/list`, `profile_card`, `leaderboard_friends` (retorna avatar).
5. `push.sql` — `push_subscriptions` + RLS.
6. `storage-avatars.sql` — **bucket `avatars` público** (via `storage.buckets`,
   `public=true`) + policies (leitura pública, escrita só na pasta `<uid>/`).
7. `admin_stats.sql` — `app_sessions` (log de sessão) + RPCs `activity_stats`,
   `usage_stats` (gated por `is_admin`). Requer `feedback.sql`.
8. `caso_stats.sql` — `caso_stats` (% de acerto por estudo de caso, modo dev).

> Ao mudar o **retorno** de uma função (ex.: adicionar coluna), use
> `drop function if exists ...;` antes do `create` e re-rode o arquivo.

## Edge Functions (supabase/functions/, Deno)
Deploy: `supabase functions deploy <nome>` (ou pelo painel). **GOTCHA do slug:**
o painel pode gerar um **slug aleatório** ≠ do nome — então `db.js` chama o slug
real. Estado atual:
- `notify-follow` → push "novo seguidor". **Deployada com slug `swift-action`**;
  `db.js`→`functions.invoke('swift-action')`.
- `delete-account` → exclusão de conta (LGPD); cascata apaga os dados. `db.js`
  chama `'delete-account'` (ajuste se o slug publicado for outro).

Secrets de push (Resend/VAPID) e SMTP: ver `docs/PUSH_SETUP.md` e `SUPABASE_SETUP.md`.

## Engines
- **Quiz** (em `app.js`): mascara o nome no enunciado; `distinctiveCrits` filtra
  critérios ambíguos via regex (`EXCLUSION_CRIT`/`IMPAIRMENT_CRIT`/`BOILERPLATE_CRIT`),
  corte de densidade pós-máscara, e **dedup fuzzy** entre transtornos
  (`sharedCrit`, Jaccard ≥ 0.70 com máscara de identificadores de família).
  `quizBadSubject` barra residuais/etiológicos como enunciado. `factCards` usa
  `sharedFacts`. Regressão: `node tools/quiz_audit.cjs`.
- **Busca avançada** (`search-engine.js`): BM25F sobre trechos ponderados
  (`FIELD_WEIGHTS`/`SECTION_WEIGHTS`) + dicionário de conceitos clínicos
  (`SYNONYMS`, termos leigos→conceito) + **negação** ("sem X"). Avaliação:
  `node tools/search_eval.cjs` (baseline atual ~75% top-1 / ~87% top-3).
  **Próximo salto = embeddings** (ver Otimizações futuras).

## Gamificação / admin
- XP (espelhado em `gamification.sql`): ficha +25, **item dominado** (1º acerto sem
  dica) +15, dia ativo +15. Nível: `100·(N-1)²`.
- **Modo dev:** Ctrl+D, senha `190603`. Páginas DEV: **Atividades** (índice de
  acerto), **Uso** (métricas), **Feedbacks**. Tudo gated por `is_admin()` no banco.
- **LGPD:** checkbox de aceite no cadastro + **portão de consentimento** pós-login
  (`needsConsent`/`TERMOS_VERSAO`/`consentGate`), `accept_terms` (carimbo do
  servidor), exclusão de conta. Sessão é logada (tabela `app_sessions`) e citada
  na política.

## Otimizações futuras / dívida técnica
- **Busca semântica:** evoluir o motor léxico para **embeddings** (vetores das
  fichas pré-computados no build + embedding da consulta no navegador via
  transformers.js) como "modo profundo". Maior teto de qualidade.
- **Código morto** (seguro remover com cuidado + re-checar): `friendRow`,
  `loadFriends`, `amigosTab` (sobraram do ranking de amigos antigo); `ML`/`MR` e
  `match-*` (do "Ligar" antigo); globais demo `FLASHCARDS`/`QUIZ`.
- **Tempo de uso real:** hoje só conta "sessões" (aberturas). Heartbeat daria
  minutos em tela (mais peso/privacidade).
- **Consentimento no login Google:** o cadastro por e-mail registra `termos_versao`;
  o Google cai no portão pós-login, mas não passa pelo checkbox — ok, mas dá pra
  refinar.
- **Painel dev:** itens de quiz mais errados; cadastros por dia (gráfico).

## Docs
- `docs/SUPABASE_SETUP.md` — setup completo do banco/Storage/SMTP.
- `docs/DEPLOY.md` — checklist de deploy.
- `docs/PUSH_SETUP.md` — Web Push (VAPID/Resend).
- `docs/RELATORIO_AUDITORIA_FICHAS.md` — auditoria das fichas.
- `TODO.md` — backlog histórico (quase tudo concluído).
