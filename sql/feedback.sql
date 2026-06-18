-- ============================================================
--  DSM · Revisa — Feedback dos usuários
--  Cole TUDO isto no SQL Editor do Supabase e clique em "Run".
--  É idempotente: pode rodar de novo sem erro.
--  Requer o schema.sql já aplicado.
--
--  Onde LER os feedbacks: painel do Supabase → Table Editor → feedback
--  (ou SQL: select * from public.feedback order by criado_em desc;)
-- ============================================================

create table if not exists public.feedback (
  id            bigint generated always as identity primary key,
  user_id       uuid references auth.users(id) on delete set null, -- nulo = visitante anônimo
  tipo          text not null default 'erro',   -- 'erro' | 'sugestao' | 'duvida' | 'outro'
  transtorno_id text,                            -- qual ficha (opcional)
  mensagem      text not null,
  contexto      jsonb,                           -- {ficha, guest, ...}
  criado_em     timestamptz not null default now()
);

alter table public.feedback enable row level security;

-- INSERIR: usuário logado insere o próprio; visitante insere com user_id nulo.
drop policy if exists "feedback insert" on public.feedback;
create policy "feedback insert" on public.feedback
  for insert
  with check (user_id = auth.uid() or user_id is null);

-- LER: cada usuário vê só o próprio feedback (você, dono, lê tudo pelo painel).
drop policy if exists "feedback select proprio" on public.feedback;
create policy "feedback select proprio" on public.feedback
  for select
  using (auth.uid() = user_id);

-- Garante que as chaves anon/authenticated podem inserir (RLS continua protegendo).
grant insert on public.feedback to anon, authenticated;
grant select on public.feedback to authenticated;

-- Consulta rápida para você acompanhar:
--   select criado_em, tipo, transtorno_id, mensagem, contexto
--   from public.feedback order by criado_em desc;
