/* ==========================================================================
   Conexión a Supabase — SISTEMA DE CUENTAS PROPIO de esta Agenda,
   completamente independiente del de AulaIA.

   PASOS PARA ACTIVARLO (los explico también en el README):
   1. Crea un proyecto nuevo en https://supabase.com (uno propio para esta app,
      no el mismo que usas en AulaIA).
   2. Ve a Project Settings → API y copia "Project URL" y "anon public key".
   3. Pégalas aquí abajo, sustituyendo los dos textos de ejemplo.
   4. Ejecuta el archivo supabase-setup.sql (incluido en esta carpeta) en el
      SQL Editor de tu proyecto de Supabase.
   ========================================================================== */

const SUPABASE_URL = "https://TU-PROYECTO.supabase.co";
const SUPABASE_ANON_KEY = "TU-CLAVE-PUBLICA-ANON";

const supabaseConfigured = !SUPABASE_URL.includes("TU-PROYECTO") && !SUPABASE_ANON_KEY.includes("TU-CLAVE");

window.sb = supabaseConfigured
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

window.supabaseConfigured = supabaseConfigured;
