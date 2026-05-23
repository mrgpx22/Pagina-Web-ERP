# Web-ERP

Plataforma web tipo ERP desarrollada con Vite, JavaScript y Supabase.

El proyecto centraliza diferentes areas de una empresa en una interfaz modular: CRM, finanzas, RRHH, proveedores, marketing, produccion e inteligencia de negocio.

## Funcionalidades

- Panel principal con acceso a todos los modulos.
- Carga de proyectos desde Supabase por seccion.
- Carrusel interactivo de proyectos.
- Soporte para imagenes y videos almacenados en Supabase Storage.
- Reproduccion de videos locales o enlaces de YouTube.
- Contador de proyectos por modulo.
- Configuracion runtime para despliegue sin subir claves al repositorio.

## Tecnologias

- Vite
- JavaScript
- Supabase
- HTML
- CSS
- Railway

## Estructura del proyecto

```text
src/
  index.html
  assets/
    js/
      config.js
      home.js
      module-page.js
    css/
      home.css
      module.css
    images/
      a2d.png
      bbdd.jpg
      enginyeria.jpg
      marketing.jpg
      recursos-humanos.jpg
      ventas.jpg
  Clientes y Ventas (CRM)/
  Comercial Marketing/
  ERP/
  Inteligencia de Negocio/
  Productos/

public/
  app-config.example.json

scripts/
  start-preview.mjs
  write-runtime-config.mjs
```

## Variables de entorno

Crea un archivo `.env` en la raiz del proyecto usando `.env.example` como base:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STORAGE_BUCKET=Carousel
```

El archivo `.env` no debe subirse a GitHub. La app genera `app-config.json` en local o en produccion a partir de estas variables.

## Instalacion

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Este comando genera `public/app-config.json` desde `.env` y arranca Vite.

## Build

```bash
npm run build
```

La carpeta `dist/` se genera automaticamente y no se sube al repositorio.

## Preview local

```bash
npm run preview
```

## Produccion

```bash
npm run start
```

Este comando sirve la build de produccion y usa la variable `PORT` cuando existe, por ejemplo en Railway.

## Despliegue en Railway

El proyecto incluye `railway.toml` con:

```text
Build command: npm run build
Start command: npm run start
```

Configura en Railway las mismas variables de entorno:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_STORAGE_BUCKET=Carousel
```

## Supabase

La aplicacion espera una tabla `projects` con campos usados por el carrusel:

```text
id
name
description
image_path
video_path
section_id
position
completed
```

`section_id` se compara con el modulo actual. Por ejemplo:

```text
Clientes
Finanzas
RRHH
Proveedores
Inteligencia de Negocio
Campanyas de Marketing
Analisis Competencia
I+D
Documentacion
Produccion
```

## Notas para GitHub

No se deben subir:

```text
node_modules/
dist/
.env
public/app-config.json
```

Si despues de compilar aparece `dist/`, es normal. Git lo ignora.

## Autor

Joan Cabrerizo Benedicto

GitHub: https://github.com/mrgpx22
