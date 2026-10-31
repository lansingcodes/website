// Sets up and runs the local Firebase Firestore emulator (DATA_STORE=emulator).
// Usage: node scripts/emulator.mjs [setup|start]
import { spawnSync, spawn } from 'node:child_process'
import { existsSync } from 'node:fs'

// Must match .firebaserc and lib/firebase/admin.ts
const PROJECT_ID = 'demo-lansing-codes'
const DATA_DIR = '.emulator-data'
const MIN_JAVA = 21

const commands = { setup, start }
const command = process.argv[2] ?? 'start'

if (!commands[command]) {
  console.error(`Unknown command "${command}". Use one of: ${Object.keys(commands).join(', ')}`)
  process.exit(1)
}

await commands[command]()

// shell: true so the firebase.cmd shim resolves on Windows
function firebase(args, options = {}) {
  return spawnSync(`firebase ${args}`, { shell: true, encoding: 'utf8', ...options })
}

function checkFirebaseCli() {
  const result = firebase('--version')
  if (result.status === 0) {
    console.log(`✓ Firebase CLI ${result.stdout.trim()}`)
    return true
  }
  console.error(`✗ Firebase CLI not found. Install it globally:

    npm install -g firebase-tools
`)
  return false
}

// "1.8.0_431" -> 8, "21.0.2" -> 21
function parseJavaMajor(output) {
  const match = output.match(/version "(\d+)(?:\.(\d+))?/)
  if (!match) return null
  const major = Number(match[1])
  return major === 1 ? Number(match[2]) : major
}

function checkJava() {
  // java -version prints to stderr
  const result = spawnSync('java', ['-version'], { encoding: 'utf8' })
  const major = result.error ? null : parseJavaMajor(`${result.stderr}${result.stdout}`)

  if (major !== null && major >= MIN_JAVA) {
    console.log(`✓ Java ${major}`)
    return true
  }

  const found = major === null ? 'Java was not found' : `Found Java ${major}`
  const install = {
    win32: 'winget install Microsoft.OpenJDK.21',
    darwin: 'brew install openjdk@21',
  }[process.platform] ?? 'sudo apt install openjdk-21-jdk'

  console.error(`✗ ${found}; the Firestore emulator needs Java ${MIN_JAVA}+. Install it with:

    ${install}

  Then make sure the new java is first on your PATH (or set JAVA_HOME),
  open a new terminal, and re-run: npm run emulator:setup
`)
  return false
}

async function setup() {
  // Run every check so all problems are reported at once
  const ok = [checkFirebaseCli(), checkJava()].every(Boolean)
  if (!ok) process.exit(1)

  console.log('\nDownloading the Firestore emulator...')
  const download = firebase('setup:emulators:firestore', { stdio: 'inherit' })
  if (download.status !== 0) process.exit(download.status ?? 1)

  console.log(`
Emulator ready. Next steps:
  1. Add DATA_STORE=emulator to .env.local
  2. npm run emulator      (Emulator UI: http://127.0.0.1:4000)
  3. npm run dev           (in another terminal)
  4. npm run sync          (populate events, groups, and sponsors)
`)
}

async function start() {
  const args = [
    'emulators:start',
    '--only firestore',
    `--project ${PROJECT_ID}`,
    `--export-on-exit=${DATA_DIR}`,
  ]
  // --import fails if there is no previous export yet
  if (existsSync(`${DATA_DIR}/firebase-export-metadata.json`)) {
    args.push(`--import=${DATA_DIR}`)
  }

  // Inherit stdio so Ctrl+C reaches the emulator and triggers the export
  const child = spawn(`firebase ${args.join(' ')}`, { shell: true, stdio: 'inherit' })
  child.on('exit', (code) => process.exit(code ?? 0))
}
