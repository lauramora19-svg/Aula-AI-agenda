-- Ejecuta esto en tu proyecto de Supabase: SQL Editor → New query → pega y "Run"
-- Esto es ADICIONAL al supabase-setup.sql que ya ejecutaste — crea el
-- "almacén" donde se guardan las autorizaciones en PDF/foto que subas desde
-- "Listado del Grupo → Documentos", y lo protege para que cada usuario solo
-- pueda ver, subir o borrar sus propios archivos.

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
