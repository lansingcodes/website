import { getStore } from '@/lib/store'

export interface Sponsor {
  id: string
  name: string
  description: string
  logoUrl: string
  url: string
  youtube?: string
}

export async function getAllSponsors(): Promise<Sponsor[]> {
  return getStore().listDocs<Omit<Sponsor, 'id'>>('sponsors', { orderBy: 'name' })
}
