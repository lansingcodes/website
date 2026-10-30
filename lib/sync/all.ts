export type SyncOutcome = 'complete' | 'failed_or_partial'
export type SyncOutcomes = Record<'events' | 'groups' | 'sponsors', SyncOutcome>

type SyncTasks = {
  events: () => Promise<unknown>
  groups: () => Promise<unknown>
  sponsors: () => Promise<unknown>
}

// Wait for every writer before reporting a combined result. A rejected writer
// may already have changed documents, so its status must not imply rollback.
export async function runAllSyncs(tasks: SyncTasks) {
  const names = ['events', 'groups', 'sponsors'] as const
  const settled = await Promise.allSettled(names.map((name) => tasks[name]()))
  const outcomes = {} as SyncOutcomes
  const failures: Array<{ collection: keyof SyncOutcomes; error: unknown }> = []

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
