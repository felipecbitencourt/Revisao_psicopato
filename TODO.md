# Psico·Pato — Correções e melhorias futuras

Backlog levantado. Marque `[x]` ao concluir. O número entre parênteses `(#N)` é a referência original da lista.

---

## 🐞 Bugs

- [x] **(#2) Cor do botão "Sobre" sobrepondo "Ranking"** — o estado ativo/coloração da aba **Sobre** está conflitando com **Ranking** na barra lateral. _(navItems / navBtn em app.js)_ ✅ botão ativo virou pílula clara (não colide mais com o levelCard escuro).
- [x] **(#14) Erro de carregamento do Ranking** — corrigir falha ao abrir a tela de ranking. ✅ organizado/resolvido pelo usuário.
- [x] **(#19) Questões do questionário cortadas** — o texto da pergunta no quiz transborda/é cortado. _(screenQuiz)_ ✅ `shorten()` reescrito em build_content.py (resumo inteiro se ≤520 chars); content.js regenerado.
- [x] **(#13) Revisar códigos de transtornos** — ✅ revisão refeita sobre o content.js atual: das 35 fichas sem código, **só 3 eram recuperáveis** (Conversivo, Factício Autoimposto, Factício Imposto a Outro). Adicionadas ao `CODE_OVERRIDES` (build_content.py) e content.js regerado: Conversivo 300.11 + variantes F44.4–F44.7; Factício Autoimposto 300.19 (F68.10); Factício Imposto a Outro 300.19 **(F68.A, DSM-5-TR)**. As outras 32 são legítimas (induzidos/intoxicação/abstinência/especificador — codificados por tabela, sem código fixo). _(PTSD/Pica/Anorexia/Esquizotípica/Antissocial da estimativa antiga já tinham código.)_ Bônus: `content.js?v=2` (cache-bust).
- [x] **(#21) Emoji do estudo de caso** — trocar 🩺 (estetoscópio) por 🧠 (cérebro) no banner de feedback. _(screenCaso, resposta errada)_ ✅

## ✨ Funcionalidades novas

- [x] **(#1) Menu lateral colapsável** — permitir recolher/expandir a sidebar. ✅ botão no topbar alterna entre rail de ícones (76px) e completo (250px); estado persistido em localStorage.
- [x] **(#3) Menu de acessibilidade** — ✅ integrado o **a11y-kit** (vanilla, prefixo `ak-`) com botão no **header** (FAB padrão escondido). Recursos: tamanho de fonte (zoom), fontes assistivas (Lexend/Atkinson/Dislexia), espaçamento, biônica, filtros (daltonismo/cinza/brilho/saturação), cursor grande, destaque de links, foco de teclado, leitor de voz, descrição de imagens, presets. Adaptado ao **SPA**: `contentSelector:'#app'` (zoom/filtros persistem), classes no `<html>` persistem, e hook `A11Y.reapply()` no fim do `render()` reaplica biônica/transformações ao conteúdo recriado. Dark próprio do kit desligado (o app já tem). ℹ️ _Pendência fina: tematizar o painel do kit para o dark mode do app._
- [x] **(#5) Login com Google** — OAuth Google via Supabase. ✅ **funcionando de ponta a ponta** (código + provider Google no Supabase + OAuth client no Google Cloud). No caminho, corrigidos: redirect `www`→raiz quebrado na Cloudflare (estava com expressão no modo wildcard) e Site URL/Redirect URLs do Supabase.
- [x] **(#15) Voltar página** — suporte ao "voltar" (histórico do navegador / pilha de navegação). ✅ pilha interna + History API (botão no topbar + back do navegador/celular convergem no popstate); restaura tela e contexto (categoria/ficha).
- [x] **(#7) Notificação de boas-vindas** — mensagem inicial no primeiro acesso. ✅ sino do topo virou central de avisos (badge, painel, mural) que abre sozinho no 1º acesso com a mensagem de boas-vindas.

## 👤 Perfil & conta

- [x] **(#4) Foto de perfil e apelido** — ✅ tela **Meu perfil** (clique no perfil da sidebar): apelido, nome, curso, semestre + avatar com **3 formas** (12 avatares predefinidos · upload de foto p/ Supabase Storage · foto do Google). Apelido vira a referência (saudação `greetName` e ranking via RPC). `db.js` (updateProfile/uploadAvatar), `app.js` (tela+ações+helpers de avatar), `styles.css`. **Requer rodar no Supabase:** `schema.sql` (colunas apelido/avatar), `storage-avatars.sql` (bucket) e `gamification.sql` (ranking por apelido) — ver abaixo.
- [x] **(#10) E-mail de confirmação** — melhorar o e-mail de confirmação do Supabase e **corrigir textos em inglês**. ✅ templates brandeados em PT-BR criados em `email/` (confirmar-cadastro + recuperar-senha) com README. ⏸️ **Por ora fica o e-mail genérico** — editar templates no Supabase exige SMTP customizado (decisão do usuário: deixar pra depois).
- [x] **(extra) Recuperação de senha no app** — fluxo completo: link "Esqueci minha senha" no login → tela para pedir o e-mail (`resetPassword`) → ao voltar pelo link (evento `PASSWORD_RECOVERY` / `#type=recovery`), tela "Criar nova senha" (`updateUser`). `db.js` (resetPassword/updatePassword + evento no onAuth) e `app.js` (telas, ações, gating, Enter). Funciona com o e-mail padrão do Supabase. ⚠️ a URL do app precisa estar nas **Redirect URLs** do Supabase.
- [x] **(#11) Ver senha no login** — botão mostrar/ocultar senha no campo de senha. ✅ ícone de olho (eye/eyeOff) + ação `togglePass` no campo de senha.

## 🎮 Gamificação

- [x] **(#9) Como conquistar medalhas** — descrição/critério de cada conquista/medalha. ✅ medalCard mostra a descrição também nas medalhas bloqueadas (+ tooltip).
- [x] **(#16) Ajustar XP por atividades** — revisar os valores de XP recebidos por flashcard/quiz/caso/etc. ✅ **XP por domínio (1× por item)**: cada flashcard/questão/caso/fase só pontua na 1ª vez que é acertado (chave `modo:transtorno` no `payload` do evento); repetir = prática sem XP, errar não pontua. Acaba com o farm por repetição — no cliente E no ranking (deixa de inserir eventos duplicados; sem reaplicar gamification.sql). Métricas: "exercícios dominados" e "% do conteúdo dominado" (no lugar da taxa de acerto, que viraria 100%). Bônus: `app.js`/`db.js` ganharam cache-bust `?v=` (não precisa mais Ctrl+F5 pra esses).
- [x] **(#18) Contador "revisados" nas atividades** — ✅ (ajuste do usuário: não substituir, **somar**) os decks agora mostram **dois contadores**: "X atividades feitas" (novo, conta itens dominados do tipo na categoria via `activityCountsByCat`) + "rev / total fichas revisadas" (retitulado). **+ diferenciação visual forte por atividade (layout/forma distintos)**: flashcards = card com **cara de pilha de cartões** (bordas espiando atrás, laranja, ícone de cartão); quiz = **"?" + 3 linhas de múltipla escolha** (azul). Contador na cor da atividade; nº/nome/barra mantêm a cor da categoria. Revisão segue multicolor por categoria. `deckGrid` despacha para `flashDeckCard`/`quizDeckCard`.

## 🎨 UX, responsividade & conteúdo

- [x] **(#6) Portabilidade mobile/tablet** — ✅ botão **"Mais"** na bottom-nav abre um **bottom sheet** com os itens que viviam na sidebar e ficavam inacessíveis no mobile: Ranking, DSM-5-TR, Feedback, Sobre + **Meu perfil / Sair** (logado) ou **Criar conta** (visitante). Fecha ao navegar (via `setState`) ou tocar no backdrop. Sem overflow horizontal nas telas testadas (home/decks). _Auditoria responsiva fina das demais telas pode continuar conforme você encontrar pontos._
- [x] **(#8) "Continue de onde parou"** — atualmente **hardcoded** em `screenHome`; usar o último transtorno realmente visto. ✅ `setLastViewed()`/`state.lastViewed` (persistido em localStorage) + `continueCard()` dinâmico.
- [x] **(#12) Loadings** — melhorar estados de carregamento entre páginas e processos (skeletons/spinners). ✅ loader de marca (🧠 pulsante) no login/cadastro/checagem inicial; corrigido o bug do **formulário que esvaziava** ao clicar Entrar (agora mostra o loader no lugar do form e preserva o que foi digitado se der erro). Ranking já usava skeleton.
- [x] **(#17) Revisar ficha durante a atividade** — ✅ botão **"Ver ficha"** em flashcards (sempre), quiz e caso (após responder). Abre a ficha do transtorno via `openRef`; o histórico (#15) + "voltar" retorna à atividade **com o progresso intacto** (quizSet/índice/resposta preservados). Cartões/quiz carregam `ci/di`; caso usa `findRef` (case-insensitive).
- [x] **(#20) Casos** — ✅ `CASO` único → **lista `CASOS`** + `currentCaso()`; estudo de caso agora percorre **8 vinhetas** (Pânico, Depressivo Maior, TOC, TEPT, Ansiedade Social, Anorexia, Bipolar I, TAG), com "Caso N de 8", chave de domínio por `id` e botão "Ver ficha" resolvendo para o transtorno certo nos 8. ⚠️ **vinhetas ILUSTRATIVAS — requerem validação clínica do usuário** (e podem ser ampliadas/ajustadas).

---

**Concluídos até agora (ordem de facilidade):** #21 · #11 · #9 · #8 · #2 · #19 · #7 · #1 · #15 · #12 · #16 · #14 · #5 · #10* · #13 · #4* · #17 · #18 · #6 · #20 · #3.
_(* #10 com templates prontos, aguardando SMTP; #4 com código pronto, aguardando SQL no Supabase.)_

**Próximos da fila:** 🎉🎉 **TODOS os 21 itens numerados concluídos** (incluindo o #3, acessibilidade).

_Pendências de painel (você):_ **rodar `sql/schema.sql` de novo** — agora tem a coluna `instituicao` (universidade afiliada) além de apelido/avatar; depois `sql/gamification.sql` (ranking por apelido). _(storage-avatars já aplicado; smoke test confirmou bucket OK.)_ Colar templates de e-mail / configurar SMTP (#10). _Para revisar:_ conferir a matriz de substâncias e validar clinicamente as 8 vinhetas de caso (#20).

_Extra:_ campo **Instituição / Universidade** no cadastro e no perfil (coluna `instituicao` + trigger atualizados no schema.sql).

**Extras (fora da numeração):** ensaio "Psicodiagnóstico" no Sobre · card "Fonte e finalidade educativa" (atribuição DSM) · **4 de 5 tabelas-imagem convertidas em tabelas HTML** (Def. Intelectual, Autismo, LCT, matriz de substâncias — esta a conferir; neurocognitiva segue como imagem) · cache-bust de app.js/db.js/content.js · remoção de secret do histórico git · **tela de boas-vindas/landing** (`screenWelcome`) antes do login, explicando a plataforma com CTAs Criar conta / Continuar como visitante / Entrar (logo das telas de auth volta para ela; logout cai nela).

### Config do #4 no Supabase (você) — rodar no SQL Editor
1. **`sql/schema.sql`** (de novo) → adiciona as colunas `apelido` e `avatar` em `profiles` (idempotente; já com o trigger que pega o nome do Google).
2. **`sql/storage-avatars.sql`** → cria o bucket público `avatars` + policies (necessário para o **upload de foto**).
3. **`sql/gamification.sql`** (de novo) → ranking passa a exibir o **apelido** (coalesce apelido → nome).

---

### Config do Login com Google (#5) — passos no painel (você)
1. **Google Cloud Console** → APIs & Services → Credentials → *Create OAuth client ID* → tipo **Web application**.
   - Em *Authorized redirect URIs*, adicione: `https://<SEU-PROJECT-REF>.supabase.co/auth/v1/callback`.
   - Copie o **Client ID** e **Client Secret**.
2. **Supabase** → Authentication → **Providers → Google** → habilite e cole Client ID + Secret.
3. **Supabase** → Authentication → **URL Configuration → Redirect URLs**: adicione as URLs do app (ex.: `http://localhost:8001/` para testes e a URL de produção).
4. (Opcional) Reaplicar o `sql/schema.sql` para o trigger gravar o nome do Google no perfil. O app já mostra o nome via metadados mesmo sem isso.

_Extra (fora da numeração): ensaio "Psicodiagnóstico" adicionado como destaque na aba Sobre._
