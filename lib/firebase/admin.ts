import admin from 'firebase-admin'

const APP_NAME = 'lansing-codes'

export function getFirebaseAdmin(): admin.app.App {
  const existing = admin.apps.find((a) => a?.name === APP_NAME)
  if (existing) return existing

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing Firebase credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env.local',
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
