# AulaAI — Agenda Docente, con cuentas propias (registro/login)

Cada docente que entre tiene que registrarse con correo y contraseña, y ve
solo su propio horario, alumnado y programación — separado del resto. Este
sistema de cuentas es propio de esta Agenda, independiente de AulaIA.

## 1. Crear tu proyecto de Supabase (gratuito)

1. Ve a [supabase.com](https://supabase.com) → "New project". Crea uno
   **nuevo, solo para esta Agenda** (no reutilices el de AulaIA).
2. Cuando esté listo, ve a **SQL Editor** → "New query", pega el contenido
   del archivo `supabase-setup.sql` (incluido en esta carpeta) y pulsa "Run".
   Esto crea la tabla donde se guardan los datos de cada docente, protegida
   para que cada uno solo vea los suyos.
3. Ve a **Project Settings → API** y copia:
   - "Project URL"
   - "anon public" key

## 2. Pegar esas claves en el código

Abre el archivo `js/supabaseClient.js` con cualquier editor de texto (o
directamente en GitHub, con el lápiz de editar) y sustituye estas dos líneas:

```js
const SUPABASE_URL = "https://TU-PROYECTO.supabase.co";
const SUPABASE_ANON_KEY = "TU-CLAVE-PUBLICA-ANON";
```

por tus valores reales. Guarda el archivo.

## 3. Subir los cambios (mismo proceso de siempre)

1. Ve a github.com/lauramora19-svg/Aula-AI-agenda (la raíz, sin entrar en
   ninguna carpeta).
2. Borra la carpeta `aula-ai-agenda` actual ("..." → "Delete directory") y
   confirma.
3. Vuelve a la raíz, "Add file" → "Upload files", arrastra la carpeta nueva
   (ya con las claves de Supabase puestas), "Commit changes".
4. Espera 1-2 minutos y abre tu URL de Vercel.

## 4. Primer acceso

La primera vez, pulsa "¿No tienes cuenta? Crear una", regístrate con tu
correo y contraseña. Tu marido (o cualquier otro docente) hace lo mismo con
su propio correo — cada uno verá únicamente su propio horario y alumnado.

> Nota: por defecto Supabase puede pedir confirmar el correo antes de dejar
> entrar. Si quieres desactivar esa confirmación (para no complicarte, ya
> que es de uso personal/familiar), ve a Authentication → Providers → Email
> en Supabase y desactiva "Confirm email".

## Estructura relevante para esto

```
supabase-setup.sql       ← SQL para crear la tabla en Supabase
js/supabaseClient.js      ← aquí pegas tu URL y tu clave
js/authGate.js            ← pantalla de acceso (registro/login)
js/store.js               ← ahora guarda/lee de Supabase, no del navegador
```
