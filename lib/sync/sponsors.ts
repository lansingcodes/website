import { getFirestore } from '@/lib/firebase/admin'
import sponsors from '@/data/sponsors.json'

// Full-replace sync: write all sponsors from data/sponsors.json, then delete
// any Firestore docs not in the JSON (e.g. if a sponsor was removed).
export async function syncSponsors() {
  const db = getFirestore()
  const sponsorsRef = db.collection('sponsors')

  const entries = Object.entries(sponsors as Record<string, unknown>)
  const currentIds = new Set(entries.map(([key]) => key))

  await Promise.all(
    entries.map(([key, sponsor]) =>
      sponsorsRef.doc(key).set(sponsor as Record<string, unknown>),
    ),
  )

  const existingDocs = await sponsorsRef.listDocuments()
  const staleDocs = existingDocs.filter((doc) => !currentIds.has(doc.id))
  await Promise.all(staleDocs.map((doc) => doc.delete()))
}
