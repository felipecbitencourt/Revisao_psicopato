# Psico·Pato — Correções e melhorias futuras

Backlog levantado. Marque `[x]` ao concluir. O número entre parênteses `(#N)` é a referência original da lista.

---

## 🐞 Bugs

- [x] **(#2) Cor do botão "Sobre" sobrepondo "Ranking"** — o estado ativo/coloração da aba **Sobre** está conflitando com **Ranking** na barra lateral. _(navItems / navBtn em app.js)_ ✅ botão ativo virou pílula clara (não colide mais com o levelCard escuro).
- [x] **(#14) Erro de carregamento do Ranking** — corrigir falha ao abrir a tela de ranking. ✅ organizado/resolvido pelo usuário.
- [x] **(#19) Questões do questionário cortadas** — o texto da pergunta no quiz transborda/é cortado. _(screenQuiz)_ ✅ `shorten()` reescrito em build_content.py (resumo inteiro se ≤520 chars); content.js regenerado.
- [ ] **(#13) Revisar códigos de transtornos** — ~41 fichas sem CID/DSM. ~10 são falhas de extração recuperáveis (PTSD, Pica, Anorexia, Factício, Esquizotípica, Antissocial cross-ref, etc.) → manifesto `CODE_FIXES` em `build_content.py`. ~30 são legítimos (intoxicação/abstinência/induzidos por substância — codificados por tabela).
- [x] **(#21) Emoji do estudo de caso** — trocar 🩺 (estetoscópio) por 🧠 (cérebro) no banner de feedback. _(screenCaso, resposta errada)_ ✅

## ✨ Funcionalidades novas

- [x] **(#1) Menu lateral colapsável** — permitir recolher/expandir a sidebar. ✅ botão no topbar alterna entre rail de ícones (76px) e completo (250px); estado persistido em localStorage.
- [ ] **(#3) Menu de acessibilidade** — tamanho de fonte, alto contraste, reduzir movimento, etc.
- [x] **(#5) Login com Google** — OAuth Google via Supabase (login facilitado). ✅ código pronto: `DB.loginGoogle()` (`signInWithOAuth`), botão "Continuar com Google" no login e cadastro, nome/avatar do Google preenchidos via `user_metadata` (`enrichProfile`), trigger do schema atualizado (coalesce full_name). **Falta config no Supabase/Google Cloud (do usuário) — ver passos abaixo.**
- [x] **(#15) Voltar página** — suporte ao "voltar" (histórico do navegador / pilha de navegação). ✅ pilha interna + History API (botão no topbar + back do navegador/celular convergem no popstate); restaura tela e contexto (categoria/ficha).
- [x] **(#7) Notificação de boas-vindas** — mensagem inicial no primeiro acesso. ✅ sino do topo virou central de avisos (badge, painel, mural) que abre sozinho no 1º acesso com a mensagem de boas-vindas.

## 👤 Perfil & conta

- [ ] **(#4) Foto de perfil e apelido** — adicionar avatar e apelido. **O apelido passa a ser a forma de referência ao usuário** (saudação na home, ranking, etc.).
- [x] **(#10) E-mail de confirmação** — melhorar o e-mail de confirmação do Supabase e **corrigir textos em inglês**. ✅ templates brandeados em PT-BR criados em `email/` (confirmar-cadastro + recuperar-senha) com README. ⏸️ **Por ora fica o e-mail genérico** — editar templates no Supabase exige SMTP customizado (decisão do usuário: deixar pra depois).
- [x] **(extra) Recuperação de senha no app** — fluxo completo: link "Esqueci minha senha" no login → tela para pedir o e-mail (`resetPassword`) → ao voltar pelo link (evento `PASSWORD_RECOVERY` / `#type=recovery`), tela "Criar nova senha" (`updateUser`). `db.js` (resetPassword/updatePassword + evento no onAuth) e `app.js` (telas, ações, gating, Enter). Funciona com o e-mail padrão do Supabase. ⚠️ a URL do app precisa estar nas **Redirect URLs** do Supabase.
- [x] **(#11) Ver senha no login** — botão mostrar/ocultar senha no campo de senha. ✅ ícone de olho (eye/eyeOff) + ação `togglePass` no campo de senha.

## 🎮 Gamificação

- [x] **(#9) Como conquistar medalhas** — descrição/critério de cada conquista/medalha. ✅ medalCard mostra a descrição também nas medalhas bloqueadas (+ tooltip).
- [x] **(#16) Ajustar XP por atividades** — revisar os valores de XP recebidos por flashcard/quiz/caso/etc. ✅ **XP por domínio (1× por item)**: cada flashcard/questão/caso/fase só pontua na 1ª vez que é acertado (chave `modo:transtorno` no `payload` do evento); repetir = prática sem XP, errar não pontua. Acaba com o farm por repetição — no cliente E no ranking (deixa de inserir eventos duplicados; sem reaplicar gamification.sql). Métricas: "exercícios dominados" e "% do conteúdo dominado" (no lugar da taxa de acerto, que viraria 100%). Bônus: `app.js`/`db.js` ganharam cache-bust `?v=` (não precisa mais Ctrl+F5 pra esses).
- [ ] **(#18) Contador "revisados" nas atividades** — hoje conta **fichas**; trocar para o **nº de atividades já realizadas naquela categoria**.

## 🎨 UX, responsividade & conteúdo

- [ ] **(#6) Portabilidade mobile/tablet** — revisar responsividade. ⚠️ No mobile a sidebar fica oculta, então **Ranking / DSM-5-TR / Feedback / Sobre ficam inacessíveis** (a bottom-nav só mostra os 4 principais) — avaliar um botão "Mais".
- [x] **(#8) "Continue de onde parou"** — atualmente **hardcoded** em `screenHome`; usar o último transtorno realmente visto. ✅ `setLastViewed()`/`state.lastViewed` (persistido em localStorage) + `continueCard()` dinâmico.
- [x] **(#12) Loadings** — melhorar estados de carregamento entre páginas e processos (skeletons/spinners). ✅ loader de marca (🧠 pulsante) no login/cadastro/checagem inicial; corrigido o bug do **formulário que esvaziava** ao clicar Entrar (agora mostra o loader no lugar do form e preserva o que foi digitado se der erro). Ranking já usava skeleton.
- [ ] **(#17) Revisar ficha durante a atividade** — botão para abrir a ficha do transtorno no meio de um exercício.
- [ ] **(#20) Casos** — hoje há **apenas 1 caso ilustrativo (incompleto)**; montar um banco de casos reais.

---

**Concluídos até agora (ordem de facilidade):** #21 · #11 · #9 · #8 · #2 · #19 · #7 · #1 · #15 · #12 · #16 · #14 · #5* · #10*.
_(* #5 e #10 com código/templates prontos, aguardando config no painel do Supabase.)_

**Próximos da fila (mais fáceis primeiro):** #13 (códigos) · #17 (revisar ficha na atividade) · #6 (mobile) · #18 (revisados→atividades) · #4 (foto+apelido) · #20 (casos). _#3 (acessibilidade) fica para o usuário._

---

### Config do Login com Google (#5) — passos no painel (você)
1. **Google Cloud Console** → APIs & Services → Credentials → *Create OAuth client ID* → tipo **Web application**.
   - Em *Authorized redirect URIs*, adicione: `https://<SEU-PROJECT-REF>.supabase.co/auth/v1/callback`.
   - Copie o **Client ID** e **Client Secret**.
2. **Supabase** → Authentication → **Providers → Google** → habilite e cole Client ID + Secret.
3. **Supabase** → Authentication → **URL Configuration → Redirect URLs**: adicione as URLs do app (ex.: `http://localhost:8001/` para testes e a URL de produção).
4. (Opcional) Reaplicar o `sql/schema.sql` para o trigger gravar o nome do Google no perfil. O app já mostra o nome via metadados mesmo sem isso.

_Extra (fora da numeração): ensaio "Psicodiagnóstico" adicionado como destaque na aba Sobre._
