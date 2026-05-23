import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const port = process.env.PORT || '4173'
const runtimeConfigPath = resolve('dist/app-config.json')
const runtimeConfig = {
  SUPABASE_URL: process.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || '',
  STORAGE_BUCKET: process.env.VITE_STORAGE_BUCKET || 'Carousel',
}

if (existsSync('dist')) {
  mkdirSync(dirname(runtimeConfigPath), { recursive: true })
  writeFileSync(runtimeConfigPath, `${JSON.stringify(runtimeConfig, null, 2)}\n`)
}

const preview = spawn(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['vite', 'preview', '--host', '0.0.0.0', '--port', port],
  { stdio: 'inherit' },
)

preview.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 0)
})
