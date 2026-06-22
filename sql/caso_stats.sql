-- ============================================================
--  DSM · Revisa — Estatísticas dos Estudos de Caso (modo dev)
--  Cole no SQL Editor do Supabase e clique em "Run". Idempotente.
--
--  Requer schema.sql aplicado (tabela events com tipo/acerto/payload/com_dica).
--
--  Agrega as respostas de TODOS os usuários por caso, considerando a
--  PRIMEIRA tentativa de cada usuário em cada caso (mede "o usuário acertou
--  a questão?"). SECURITY DEFINER para enxergar as linhas de todos (o RLS
--  bloquearia o anon); expõe apenas números agregados, nunca linhas privadas.
-- ============================================================

create or replace function public.caso_stats()
returns table (
  caso       text,    -- payload do caso (ex.: "caso:panico")
  usuarios   bigint,  -- nº de usuários distintos que responderam
  acertos    bigint,  -- usuários cuja 1ª tentativa foi correta
  erros      bigint,  -- usuários cuja 1ª tentativa foi incorreta
  pct_acerto int,     -- % de acerto na 1ª tentativa
  com_dica   bigint   -- 1ªs tentativas feitas com dica ligada
)
language sql
security definer
set search_path = ''
as $$
  with first_try as (
    select distinct on (e.user_id, e.payload)
           e.payload,
           e.user_id,
           e.acerto,
           coalesce(e.com_dica, false) as com_dica
    from public.events e
    where e.tipo = 'caso' and e.acerto is not null
    order by e.user_id, e.payload, e.criado_em asc
  )
  select
    (f.payload #>> '{}')                                           as caso,
    count(*)::bigint                                               as usuarios,
    count(*) filter (where f.acerto is true)::bigint               as acertos,
    count(*) filter (where f.acerto is false)::bigint              as erros,
    coalesce(round(100.0 * count(*) filter (where f.acerto is true)
                   / nullif(count(*), 0))::int, 0)                 as pct_acerto,
    count(*) filter (where f.com_dica)::bigint                     as com_dica
  from first_try f
  group by f.payload
  order by usuarios desc, caso asc;
$$;

grant execute on function public.caso_stats() to anon, authenticated;

-- Conferir:  select * from public.caso_stats();
