# Psico·Pato — Correções e melhorias futuras

Backlog levantado. Marque `[x]` ao concluir. O número entre parênteses `(#N)` é a referência original da lista.

---

## 🐞 Bugs

- [x] **(#2) Cor do botão "Sobre" sobrepondo "Ranking"** — o estado ativo/coloração da aba **Sobre** está conflitando com **Ranking** na barra lateral. _(navItems / navBtn em app.js)_ ✅ botão ativo virou pílula clara (não colide mais com o levelCard escuro).
- [ ] **(#14) Erro de carregamento do Ranking** — corrigir falha ao abrir a tela de ranking.
- [x] **(#19) Questões do questionário cortadas** — o texto da pergunta no quiz transborda/é cortado. _(screenQuiz)_ ✅ `shorten()` reescrito em build_content.py (resumo inteiro se ≤520 chars); content.js regenerado.
- [ ] **(#13) Revisar códigos de transtornos** — ~41 fichas sem CID/DSM. ~10 são falhas de extração recuperáveis (PTSD, Pica, Anorexia, Factício, Esquizotípica, Antissocial cross-ref, etc.) → manifesto `CODE_FIXES` em `build_content.py`. ~30 são legítimos (intoxicação/abstinência/induzidos por substância — codificados por tabela).
- [x] **(#21) Emoji do estudo de caso** — trocar 🩺 (estetoscópio) por 🧠 (cérebro) no banner de feedback. _(screenCaso, resposta errada)_ ✅

## ✨ Funcionalidades novas

- [ ] **(#1) Menu lateral colapsável** — permitir recolher/expandir a sidebar.
- [ ] **(#3) Menu de acessibilidade** — tamanho de fonte, alto contraste, reduzir movimento, etc.
- [ ] **(#5) Login com Google** — OAuth Google via Supabase (login facilitado).
- [ ] **(#15) Voltar página** — suporte ao "voltar" (histórico do navegador / pilha de navegação).
- [x] **(#7) Notificação de boas-vindas** — mensagem inicial no primeiro acesso. ✅ sino do topo virou central de avisos (badge, painel, mural) que abre sozinho no 1º acesso com a mensagem de boas-vindas.

## 👤 Perfil & conta

- [ ] **(#4) Foto de perfil e apelido** — adicionar avatar e apelido. **O apelido passa a ser a forma de referência ao usuário** (saudação na home, ranking, etc.).
- [ ] **(#10) E-mail de confirmação** — melhorar o e-mail de confirmação do Supabase e **corrigir textos em inglês**.
- [x] **(#11) Ver senha no login** — botão mostrar/ocultar senha no campo de senha. ✅ ícone de olho (eye/eyeOff) + ação `togglePass` no campo de senha.

## 🎮 Gamificação

- [x] **(#9) Como conquistar medalhas** — descrição/critério de cada conquista/medalha. ✅ medalCard mostra a descrição também nas medalhas bloqueadas (+ tooltip).
- [ ] **(#16) Ajustar XP por atividades** — revisar os valores de XP recebidos por flashcard/quiz/caso/etc.
- [ ] **(#18) Contador "revisados" nas atividades** — hoje conta **fichas**; trocar para o **nº de atividades já realizadas naquela categoria**.

## 🎨 UX, responsividade & conteúdo

- [ ] **(#6) Portabilidade mobile/tablet** — revisar responsividade. ⚠️ No mobile a sidebar fica oculta, então **Ranking / DSM-5-TR / Feedback / Sobre ficam inacessíveis** (a bottom-nav só mostra os 4 principais) — avaliar um botão "Mais".
- [x] **(#8) "Continue de onde parou"** — atualmente **hardcoded** em `screenHome`; usar o último transtorno realmente visto. ✅ `setLastViewed()`/`state.lastViewed` (persistido em localStorage) + `continueCard()` dinâmico.
- [ ] **(#12) Loadings** — melhorar estados de carregamento entre páginas e processos (skeletons/spinners).
- [ ] **(#17) Revisar ficha durante a atividade** — botão para abrir a ficha do transtorno no meio de um exercício.
- [ ] **(#20) Casos** — hoje há **apenas 1 caso ilustrativo (incompleto)**; montar um banco de casos reais.

---

**Concluídos até agora (ordem de facilidade):** #21 · #11 · #9 · #8 · #2 · #19.

**Próximos da fila (mais fáceis primeiro):** #7 (boas-vindas) · #1 (sidebar colapsável) · #15 (voltar página) · #12 (loadings) · #16 (XP) · #5 (Google) · #10 (e-mail/EN) · #13 (códigos) · #14 (ranking) · #17 (revisar ficha na atividade) · #6 (mobile) · #18 (revisados→atividades) · #4 (foto+apelido) · #20 (casos). _#3 (acessibilidade) fica para o usuário._
