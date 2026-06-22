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

-- ============================================================
--  ADMIN — ler os feedbacks DENTRO do app (modo dev)
--  O "modo dev" do app é só um flag de cliente; quem realmente
--  autoriza a leitura é esta função, liberada só para o seu e-mail.
--  >>> Troque o e-mail abaixo se mudar de conta de dono. <<<
-- ============================================================
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists(
    select 1 from auth.users
    where id = auth.uid()
      and lower(email) = lower('felipe.cb2511@gmail.com')
  );
$$;

-- lista todos os feedbacks (só admin). Junta o nome do autor (ou "Visitante").
create or replace function public.feedback_list(lim int default 300)
returns table(
  id bigint, user_id uuid, autor text, tipo text, transtorno_id text,
  mensagem text, contexto jsonb, criado_em timestamptz
)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;
  return query
  select f.id, f.user_id,
         coalesce(nullif(trim(pr.apelido), ''), nullif(trim(pr.nome), ''),
                  case when f.user_id is null then 'Visitante' else 'Usuário' end) as autor,
         f.tipo, f.transtorno_id, f.mensagem, f.contexto, f.criado_em
  from public.feedback f
  left join public.profiles pr on pr.id = f.user_id
  order by f.criado_em desc
  limit lim;
end;
$$;

-- apagar um feedback (só admin) — útil para limpar spam.
create or replace function public.feedback_delete(p_id bigint)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;
  delete from public.feedback where id = p_id;
end;
$$;

grant execute on function public.feedback_list(int)    to authenticated;
grant execute on function public.feedback_delete(bigint) to authenticated;
