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
--  Regras de XP (devem espelhar as do front-end em app.js / db.js):
--    • Revisar uma ficha (progress)      → +25 XP  (1x por transtorno)
--    • DOMINAR um exercício (1º acerto de um item, SEM DICA) → +15 XP (10 base + 5 bônus)
--    • Cada dia ativo na plataforma       → +15 XP  (dia com ≥1 ação)
--
--  IMPORTANTE: a tabela `events` agora também registra ERROS (acerto=false)
--  e repetições, para calcular a taxa de acerto real. O XP NÃO pode inflar
--  por isso: contamos apenas itens DOMINADOS = payloads distintos que tiveram
--  pelo menos um acerto. Errar ou repetir um item já dominado não dá XP.
-- ============================================================

-- 1) LEADERBOARD ------------------------------------------------------
--    Função SECURITY DEFINER: roda com privilégios do dono e por isso
--    enxerga as linhas de TODOS os usuários (o RLS bloquearia o anon).
--    Só expõe nome + XP + posição — nunca as linhas privadas em si.
--
--    period: 'day' | 'week' | 'month' | 'year' | 'all'
--    A janela começa no início do dia/semana/mês/ano corrente.
-- (recriada com a coluna avatar; precisa de DROP pois o tipo de retorno mudou)
drop function if exists public.leaderboard(text, int);
create or replace function public.leaderboard(period text default 'all', lim int default 100)
returns table (user_id uuid, nome text, avatar text, xp bigint, rnk bigint)
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
    -- 15 XP por ITEM DOMINADO (payload distinto com ≥1 acerto SEM DICA na janela).
    -- Erros (acerto=false), repetições e acertos COM DICA (com_dica=true) NÃO contam.
    select d.user_id as uid, count(*)::bigint * 15 as xp
    from (
      select e.user_id, e.payload
      from public.events e
      where e.criado_em >= start_ts and e.acerto is true
        and coalesce(e.com_dica, false) = false
      group by e.user_id, e.payload
    ) d
    group by d.user_id
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
         coalesce(nullif(trim(pr.apelido), ''), nullif(trim(pr.nome), ''), 'Estudante') as nome,
         pr.avatar,
         t.xp,
         rank() over (order by t.xp desc) as rnk
  from totals t
  left join public.profiles pr on pr.id = t.uid
  where t.xp > 0
    and coalesce(pr.anonimo, false) = false   -- usuários em modo anônimo saem do ranking
  order by t.xp desc, nome asc
  limit lim;
end;
$$;

-- Permite que o app (chave anon, usuário autenticado) chame a função.
grant execute on function public.leaderboard(text, int) to anon, authenticated;

-- 2) (opcional) Conferir no SQL Editor:
--    select * from public.leaderboard('week', 20);
