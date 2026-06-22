-- ============================================================
--  Psico · Pato — Código de usuário + Amigos (follow)
--  Cole TUDO isto no SQL Editor do Supabase e clique em "Run".
--  É idempotente: pode rodar de novo sem erro.
--
--  Requer schema.sql (profiles/progress/events) e, para o XP,
--  as mesmas regras de gamification.sql.
--
--  Modelo: SEGUIR (um lado só). "Amigo" = quem você segue.
--  Quando os dois se seguem → relação "mutual" (amigos de verdade);
--  é isso que libera o perfil de quem está em modo anônimo.
--
--  Privacidade do perfil:
--    • usuário NÃO anônimo  → visível para qualquer logado;
--    • usuário anônimo      → visível só para amigos mútuos (e ele mesmo).
-- ============================================================

-- 1) CÓDIGO DE IDENTIFICAÇÃO -----------------------------------------
--    Código curto, único e humano (ex.: "K7F3QR"). O front-end mostra
--    em dois grupos ("K7F-3QR") só para leitura; aqui guardamos sem hífen.
alter table public.profiles add column if not exists codigo text;
create unique index if not exists profiles_codigo_key on public.profiles (codigo);

-- gera um código aleatório livre de caracteres ambíguos (sem 0/O/1/I)
create or replace function public.gen_user_code()
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  alpha text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  c text;
  i int;
  taken boolean;
begin
  loop
    c := '';
    for i in 1..6 loop
      c := c || substr(alpha, 1 + floor(random() * length(alpha))::int, 1);
    end loop;
    select exists(select 1 from public.profiles where codigo = c) into taken;
    if not taken then
      return c;
    end if;
  end loop;
end;
$$;

-- atribui o código automaticamente ao criar o perfil (BEFORE INSERT).
-- roda junto com o handle_new_user do schema.sql, sem depender dele.
create or replace function public.set_user_code()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.codigo is null then
    new.codigo := public.gen_user_code();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_set_user_code on public.profiles;
create trigger trg_set_user_code
  before insert on public.profiles
  for each row execute function public.set_user_code();

-- backfill: dá um código a quem já existe sem código.
do $$
declare r record;
begin
  for r in select id from public.profiles where codigo is null loop
    update public.profiles set codigo = public.gen_user_code() where id = r.id;
  end loop;
end $$;

-- 2) FOLLOWS ----------------------------------------------------------
--    1 linha = "follower segue following".
create table if not exists public.follows (
  follower  uuid not null references auth.users(id) on delete cascade,
  following uuid not null references auth.users(id) on delete cascade,
  criado_em timestamptz not null default now(),
  primary key (follower, following),
  check (follower <> following)
);

alter table public.follows enable row level security;

drop policy if exists "follows leitura"  on public.follows;
drop policy if exists "follows insere"   on public.follows;
drop policy if exists "follows remove"   on public.follows;

-- vê as linhas em que participa; só cria/apaga as próprias (follower = você).
create policy "follows leitura" on public.follows
  for select using (auth.uid() = follower or auth.uid() = following);
create policy "follows insere" on public.follows
  for insert with check (auth.uid() = follower);
create policy "follows remove" on public.follows
  for delete using (auth.uid() = follower);

-- 3) HELPERS (security definer — enxergam todas as linhas) ------------

-- A e B se seguem mutuamente?
create or replace function public.is_mutual(a uuid, b uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists(select 1 from public.follows where follower = a and following = b)
     and exists(select 1 from public.follows where follower = b and following = a);
$$;

-- relação do viewer com o alvo: self|mutual|following|follower|none
create or replace function public.rel_to(p_viewer uuid, p_target uuid)
returns text
language sql stable security definer set search_path = ''
as $$
  select case
    when p_viewer = p_target then 'self'
    when exists(select 1 from public.follows where follower = p_viewer and following = p_target)
     and exists(select 1 from public.follows where follower = p_target and following = p_viewer) then 'mutual'
    when exists(select 1 from public.follows where follower = p_viewer and following = p_target) then 'following'
    when exists(select 1 from public.follows where follower = p_target and following = p_viewer) then 'follower'
    else 'none'
  end;
$$;

-- pode ver o perfil completo?
create or replace function public.can_view_profile(p_viewer uuid, p_target uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select case
    when p_viewer = p_target then true
    when not coalesce((select anonimo from public.profiles where id = p_target), false) then true
    else public.is_mutual(p_viewer, p_target)
  end;
$$;

-- XP total (all-time) de um usuário — espelha a leaderboard('all').
create or replace function public.user_total_xp(p_uid uuid)
returns bigint
language sql stable security definer set search_path = ''
as $$
  with prog as (
    select count(*)::bigint * 25 as xp from public.progress where user_id = p_uid
  ),
  ev as (
    select count(*)::bigint * 15 as xp from (
      select payload from public.events
      where user_id = p_uid and acerto is true and coalesce(com_dica, false) = false
      group by payload
    ) d
  ),
  days as (
    select count(*)::bigint * 15 as xp from (
      select date_trunc('day', criado_em)   as d from public.events   where user_id = p_uid
      union
      select date_trunc('day', revisado_em) as d from public.progress where user_id = p_uid
    ) z
  )
  select coalesce((select xp from prog), 0)
       + coalesce((select xp from ev),   0)
       + coalesce((select xp from days), 0);
$$;

-- 4) RPCs PÚBLICAS (chamadas pelo app) -------------------------------

-- procura usuário pelo código (normaliza: tira não-alfanuméricos, maiúsculas).
create or replace function public.find_by_code(p_code text)
returns table(user_id uuid, nome text, avatar text, instituicao text, relationship text)
language plpgsql stable security definer set search_path = ''
as $$
declare me uuid := auth.uid(); norm text;
begin
  if me is null then raise exception 'auth required'; end if;
  norm := upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g'));
  if length(norm) < 4 then return; end if;
  return query
  select pr.id,
         coalesce(nullif(trim(pr.apelido), ''), nullif(trim(pr.nome), ''), 'Estudante'),
         pr.avatar, pr.instituicao,
         public.rel_to(me, pr.id)
  from public.profiles pr
  where pr.codigo = norm and pr.id <> me
  limit 1;
end;
$$;

-- segue alguém (idempotente). devolve a nova relação.
create or replace function public.follow_add(p_target uuid)
returns text
language plpgsql security definer set search_path = ''
as $$
declare me uuid := auth.uid();
begin
  if me is null then raise exception 'auth required'; end if;
  if me = p_target then return 'self'; end if;
  if not exists(select 1 from public.profiles where id = p_target) then return 'notfound'; end if;
  insert into public.follows(follower, following) values (me, p_target)
    on conflict do nothing;
  return public.rel_to(me, p_target);
end;
$$;

-- deixa de seguir. devolve a nova relação.
create or replace function public.follow_remove(p_target uuid)
returns text
language plpgsql security definer set search_path = ''
as $$
declare me uuid := auth.uid();
begin
  if me is null then raise exception 'auth required'; end if;
  delete from public.follows where follower = me and following = p_target;
  return public.rel_to(me, p_target);
end;
$$;

-- lista 'following' (quem eu sigo) ou 'followers' (quem me segue).
create or replace function public.follow_list(p_kind text default 'following')
returns table(user_id uuid, nome text, avatar text, instituicao text, xp bigint, relationship text)
language plpgsql stable security definer set search_path = ''
as $$
declare me uuid := auth.uid();
begin
  if me is null then raise exception 'auth required'; end if;
  return query
  select pr.id,
         coalesce(nullif(trim(pr.apelido), ''), nullif(trim(pr.nome), ''), 'Estudante'),
         pr.avatar, pr.instituicao,
         public.user_total_xp(pr.id),
         public.rel_to(me, pr.id)
  from public.follows f
  join public.profiles pr
    on pr.id = (case when p_kind = 'followers' then f.follower else f.following end)
  where (case when p_kind = 'followers' then f.following else f.follower end) = me
  order by 2 asc;
end;
$$;

-- cartão de perfil de um usuário (respeita a privacidade).
create or replace function public.profile_card(p_target uuid)
returns table(
  user_id uuid, nome text, avatar text, instituicao text,
  curso text, semestre text, criado_em timestamptz,
  xp bigint, revisados bigint, dominados bigint,
  seguindo bigint, seguidores bigint,
  relationship text, visivel boolean
)
language plpgsql stable security definer set search_path = ''
as $$
declare me uuid := auth.uid(); vis boolean;
begin
  if me is null then raise exception 'auth required'; end if;
  vis := public.can_view_profile(me, p_target);
  return query
  select pr.id,
         coalesce(nullif(trim(pr.apelido), ''), nullif(trim(pr.nome), ''), 'Estudante'),
         pr.avatar, pr.instituicao,
         case when vis then pr.curso    else null end,
         case when vis then pr.semestre else null end,
         pr.criado_em,
         case when vis then public.user_total_xp(pr.id) else 0::bigint end,
         case when vis then (select count(*) from public.progress where user_id = pr.id) else 0::bigint end,
         case when vis then (select count(*) from (
                select payload from public.events
                where user_id = pr.id and acerto is true and coalesce(com_dica, false) = false
                group by payload) d) else 0::bigint end,
         (select count(*) from public.follows where follower  = pr.id),
         (select count(*) from public.follows where following = pr.id),
         public.rel_to(me, pr.id),
         vis
  from public.profiles pr
  where pr.id = p_target
  limit 1;
end;
$$;

-- 5) PERMISSÕES -------------------------------------------------------
grant execute on function public.find_by_code(text)   to authenticated;
grant execute on function public.follow_add(uuid)      to authenticated;
grant execute on function public.follow_remove(uuid)   to authenticated;
grant execute on function public.follow_list(text)     to authenticated;
grant execute on function public.profile_card(uuid)    to authenticated;

-- 6) (opcional) conferir:
--    select codigo from public.profiles where id = auth.uid();
--    select * from public.follow_list('following');
