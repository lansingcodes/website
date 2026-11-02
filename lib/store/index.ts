import { firestoreStore } from './firestore'
import { localStore } from './local'
import type { DataStore } from './types'

// DATA_STORE selects the backend (development only for anything but the default):
//   unset    — Firestore, using the FIREBASE_* credentials
//   local    — JSON files in .data/ (no Firebase needed)
//   emulator — Firestore code path against the local Firebase emulator
//              (see lib/firebase/admin.ts and `npm run emulator`)
export function getStore(): DataStore {
  const mode = process.env.DATA_STORE
  if (!mode) return firestoreStore

  if (process.env.NODE_ENV === 'production') {
    throw new Error(`DATA_STORE=${mode} is for development only`)
  }
  if (mode === 'local') return localStore
  if (mode === 'emulator') return firestoreStore
  throw new Error(`Unknown DATA_STORE "${mode}". Use "local" or "emulator", or leave it unset.`)
}
