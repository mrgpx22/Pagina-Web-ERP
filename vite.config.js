import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

const previewAllowedHosts = [
  process.env.RAILWAY_PUBLIC_DOMAIN,
  process.env.RAILWAY_PRIVATE_DOMAIN,
  '.up.railway.app',
  'localhost',
  '127.0.0.1',
].filter(Boolean)

export default defineConfig({
  root: 'src',
  envDir: __dirname,
  publicDir: '../public',
  plugins: [vue()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/index.html'),
        'Clientes y Ventas (CRM)/CRM': resolve(__dirname, 'src/Clientes y Ventas (CRM)/Clientes/clientes.html'),
        'Clientes y Ventas (CRM)/Clientes/clientes': resolve(__dirname, 'src/Clientes y Ventas (CRM)/Clientes/clientes.html'),
        'Comercial Marketing/Campanas de Marketing/marketing': resolve(__dirname, 'src/Comercial Marketing/Campa\u00f1as de Marketing/marketing.html'),
        'Comercial Marketing/Analisis Competencia/analisis-competencia': resolve(__dirname, 'src/Comercial Marketing/Analisis Competencia/analisis-competencia.html'),
        'ERP/rrhh/rrhh': resolve(__dirname, 'src/ERP/rrhh/rrhh.html'),
        'ERP/Finanzas/ventas': resolve(__dirname, 'src/ERP/Finanzas/ventas.html'),
        'ERP/Proveedores/proveedores': resolve(__dirname, 'src/ERP/Proveedores/proveedores.html'),
        'Inteligencia de Negocio/inteligencia-negocio': resolve(__dirname, 'src/Inteligencia de Negocio/inteligencia-negocio.html'),
        'Productos/I+d/id': resolve(__dirname, 'src/Productos/I+d/id.html'),
        'Productos/Produccion Logistica/Documentacion/documentacion': resolve(__dirname, 'src/Productos/Produccion Logistica/Documentacion/documentacion.html'),
        'Productos/Produccion Logistica/Produccion/produccion': resolve(__dirname, 'src/Productos/Produccion Logistica/Produccion/produccion.html'),
      },
    },
  },
  preview: {
    allowedHosts: previewAllowedHosts,
  },
})

