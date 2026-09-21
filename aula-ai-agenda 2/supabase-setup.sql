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
