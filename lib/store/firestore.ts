import { getFirestore } from '@/lib/firebase/admin'
import type { DataStore } from './types'

export const firestoreStore: DataStore = {
  async listDocs<T>(collection: string, opts: Parameters<DataStore['listDocs']>[1] = {}) {
    let query: FirebaseFirestore.Query = getFirestore().collection(collection)
    if (opts.range) {
      query = query
        .where(opts.range.field, '>=', opts.range.min)
        .where(opts.range.field, '<=', opts.range.max)
    }
    if (opts.orderBy) query = query.orderBy(opts.orderBy, 'asc')

    const snapshot = await query.get()
    return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as T) }))
  },

  // Writing before deleting avoids a window where docs are missing from the site.
  async replaceCollection(collection, docs) {
    const ref = getFirestore().collection(collection)
    const currentIds = new Set(Object.keys(docs))

    await Promise.all(
      Object.entries(docs).map(([id, doc]) => ref.doc(id).set(doc)),
    )

    const existingDocs = await ref.listDocuments()
    const staleDocs = existingDocs.filter((doc) => !currentIds.has(doc.id))
    await Promise.all(staleDocs.map((doc) => doc.delete()))
  },
}
