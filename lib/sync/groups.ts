import { getFirestore } from '@/lib/firebase/admin'
import groups from '@/data/groups.json'

// Full-replace sync: write all groups from data/groups.json, then delete
// any Firestore docs not in the JSON (e.g. if a group was removed).
export async function syncGroups() {
  const db = getFirestore()
  const groupsRef = db.collection('groups')

  const entries = Object.entries(groups as Record<string, unknown>)
  const currentIds = new Set(entries.map(([key]) => key))

  await Promise.all(
    entries.map(([key, group]) =>
      groupsRef.doc(key).set(group as Record<string, unknown>),
    ),
  )

  const existingDocs = await groupsRef.listDocuments()
  const staleDocs = existingDocs.filter((doc) => !currentIds.has(doc.id))
  await Promise.all(staleDocs.map((doc) => doc.delete()))
}
