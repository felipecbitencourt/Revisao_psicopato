-- ============================================================
--  Psico · Pato — Notificações push (Web Push / VAPID)
--  Cole TUDO isto no SQL Editor do Supabase e clique em "Run".
--  É idempotente. Requer schema.sql (auth.users/profiles).
--
--  Guarda as INSCRIÇÕES de push de cada dispositivo. O envio em si é
--  feito pela Edge Function "notify-follow" (que usa a service role e
--  por isso lê as inscrições de qualquer usuário). Veja docs/PUSH_SETUP.md.
-- ============================================================

create table if not exists public.push_subscriptions (
  user_id    uuid not null references auth.users(id) on delete cascade,
  endpoint   text not null,
  p256dh     text not null,        -- chave pública do cliente (base64url)
  auth       text not null,        -- segredo de autenticação (base64url)
  user_agent text,
  criado_em  timestamptz not null default now(),
  primary key (user_id, endpoint)
);

-- um mesmo endpoint pertence a um único usuário (permite upsert por endpoint)
create unique index if not exists push_subscriptions_endpoint_key
  on public.push_subscriptions (endpoint);

alter table public.push_subscriptions enable row level security;

-- cada usuário gerencia só as próprias inscrições.
drop policy if exists "push proprio" on public.push_subscriptions;
create policy "push proprio" on public.push_subscriptions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

grant select, insert, update, delete on public.push_subscriptions to authenticated;

-- Conferir:
--   select user_id, left(endpoint, 40) as endpoint, criado_em
--   from public.push_subscriptions order by criado_em desc;
