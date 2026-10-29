import { cert, getApps, initializeApp, type App } from 'firebase-admin/app'
import { getFirestore as adminGetFirestore } from 'firebase-admin/firestore'

const APP_NAME = 'lansing-codes'

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

export function getFirebaseAdmin(): App {
  const existing = getApps().find((app) => app.name === APP_NAME)
  if (existing) return existing

  const { projectId, clientEmail, privateKey } = getCredentials()

  if (process.env.FIRESTORE_EMULATOR_HOST && projectId) {
    return initializeApp({ projectId }, APP_NAME)
  }

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing Firebase credentials. Set FIREBASE_SERVICE_ACCOUNT, or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env.local',
    )
  }

  return initializeApp(
    {
      credential: cert({ projectId, clientEmail, privateKey }),
      databaseURL: `https://${projectId}.firebaseio.com`,
    },
    APP_NAME,
  )
}

export function getFirestore() {
  return adminGetFirestore(getFirebaseAdmin())
}
