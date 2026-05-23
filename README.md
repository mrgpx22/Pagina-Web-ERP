# Web-ERP

Plataforma ERP web modular desarrollada con Vue, Vite y Supabase.

## Descripcion

Web-ERP simula un sistema ERP empresarial con diferentes areas de gestion dentro de una interfaz web centralizada.

El proyecto esta pensado como practica de arquitectura frontend modular, integracion con backend, autenticacion y despliegue de aplicaciones web.

## Funcionalidades

- Gestion de clientes y ventas (CRM)
- Gestion de empleados (RRHH)
- Modulos financieros basicos
- Gestion de proveedores
- Produccion y documentacion logistica
- Inteligencia de negocio
- Campanas de marketing y analisis de competencia
- Integracion preparada para Supabase

## Tecnologias

- Vue 3
- Vite
- Supabase
- JavaScript
- PostgreSQL
- Railway

## Requisitos

- Node.js 22.12.0, indicado en `.nvmrc`
- npm

## Instalacion

```bash
git clone https://github.com/mrgpx22/Web-ERP.git
cd Web-ERP
npm install
```

## Variables de entorno

Crea un archivo `.env` a partir de `.env.example`:

```bash
cp .env.example .env
```

Valores esperados:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STORAGE_BUCKET=Carousel
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run start
```

`npm run start` sirve la build de produccion y usa la variable `PORT` cuando existe, por ejemplo en Railway.

## Estructura

```text
src/                 Codigo fuente de la aplicacion
src/assets/js/       JavaScript con nombres legibles
src/assets/css/      Estilos de la aplicacion
src/assets/images/   Imagenes usadas por la interfaz
public/              Configuracion runtime publica
scripts/             Scripts auxiliares de ejecucion
dist/                Build generada localmente, no se sube a Git
```

## Despliegue

El proyecto incluye `railway.toml`:

- Build: `npm run build`
- Start: `npm run start`

## Autor

Joan Cabrerizo Benedicto

GitHub: https://github.com/mrgpx22

Repositorio: https://github.com/mrgpx22/Web-ERP
