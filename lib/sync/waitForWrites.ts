// A failed write must not return control while sibling writes can still mutate
// the collection. Start every task, wait for all outcomes, then report failure.
export async function waitForWrites(tasks: Array<() => Promise<unknown>>) {
  const settled = await Promise.allSettled(tasks.map(task => Promise.resolve().then(task)))
  const failed = settled.find(result => result.status === 'rejected')
  if (failed?.status === 'rejected') throw failed.reason
}
