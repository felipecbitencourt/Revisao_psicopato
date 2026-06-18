-- ============================================================
--  DSM · Revisa — Gamificação (XP, níveis, ranking)
--  Cole TUDO isto no SQL Editor do Supabase e clique em "Run".
--  É idempotente: pode rodar de novo sem erro.
--
--  Requer o schema.sql já aplicado (tabelas profiles/progress/events).
--
--  O XP NÃO é armazenado: é derivado das tabelas que já existem,
--  para que histórico antigo já conte e nada precise de migração.
--
--  Regras de XP (devem espelhar as do front-end em app.js):
--    • Revisar uma ficha (progress)      → +25 XP  (1x por transtorno)
--    • Fazer um exercício (events)        → +10 XP
--    • Acertar o exercício (events.acerto)→  +5 XP de bônus
--    • Cada dia ativo na plataforma       → +15 XP  (dia com ≥1 ação)
-- ============================================================

-- 1) LEADERBOARD ------------------------------------------------------
--    Função SECURITY DEFINER: roda com privilégios do dono e por isso
--    enxerga as linhas de TODOS os usuários (o RLS bloquearia o anon).
--    Só expõe nome + XP + posição — nunca as linhas privadas em si.
--
--    period: 'day' | 'week' | 'month' | 'year' | 'all'
--    A janela começa no início do dia/semana/mês/ano corrente.
create or replace function public.leaderboard(period text default 'all', lim int default 100)
returns table (user_id uuid, nome text, xp bigint, rnk bigint)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
  start_ts timestamptz;
begin
  start_ts := case period
    when 'day'   then date_trunc('day',   now())
    when 'week'  then date_trunc('week',  now())
    when 'month' then date_trunc('month', now())
    when 'year'  then date_trunc('year',  now())
    else '-infinity'::timestamptz
  end;

  return query
  with prog as (
    select p.user_id as uid, count(*)::bigint * 25 as xp
    from public.progress p
    where p.revisado_em >= start_ts
    group by p.user_id
  ),
  ev as (
    select e.user_id as uid,
           sum(10 + case when e.acerto is true then 5 else 0 end)::bigint as xp
    from public.events e
    where e.criado_em >= start_ts
    group by e.user_id
  ),
  days as (
    select z.uid, count(*)::bigint * 15 as xp
    from (
      select e.user_id as uid, date_trunc('day', e.criado_em) as d
      from public.events e   where e.criado_em  >= start_ts
      union
      select p.user_id as uid, date_trunc('day', p.revisado_em) as d
      from public.progress p where p.revisado_em >= start_ts
    ) z
    group by z.uid
  ),
  totals as (
    select u.uid, sum(u.xp)::bigint as xp
    from (
      select uid, xp from prog
      union all select uid, xp from ev
      union all select uid, xp from days
    ) u
    group by u.uid
  )
  select t.uid,
         coalesce(nullif(trim(pr.nome), ''), 'Estudante') as nome,
         t.xp,
         rank() over (order by t.xp desc) as rnk
  from totals t
  left join public.profiles pr on pr.id = t.uid
  where t.xp > 0
  order by t.xp desc, nome asc
  limit lim;
end;
$$;

-- Permite que o app (chave anon, usuário autenticado) chame a função.
grant execute on function public.leaderboard(text, int) to anon, authenticated;

-- 2) (opcional) Conferir no SQL Editor:
--    select * from public.leaderboard('week', 20);
