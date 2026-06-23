# Deploy — Psico·Pato

Checklist para colocar (ou atualizar) a plataforma em produção. É um site
**estático** + **Supabase**. Detalhes do banco em [SUPABASE_SETUP.md](SUPABASE_SETUP.md).

## 1. Configuração (`supabase-config.js`)
- `url` e `anonKey` do projeto Supabase (Project Settings → API).
- `vapidPublicKey` (chave pública VAPID) — só se for usar notificações push.

## 2. Banco — rodar os SQL no SQL Editor (nesta ordem)
Todos idempotentes. Re-rode quando o arquivo mudar (vários têm `drop function`).
1. `sql/schema.sql` — perfis/progresso/eventos + RLS + trigger + consentimento (`accept_terms`).
2. `sql/gamification.sql` — `leaderboard()`.
3. `sql/feedback.sql` — feedback + `is_admin()` (**ajuste o e-mail do dono** no topo).
4. `sql/friends.sql` — código + amigos + `leaderboard_friends()`.
5. `sql/push.sql` — inscrições de push.
6. `sql/storage-avatars.sql` — **bucket `avatars` público** + policies (fotos de perfil).
7. `sql/admin_stats.sql` — log de sessão + `activity_stats`/`usage_stats`.
8. `sql/caso_stats.sql` — % de acerto por estudo de caso (painel dev).

## 3. Edge Functions (opcionais, mas recomendadas)
`supabase functions deploy <nome>` (ou criar pelo painel e colar o código).
- `notify-follow` — push de "novo seguidor". **Slug atual em produção: `swift-action`**
  (o `db.js` chama esse slug). Se recriar, alinhe `db.js`.
- `delete-account` — exclusão de conta (LGPD). `db.js` chama `'delete-account'`.

Secrets de push (se usar): `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`.

## 4. Autenticação (painel Supabase → Authentication)
- **E-mail:** ou desligar **Confirm email** (cadastro entra direto), ou configurar
  **SMTP próprio** para escala (Resend) — ver SUPABASE_SETUP §6. *(Sem SMTP, o
  e-mail embutido tem rate limit baixo e trava no lançamento.)*
- **Redirect URLs:** inclua a URL de produção (necessário para Google e reset de senha).
- **Login Google** (opcional): provider habilitado + OAuth client no Google Cloud.

## 5. Documentos LGPD
- `termos.html` e `privacidade.html` já estão prontos (data 23/06/2026).
  Opcional: identificar o controlador na Política (hoje só há o e-mail de contato).

## 6. Hospedagem
Qualquer host estático servindo a **raiz** do repositório (Cloudflare Pages,
Netlify, Vercel static, GitHub Pages, etc.). Requisitos:
- **HTTPS** (obrigatório para PWA e push; `localhost` é exceção).
- Servir `index.html`, `*.js`, `*.css`, `content.js`, `DSM-5-TR.pdf`, `assets/`,
  `termos.html`, `privacidade.html`, `manifest.json`, `service-worker.js`, ícones.
- Não precisa de build no front. (O `content.js` já vem gerado; só rode o
  pipeline Python se for reconstruir o conteúdo.)

## 7. Verificação pós-deploy
- [ ] Cadastro por e-mail funciona (sem travar no rate limit).
- [ ] Login + perfil + progresso salvam.
- [ ] Ranking (Geral e Amigos) carrega e mostra fotos.
- [ ] Foto de perfil aparece para outros usuários (bucket público).
- [ ] Busca avançada retorna resultados coerentes.
- [ ] Portão de consentimento aparece para conta sem `termos_versao`.
- [ ] "Excluir minha conta" funciona (Edge Function publicada).
- [ ] (Se push) ativar notificações no perfil → seguir de outra conta → chega.
- [ ] Modo dev (Ctrl+D, logado como admin): Atividades / Uso / Feedbacks carregam.
