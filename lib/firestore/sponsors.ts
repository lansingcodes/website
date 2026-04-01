import { getFirestore } from '@/lib/firebase/admin'

export interface Sponsor {
  id: string
  name: string
  description: string
  logoUrl: string
  url: string
  youtube?: string
}

export async function getAllSponsors(): Promise<Sponsor[]> {
  const db = getFirestore()
  const snapshot = await db.collection('sponsors').orderBy('name', 'asc').get()
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Sponsor, 'id'>),
  }))
}
