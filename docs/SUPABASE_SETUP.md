# Configuração do Supabase — DSM · Revisa

Passo a passo para ligar login (e-mail + senha) e o banco de dados.
Leva ~10 minutos. Enquanto não terminar, o site segue funcionando em
**modo demonstração** (sem login), então nada quebra no meio do caminho.

## 1. Criar o projeto

1. Acesse <https://supabase.com> e crie uma conta (grátis).
2. **New project** → escolha um nome, uma senha de banco (guarde) e uma região
   (ex.: *South America (São Paulo)*).
3. Aguarde ~2 min até o projeto provisionar.

## 2. Criar as tabelas

1. No menu lateral: **SQL Editor** → **New query**.
2. Abra o arquivo [`schema.sql`](../sql/schema.sql) deste projeto, copie tudo e cole.
3. Clique em **Run**. Deve aparecer "Success".

Isso cria as tabelas `profiles`, `progress`, `events`, ativa a segurança
(RLS) e o gatilho que cria o perfil automaticamente no registro.

### 2b. Gamificação (XP, níveis e ranking)

Para ligar a página de **Ranking**, rode também o arquivo
[`gamification.sql`](../sql/gamification.sql): **SQL Editor** → **New query** → cole
tudo → **Run**. Ele cria a função `leaderboard(period, lim)` que calcula o XP
de cada usuário (a partir de `progress` e `events`, sem armazenar nada) e
devolve o ranking por período (diário/semanal/mensal/anual). Também é
idempotente — pode rodar quantas vezes quiser.

### 2c. Feedback

Para ligar a aba **Feedback** (usuários relatam erros nas fichas e sugestões),
rode o arquivo [`feedback.sql`](../sql/feedback.sql) do mesmo jeito (SQL Editor → cole →
Run). Ele cria a tabela `feedback` com RLS: logados gravam o próprio feedback e
visitantes gravam de forma anônima. Você lê tudo em **Table Editor → feedback**
(ou `select * from public.feedback order by criado_em desc;`).

## 3. Pegar as chaves

1. Menu lateral: **Project Settings** (engrenagem) → **API**.
2. Copie dois valores:
   - **Project URL** → ex.: `https://abcdxyz.supabase.co`
   - Chave **anon public**
3. Cole em [`supabase-config.js`](../supabase-config.js):

   ```js
   window.SUPABASE_CONFIG = {
     url: 'https://abcdxyz.supabase.co',
     anonKey: 'eyJhbGci...'   // a chave "anon public"
   };
   ```

> A chave **anon** pode ficar no navegador — quem protege os dados é o RLS.
> **Nunca** use a chave `service_role` aqui.

## 4. (Para testar rápido) desligar confirmação de e-mail

Por padrão o Supabase exige confirmar o e-mail antes do 1º login. Para testar
sem isso:

- **Authentication** → **Providers** (ou **Sign In / Providers**) → **Email**
  → desmarque **Confirm email** → **Save**.

Em produção, deixe a confirmação ligada.

## 5. Rodar

Recarregue `http://localhost:8000`. Agora deve aparecer a tela de **login**.
Crie uma conta em "Criar conta" e pronto — seu nome aparece na barra lateral.

---

### O que já funciona após este setup
- Registro e login com e-mail + senha
- Perfil (nome, curso, semestre) salvo e exibido na barra lateral
- Logout

### Próximo passo (fase B)
Ligar o progresso real (marcar transtorno como revisado) e as métricas do
painel (exercícios feitos, % de acerto, streak) às tabelas `progress` e
`events`. As tabelas já estão prontas para isso.
