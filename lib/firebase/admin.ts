import admin from 'firebase-admin'

const APP_NAME = 'lansing-codes'
// "demo-" projects are emulator-only and can never reach real Firebase resources.
// Must match .firebaserc and scripts/emulator.mjs.
const EMULATOR_PROJECT_ID = 'demo-lansing-codes'

// Prefer the full service account JSON (FIREBASE_SERVICE_ACCOUNT, as used by the
// old lansingcodes/api sites), falling back to the three separate vars.
function getCredentials() {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT
  if (serviceAccountJson) {
    const serviceAccount = JSON.parse(serviceAccountJson)
    return {
      projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key?.replace(/\\n/g, '\n'),
    }
  }

  return {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }
}

export function getFirebaseAdmin(): admin.app.App {
  const existing = admin.apps.find((a) => a?.name === APP_NAME)
  if (existing) return existing

  // DATA_STORE=emulator: the Admin SDK routes Firestore calls to
  // FIRESTORE_EMULATOR_HOST, and no credentials are needed.
  if (process.env.DATA_STORE === 'emulator') {
    process.env.FIRESTORE_EMULATOR_HOST ??= '127.0.0.1:8080'
    return admin.initializeApp({ projectId: EMULATOR_PROJECT_ID }, APP_NAME)
  }

  const { projectId, clientEmail, privateKey } = getCredentials()

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing Firebase credentials. Set FIREBASE_SERVICE_ACCOUNT, or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env.local',
    )
  }

  return admin.initializeApp(
    {
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
      databaseURL: `https://${projectId}.firebaseio.com`,
    },
    APP_NAME,
  )
}

export function getFirestore() {
  return getFirebaseAdmin().firestore()
}
