import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const targetDir = process.argv[2] || 'public'
const targetPath = resolve(targetDir, 'app-config.json')

function readEnvFile(path) {
  if (!existsSync(path)) return {}

  return readFileSync(path, 'utf8')
    .split(/\r?\n/)
    .reduce((env, line) => {
      const trimmed = line.trim()

      if (!trimmed || trimmed.startsWith('#')) return env

      const separator = trimmed.indexOf('=')
      if (separator === -1) return env

      const key = trimmed.slice(0, separator).trim()
      const value = trimmed.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '')
      env[key] = value

      return env
    }, {})
}

const fileEnv = readEnvFile(resolve('.env'))
const config = {
  SUPABASE_URL: process.env.VITE_SUPABASE_URL || fileEnv.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY:
    process.env.VITE_SUPABASE_ANON_KEY || fileEnv.VITE_SUPABASE_ANON_KEY || '',
  STORAGE_BUCKET: process.env.VITE_STORAGE_BUCKET || fileEnv.VITE_STORAGE_BUCKET || 'Carousel',
}

mkdirSync(dirname(targetPath), { recursive: true })
writeFileSync(targetPath, `${JSON.stringify(config, null, 2)}\n`)

console.log(`Runtime config written to ${targetPath}`)
