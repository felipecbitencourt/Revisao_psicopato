# Notificações push (Web Push) — DSM · Psico·Pato

Envia um aviso **“Novo seguidor”** para o aparelho da pessoa **mesmo com o app
fechado** — desde que ela tenha **ativado as notificações** no perfil.

Peças (todas já estão no repo):

| Peça | Arquivo |
|------|---------|
| Tabela de inscrições + RLS | [`sql/push.sql`](../sql/push.sql) |
| Handlers `push`/`notificationclick` | [`service-worker.js`](../service-worker.js) |
| Quem envia o push | [`supabase/functions/notify-follow/index.ts`](../supabase/functions/notify-follow/index.ts) |
| Cliente (inscrever / disparar) | `db.js`, `app.js` (módulo `Push`) |
| Chave pública VAPID | `supabase-config.js` (`vapidPublicKey`) |

O cliente que **segue** chama a Edge Function logo após seguir; ela lê as
inscrições do **seguido** (com a *service role*) e dispara o Web Push.

---

## Passo a passo

### 1. Tabela
No **SQL Editor** do Supabase, cole e rode [`sql/push.sql`](../sql/push.sql).

### 2. Gerar as chaves VAPID
Num terminal (precisa de Node):

```bash
npx web-push generate-vapid-keys
```

Ele imprime uma **Public Key** e uma **Private Key**.

### 3. Chave pública → no app
Em [`supabase-config.js`](../supabase-config.js), cole a **pública** em
`vapidPublicKey`:

```js
window.SUPABASE_CONFIG = {
  url: '...', anonKey: '...',
  vapidPublicKey: 'BK...sua_chave_publica'
};
```

> A chave **privada NUNCA** vai para o site — só nos secrets do Supabase (abaixo).

Há dois caminhos para os passos 4–6. **O caminho A (painel) não exige instalar
nada** e é o recomendado no Windows.

---

#### Caminho A — pelo painel do Supabase (sem CLI)

**4A. Criar a função**
- Painel → menu lateral **Edge Functions** → **Create a function** (ou *Deploy a
  new function* → *Via editor*).
- **Nome** exatamente: `notify-follow`.
- Apague o código de exemplo e **cole todo o conteúdo** de
  [`supabase/functions/notify-follow/index.ts`](../supabase/functions/notify-follow/index.ts).
- Deixe **Verify JWT = ON** (é o que queremos) e clique **Deploy**.

**5A. Secrets**
- Edge Functions → seção/aba **Secrets** (ou **Project Settings → Edge Functions
  → Secrets**) → **Add new secret**, e crie três:
  - `VAPID_PUBLIC_KEY` = sua chave pública
  - `VAPID_PRIVATE_KEY` = sua chave privada
  - `VAPID_SUBJECT` = `mailto:felipe.cb2511@gmail.com`
- (`SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` já existem
  sozinhos — não precisa criar.)

Pronto — pule para o passo 7 (testar).

---

#### Caminho B — pela CLI (terminal), sem instalar global

> `npm i -g supabase` **não é suportado**. Use `npx supabase@latest` (não instala
> nada permanente) ou instale via Scoop (`scoop install supabase`).

No **PowerShell** (Windows), dentro da pasta do projeto:

```powershell
# login (abre o navegador)
npx supabase@latest login

# secrets (uma linha só; o --project-ref evita ter que "linkar")
npx supabase@latest secrets set VAPID_PUBLIC_KEY="<a pública>" VAPID_PRIVATE_KEY="<a privada>" VAPID_SUBJECT="mailto:felipe.cb2511@gmail.com" --project-ref hweszuthgoespqhlzgrw

# deploy da função
npx supabase@latest functions deploy notify-follow --project-ref hweszuthgoespqhlzgrw
```

### 7. Testar
1. Recarregue o app, vá em **Perfil → Notificações no dispositivo → Ativar**
   (aceite a permissão do navegador).
2. Em **outra conta**, abra seu perfil e clique **Seguir**.
3. Deve chegar a notificação **“Novo seguidor”** no seu aparelho.

---

## Observações

- **iOS/iPhone**: Web Push só funciona com o app **instalado na tela inicial**
  (Adicionar à Tela de Início) e **iOS 16.4+**. No navegador comum do iPhone não
  chega. No Android e no desktop funciona no navegador também.
- **HTTPS**: push exige HTTPS (ou `localhost`). No `localhost:8000` dá para
  inscrever e testar; em produção, sirva por HTTPS.
- **Inscrições mortas**: se um endpoint expira, o servidor responde 404/410 e a
  função **apaga** a inscrição automaticamente.
- **Sem configurar**: enquanto `vapidPublicKey` estiver vazio, o app
  simplesmente **não mostra** a opção de notificações — nada quebra.
- **Privacidade**: a notificação mostra só “Fulano começou a seguir você”.
