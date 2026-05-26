# Web-ERP

Web-ERP es una plataforma web modular que simula un entorno ERP empresarial. El proyecto integra distintas áreas de gestión en una única interfaz: CRM, finanzas, recursos humanos, proveedores, marketing, producción e inteligencia de negocio.

El objetivo principal del proyecto es demostrar una arquitectura frontend organizada, una integración funcional con Supabase y un flujo de despliegue preparado para entornos reales.

## Descripción Del Proyecto

La aplicación actúa como un portal centralizado desde el que se accede a diferentes módulos empresariales. Cada módulo carga dinámicamente sus proyectos desde Supabase y los presenta mediante un carrusel interactivo con soporte para imágenes, vídeos y enlaces de YouTube.

Este proyecto está orientado a mostrar competencias en desarrollo web moderno, organización de código, consumo de servicios backend, gestión de variables de entorno y preparación de una aplicación para producción.

## Funcionalidades Principales

- Panel principal con acceso visual a todos los módulos del ERP.
- Módulos independientes para CRM, finanzas, RRHH, proveedores, marketing, producción e inteligencia de negocio.
- Carga dinámica de proyectos desde Supabase.
- Carrusel interactivo por sección.
- Visualización de imágenes desde Supabase Storage.
- Soporte para vídeos almacenados y vídeos de YouTube.
- Contador de proyectos por módulo.
- Configuración runtime para evitar subir claves sensibles al repositorio.
- Preparación para despliegue en Railway.

## Tecnologías Utilizadas

- Vite
- JavaScript
- HTML5
- CSS3
- Supabase
- Supabase Storage
- Railway
- Node.js

## Arquitectura

El proyecto está organizado separando páginas, lógica JavaScript, estilos e imágenes. La aplicación utiliza Vite como herramienta de desarrollo y build, y Supabase como backend para la gestión de datos y recursos multimedia.

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

## Módulos Incluidos

- **Clientes y Ventas (CRM)**: gestión visual de proyectos relacionados con clientes y actividad comercial.
- **Finanzas**: sección orientada al área financiera.
- **RRHH**: módulo para recursos humanos.
- **Proveedores**: gestión de contenido relacionado con proveedores.
- **Marketing**: campañas y análisis de competencia.
- **Producción y Logística**: documentación y producción.
- **Inteligencia de Negocio**: visualización de recursos de análisis y toma de decisiones.

## Configuración Del Entorno

Crea un archivo `.env` en la raíz del proyecto usando `.env.example` como referencia:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STORAGE_BUCKET=Carousel
```

El archivo `.env` no debe subirse al repositorio. La aplicación genera un archivo `app-config.json` en local o producción a partir de estas variables.

## Instalación

```bash
npm install
```

## Ejecución En Desarrollo

```bash
npm run dev
```

Este comando genera la configuración runtime en `public/app-config.json` y arranca el servidor de desarrollo de Vite.

## Build De Producción

```bash
npm run build
```

La carpeta `dist/` se genera automáticamente durante el proceso de build y está excluida del control de versiones.

## Preview Local

```bash
npm run preview
```

## Arranque En Producción

```bash
npm run start
```

Este comando sirve la build de producción y utiliza la variable `PORT` cuando está disponible, por ejemplo en Railway.

## Despliegue

El proyecto incluye configuración para Railway mediante `railway.toml`:

```text
Build command: npm run build
Start command: npm run start
```

Variables requeridas en Railway:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_STORAGE_BUCKET=Carousel
```

## Modelo De Datos

La aplicación espera una tabla `projects` en Supabase con los siguientes campos:

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

El campo `section_id` se utiliza para filtrar los proyectos de cada módulo. Ejemplos de valores:

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

## Screenshots

![Pantalla principal](/src/assets/screenshots/Inicio.png)
![Carousel](/src/assets/screenshots/carousel.png)
![Modal](/src/assets/screenshots/modal.png)

## Seguridad Y Buenas Prácticas

- Las variables sensibles se mantienen fuera del repositorio.
- `.env` y `public/app-config.json` están ignorados por Git.
- `dist/` no se versiona, ya que es una carpeta generada.
- La configuración pública se genera en tiempo de ejecución.
- El proyecto mantiene una estructura de código legible dentro de `src/assets/js`.

## Archivos Ignorados

```text
node_modules/
dist/
.env
public/app-config.json
```

## Autor

**Joan Cabrerizo Benedicto**

GitHub: [mrgpx22](https://github.com/mrgpx22)
