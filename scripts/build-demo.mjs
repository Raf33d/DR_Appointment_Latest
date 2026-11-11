// Builds the Netlify demo: both websites in demo mode (fake API in the browser,
// no backend needed), combined into one folder: demo-dist/
//   demo-dist/        patient website
//   demo-dist/admin/  staff panel
// Usage: npm run build:demo
import { execSync } from 'node:child_process'
import { cpSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = path.join(root, 'demo-dist')
const env = { ...process.env, VITE_DEMO_MODE: 'true' }

for (const app of ['frontend', 'admin']) {
  console.log(`\n> Building ${app} (demo mode)`)
  execSync('npm run build', { cwd: path.join(root, app), env, stdio: 'inherit' })
}

rmSync(out, { recursive: true, force: true })
cpSync(path.join(root, 'frontend', 'dist'), out, { recursive: true })
cpSync(path.join(root, 'admin', 'dist'), path.join(out, 'admin'), { recursive: true })

// Single-page apps: every page address loads the right index.html.
// (Kept in the folder itself so it also works with Netlify Drop.)
writeFileSync(path.join(out, '_redirects'), [
  '/admin/*  /admin/index.html  200',
  '/*        /index.html        200',
  ''
].join('\n'))

console.log(`\nDemo ready in ${path.relative(process.cwd(), out) || out}/`)
