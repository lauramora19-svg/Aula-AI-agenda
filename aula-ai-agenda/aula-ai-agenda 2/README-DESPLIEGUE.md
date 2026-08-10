# AulaAI — Publicar con URL propia (Vercel)

Esta app no necesita build ni configuración: es HTML/CSS/JS puro. Vercel la
sirve tal cual, en un par de minutos.

## 1. Súbela a GitHub

1. Crea un repositorio nuevo en [github.com](https://github.com) (puede ser
   privado).
2. Sube el contenido de esta carpeta (`index.html`, `css/`, `js/`) a ese
   repositorio — puedes arrastrar los archivos directamente desde la web de
   GitHub si no usas git por terminal, o usar GitHub Desktop.

## 2. Despliega en Vercel (igual que AulaIA)

1. Entra en [vercel.com](https://vercel.com) → "Add New Project".
2. Importa ese repositorio.
3. Vercel detectará que es un proyecto estático — **no cambies nada** en la
   configuración de build (déjalo todo en blanco/por defecto).
4. "Deploy".
5. En un par de minutos tendrás tu URL, por ejemplo:
   `https://tu-proyecto.vercel.app`

## 3. Pruébala

Abre esa URL desde cualquier sitio — ordenador, móvil, tablet — y funcionará
igual que en tu `localhost:8080`, pero accesible desde fuera de tu Mac.

## ⚠️ Importante — qué significa (y qué NO significa) esta URL

- **Sí**: podrás entrar tú desde cualquier dispositivo con esa dirección, sin
  depender de tener el servidor corriendo en tu ordenador.
- **NO**: los datos siguen guardándose con `localStorage`, es decir, **en el
  navegador de cada dispositivo por separado**. Si entras desde el iPhone y
  desde el Mac, cada uno tendrá su propia copia de los datos, sin
  sincronizarse entre sí. Y si en algún momento otra persona entra a esa
  misma URL, no verá "tus" datos (porque están en tu navegador, no en la
  URL) — pero tampoco hay ninguna cuenta ni contraseña que proteja el acceso
  a la propia página.
- Cuando quieras multiusuario de verdad (para vender a otros docentes) o
  sincronización entre tus propios dispositivos, ese es el "Paso 2" del que
  hablamos — hazme saber cuándo quieres abordarlo.
