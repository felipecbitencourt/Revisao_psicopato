-- ============================================================
--  Psico · Pato — Storage de avatares (upload de foto de perfil)
--  Cole TUDO isto no SQL Editor do Supabase e clique em "Run".
--  É idempotente. Requer o schema.sql já aplicado.
--
--  Cria o bucket público "avatars" e as policies para que cada
--  usuário gerencie APENAS os arquivos da sua própria pasta
--  (caminho = "<user_id>/arquivo"). Leitura é pública (o app
--  exibe a foto via URL pública).
-- ============================================================

-- 1) Bucket público "avatars"
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

-- 2) Policies em storage.objects (recriáveis)
drop policy if exists "avatars leitura publica" on storage.objects;
create policy "avatars leitura publica" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "avatars upload proprio" on storage.objects;
create policy "avatars upload proprio" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars update proprio" on storage.objects;
create policy "avatars update proprio" on storage.objects
  for update to authenticated using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars delete proprio" on storage.objects;
create policy "avatars delete proprio" on storage.objects
  for delete to authenticated using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );
