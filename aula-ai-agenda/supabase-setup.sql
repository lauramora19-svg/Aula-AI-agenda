-- Ejecuta esto en tu proyecto de Supabase: SQL Editor → New query → pega y "Run"
-- Crea la tabla donde se guardan los datos de cada docente que se registre
-- en la Agenda, y la protege para que cada uno solo vea los suyos.

create table if not exists agenda_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table agenda_data enable row level security;

create policy "Cada usuario lee solo sus datos"
  on agenda_data
  for select
  using (auth.uid() = user_id);

create policy "Cada usuario inserta solo sus datos"
  on agenda_data
  for insert
  with check (auth.uid() = user_id);

create policy "Cada usuario actualiza solo sus datos"
  on agenda_data
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Almacén de documentos (autorizaciones en PDF/foto) para "Listado del Grupo".
-- Cada usuario solo puede ver/subir/borrar sus propios archivos.
insert into storage.buckets (id, name, public)
values ('documentos-alumnado', 'documentos-alumnado', false)
on conflict (id) do nothing;

create policy "Cada usuario ve solo sus documentos"
  on storage.objects for select
  using (bucket_id = 'documentos-alumnado' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Cada usuario sube solo a su propia carpeta"
  on storage.objects for insert
  with check (bucket_id = 'documentos-alumnado' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Cada usuario borra solo sus documentos"
  on storage.objects for delete
  using (bucket_id = 'documentos-alumnado' and (storage.foldername(name))[1] = auth.uid()::text);
