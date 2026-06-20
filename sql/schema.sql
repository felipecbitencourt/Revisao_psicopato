-- ============================================================
--  DSM · Revisa — esquema do banco (Supabase / Postgres)
--  Cole TUDO isto no SQL Editor do Supabase e clique em "Run".
--  É idempotente: pode rodar de novo sem erro.
-- ============================================================

-- 1) PERFIS -----------------------------------------------------------
--    1 linha por usuário; criada automaticamente no registro (trigger).
create table if not exists public.profiles (
  id        uuid primary key references auth.users(id) on delete cascade,
  nome      text,
  curso     text,
  semestre  text,
  criado_em timestamptz not null default now()
);

-- Personalização (apelido = forma de referência ao usuário; avatar = URL do
-- Storage/Google OU token de avatar predefinido, ex.: "preset:3"). Idempotente.
alter table public.profiles add column if not exists apelido text;
alter table public.profiles add column if not exists avatar  text;

-- 2) PROGRESSO --------------------------------------------------------
--    1 linha por transtorno revisado pelo usuário.
create table if not exists public.progress (
  user_id       uuid not null references auth.users(id) on delete cascade,
  transtorno_id text not null,
  status        text not null default 'revisado',
  revisado_em   timestamptz not null default now(),
  primary key (user_id, transtorno_id)
);

-- 3) EVENTOS ----------------------------------------------------------
--    Métricas: cada exercício feito vira uma linha (quiz, caso, etc.).
create table if not exists public.events (
  id        bigint generated always as identity primary key,
  user_id   uuid not null references auth.users(id) on delete cascade,
  tipo      text not null,        -- 'flashcard' | 'quiz' | 'caso' | 'ligar'
  acerto    boolean,              -- null quando não se aplica
  payload   jsonb,                -- dados extras (ex.: qual questão)
  criado_em timestamptz not null default now()
);

-- 4) ROW LEVEL SECURITY ----------------------------------------------
--    Cada usuário só enxerga/edita as próprias linhas. É isto que
--    torna seguro usar a chave "anon" no navegador.
alter table public.profiles enable row level security;
alter table public.progress enable row level security;
alter table public.events   enable row level security;

drop policy if exists "perfil proprio"    on public.profiles;
drop policy if exists "progresso proprio" on public.progress;
drop policy if exists "eventos proprios"  on public.events;

create policy "perfil proprio" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "progresso proprio" on public.progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "eventos proprios" on public.events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 5) PERFIL AUTOMÁTICO AO REGISTRAR ----------------------------------
--    Lê nome/curso/semestre que o front-end envia no signUp.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, nome, curso, semestre)
  values (
    new.id,
    -- e-mail/senha envia 'nome'; login social (Google) envia 'full_name'/'name'
    coalesce(
      new.raw_user_meta_data ->> 'nome',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    new.raw_user_meta_data ->> 'curso',
    new.raw_user_meta_data ->> 'semestre'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
