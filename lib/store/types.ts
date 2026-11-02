export interface ListOptions {
  // Inclusive numeric range filter, e.g. events by startTime
  range?: { field: string; min: number; max: number }
  // Ascending sort field
  orderBy?: string
}

export type StoredDoc = Record<string, unknown>

export interface DataStore {
  listDocs<T>(collection: string, opts?: ListOptions): Promise<(T & { id: string })[]>
  // Full-replace: write every doc, then remove any doc not in `docs`
  replaceCollection(collection: string, docs: Record<string, StoredDoc>): Promise<void>
}
