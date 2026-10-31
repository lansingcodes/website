export type SyncOutcome = 'complete' | 'failed_or_partial'
export type SyncOutcomes<Collection extends string> = Record<Collection, SyncOutcome>
type SyncTasks<Collection extends string> = Record<Collection, () => Promise<unknown>>

// Wait for every writer before reporting a combined result. A rejected writer
// may already have changed documents, so its status must not imply rollback.
export async function runAllSyncs<Collection extends string>(tasks: SyncTasks<Collection>) {
  const names = Object.keys(tasks) as Collection[]
  const settled = await Promise.allSettled(names.map((name) => tasks[name]()))
  const outcomes = {} as SyncOutcomes<Collection>
  const failures: Array<{ collection: Collection; error: unknown }> = []

  settled.forEach((result, index) => {
    const collection = names[index]
    if (result.status === 'fulfilled') outcomes[collection] = 'complete'
    else {
      outcomes[collection] = 'failed_or_partial'
      failures.push({ collection, error: result.reason })
    }
  })

  return { outcomes, failures }
}
