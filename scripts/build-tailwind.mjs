import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const input = path.join(rootDir, 'src/client/tailwind.css')
const output = path.join(rootDir, 'src/client/tailwind.generated.css')

const result = spawnSync(
    'npx',
    ['@tailwindcss/cli', '-i', input, '-o', output],
    { cwd: rootDir, stdio: 'inherit', shell: true }
)

if (result.status !== 0) {
    process.exit(result.status ?? 1)
}
