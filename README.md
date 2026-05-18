# Web ERP

## Requisitos
- Node `22.12.0` (ver `.nvmrc`)

## Configuracion de entorno
1. Crea un archivo `.env` desde `.env.example`.
2. Define estas variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_STORAGE_BUCKET` (opcional, por defecto `Carousel`)

## Supabase
1. En Supabase, abre SQL Editor y ejecuta completo `supabase-setup.sql`.
2. Si quieres datos demo, sube imagenes al bucket `Carousel` usando las rutas de `supabase-examples.sql` o cambia esas rutas por las tuyas.
3. Ejecuta `supabase-examples.sql` para insertar proyectos de ejemplo.
4. Guarda en `projects.image_path` la ruta del archivo dentro del bucket, por ejemplo `clientes/demo-crm.webp`.
5. Guarda en `projects.video_path` un enlace de YouTube o el ID del video.

Valores de `section_id` usados por la web:
- `Clientes`
- `Analisis Competencia`
- `Campanyas de Marketing`
- `Finanzas`
- `Proveedores`
- `RRHH`
- `Inteligencia de Negocio`
- `I+D`
- `Documentacion`
- `Produccion`

## Desarrollo local
- `npm install`
- `npm run dev`
