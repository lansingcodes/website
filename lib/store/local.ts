import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { DataStore, StoredDoc } from './types'

// One JSON file per collection, so parallel syncs of different
// collections (e.g. /api/sync/all) never overwrite each other.
const DATA_DIR = path.join(process.cwd(), '.data')
const pendingWrites = new Map<string, Promise<void>>()

function fileFor(collection: string) {
  return path.join(DATA_DIR, `${collection}.json`)
}

async function readCollection(collection: string): Promise<Record<string, StoredDoc>> {
  try {
    return JSON.parse(await readFile(fileFor(collection), 'utf8'))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return {}
    throw error
  }
}

export const localStore: DataStore = {
  async listDocs<T>(collection: string, opts: Parameters<DataStore['listDocs']>[1] = {}) {
    let docs = Object.entries(await readCollection(collection)).map(
      ([id, doc]) => ({ id, ...doc }) as T & { id: string } & StoredDoc,
    )

    const { range, orderBy } = opts
    if (range) {
      docs = docs.filter((doc) => {
        const value = doc[range.field] as number
        return value >= range.min && value <= range.max
      })
    }
    if (orderBy) {
      docs.sort((a, b) => {
        const x = a[orderBy] as string | number
        const y = b[orderBy] as string | number
        return x < y ? -1 : x > y ? 1 : 0
      })
    }
    return docs
  },

  // Queue writes to the same file and atomically publish each complete snapshot.
  // Different collections can still sync in parallel.
  async replaceCollection(collection, docs) {
    const previous = pendingWrites.get(collection) ?? Promise.resolve()
    // A failed replacement still rejects its caller, but must not block the queue.
    const replacement = previous.catch(() => {}).then(async () => {
      await mkdir(DATA_DIR, { recursive: true })
      const file = fileFor(collection)
      const tempFile = `${file}.${randomUUID()}.tmp`
      try {
        await writeFile(tempFile, JSON.stringify(docs, null, 2))
        await rename(tempFile, file)
      } finally {
        await rm(tempFile, { force: true }).catch(() => {
          // Cleanup is best effort; preserve the original write or rename error.
        })
      }
    })
    pendingWrites.set(collection, replacement)
    try {
      await replacement
    } finally {
      if (pendingWrites.get(collection) === replacement) pendingWrites.delete(collection)
    }
  },
}
