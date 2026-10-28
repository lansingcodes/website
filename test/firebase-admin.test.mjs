import assert from 'node:assert/strict'
import { generateKeyPairSync } from 'node:crypto'
import { afterEach, test } from 'node:test'
import { deleteApp, getApps } from 'firebase-admin/app'
import { getFirebaseAdmin, getFirestore } from '../lib/firebase/admin.ts'

const names = [
  'FIREBASE_SERVICE_ACCOUNT', 'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'
]
const previous = Object.fromEntries(names.map(name => [name, process.env[name]]))

afterEach(async () => {
  const app = getExistingApp()
  if (app) await deleteApp(app)
  for (const name of names) {
    if (previous[name] === undefined) delete process.env[name]
    else process.env[name] = previous[name]
  }
})

function getExistingApp () {
  return getApps().find(app => app.name === 'lansing-codes')
}

test('requires Firebase Admin credentials', () => {
  for (const name of names) delete process.env[name]
  assert.throws(() => getFirebaseAdmin(), /Missing Firebase credentials/)
})

test('initializes Firebase Admin from service account JSON', () => {
  for (const name of names) delete process.env[name]
  const { privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    publicKeyEncoding: { type: 'spki', format: 'pem' }
  })
  process.env.FIREBASE_SERVICE_ACCOUNT = JSON.stringify({
    project_id: 'demo-lansingcodes',
    client_email: 'test@example.invalid',
    private_key: privateKey
  })
  const app = getFirebaseAdmin()
  assert.equal(app.options.databaseURL, 'https://demo-lansingcodes.firebaseio.com')
  assert.equal(getFirebaseAdmin(), app)
  assert.equal(getFirestore().projectId, 'demo-lansingcodes')
})
