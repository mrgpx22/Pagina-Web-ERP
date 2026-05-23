import { spawn } from 'node:child_process'

const port = process.env.PORT || '4173'

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
