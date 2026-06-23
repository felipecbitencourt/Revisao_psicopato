-- ============================================================
--  Psico · Pato — Painel do editor: atividades + métricas de uso
--  Cole no SQL Editor do Supabase e rode. Idempotente.
--  Requer schema.sql e feedback.sql (usa a função is_admin()).
-- ============================================================

-- 1) LOG LEVE DE SESSÃO ----------------------------------------------
--    1 linha por "abertura" do app (o front limita a ~1x/30min).
--    Tabela própria p/ NÃO interferir em XP / taxa de acerto (events).
create table if not exists public.app_sessions (
  id        bigint generated always as identity primary key,
  user_id   uuid not null references auth.users(id) on delete cascade,
  criado_em timestamptz not null default now()
);
create index if not exists app_sessions_data_idx on public.app_sessions (criado_em);

alter table public.app_sessions enable row level security;
drop policy if exists "sessao insere propria" on public.app_sessions;
create policy "sessao insere propria" on public.app_sessions
  for insert with check (auth.uid() = user_id);
grant insert on public.app_sessions to authenticated;

-- 2) ÍNDICE DE ACERTO POR ATIVIDADE (admin) --------------------------
--    Agrega a tabela events por TIPO (quiz | caso | flashcard | ligar).
create or replace function public.activity_stats()
returns table (tipo text, usuarios bigint, tentativas bigint, acertos bigint,
               erros bigint, com_dica bigint, pct numeric)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  return query
  select e.tipo,
         count(distinct e.user_id)::bigint,
         count(*) filter (where e.acerto is not null)::bigint,
         count(*) filter (where e.acerto is true)::bigint,
         count(*) filter (where e.acerto is false)::bigint,
         count(*) filter (where coalesce(e.com_dica, false))::bigint,
         round(100.0 * count(*) filter (where e.acerto is true)
               / nullif(count(*) filter (where e.acerto is not null), 0), 1)
  from public.events e
  where e.tipo <> 'sessao'
  group by e.tipo
  order by 3 desc;   -- mais tentativas primeiro
end;
$$;
grant execute on function public.activity_stats() to authenticated;

-- 3) MÉTRICAS DE USO (admin) -----------------------------------------
create or replace function public.usage_stats()
returns table (
  total_usuarios   bigint,
  novos_7d         bigint, novos_30d bigint,
  ativos_hoje      bigint, ativos_7d bigint, ativos_30d bigint,
  sessoes_total    bigint, sessoes_7d bigint,
  exercicios_total bigint, revisoes_total bigint
)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  return query
  with act as (
    select user_id, criado_em from public.app_sessions
    union all
    select user_id, criado_em from public.events where tipo <> 'sessao'
    union all
    select user_id, revisado_em as criado_em from public.progress
  )
  select
    (select count(*) from public.profiles)::bigint,
    (select count(*) from public.profiles where criado_em >= now() - interval '7 days')::bigint,
    (select count(*) from public.profiles where criado_em >= now() - interval '30 days')::bigint,
    (select count(distinct user_id) from act where criado_em >= date_trunc('day', now()))::bigint,
    (select count(distinct user_id) from act where criado_em >= now() - interval '7 days')::bigint,
    (select count(distinct user_id) from act where criado_em >= now() - interval '30 days')::bigint,
    (select count(*) from public.app_sessions)::bigint,
    (select count(*) from public.app_sessions where criado_em >= now() - interval '7 days')::bigint,
    (select count(*) from public.events where tipo <> 'sessao')::bigint,
    (select count(*) from public.progress)::bigint;
end;
$$;
grant execute on function public.usage_stats() to authenticated;
