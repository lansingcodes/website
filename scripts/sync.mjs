// Triggers a /api/sync/* route on the local dev server.
// Usage: node scripts/sync.mjs [all|events|groups|sponsors]
import { readFileSync } from 'node:fs'

const targets = ['all', 'events', 'groups', 'sponsors']
const target = process.argv[2] ?? 'all'

if (!targets.includes(target)) {
  console.error(`Unknown target "${target}". Use one of: ${targets.join(', ')}`)
  process.exit(1)
}

function readEnvLocal() {
  try {
    return readFileSync('.env.local', 'utf8')
  } catch {
    console.error('Could not read .env.local — run this from the project root.')
    process.exit(1)
  }
}

// Handles CRLF line endings and optional quotes around the value
const match = readEnvLocal().match(/^SYNC_SECRET=(.*)$/m)
const secret = match?.[1].trim().replace(/^(["'])(.*)\1$/, '$2')

if (!secret) {
  console.error('SYNC_SECRET is missing or empty in .env.local')
  process.exit(1)
}

const baseUrl = process.env.SYNC_BASE_URL ?? 'http://localhost:3000'
const url = `${baseUrl}/api/sync/${target}`

console.log(`POST ${url}`)

try {
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret}` },
  })
  const body = await res.text()
  console.log(`${res.status} ${res.statusText}: ${body}`)
  if (!res.ok) process.exit(1)
} catch (error) {
  console.error(`Request failed: ${error.message}`)
  console.error('Is the dev server running (npm run dev)?')
  process.exit(1)
}
