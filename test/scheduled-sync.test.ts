import test from 'node:test'
import assert from 'node:assert/strict'
import handler from '../netlify/functions/scheduled-sync'

test('scheduled sync fails visibly when its secret is missing', async (context) => {
  const previous = process.env.SYNC_SECRET
  delete process.env.SYNC_SECRET
  context.after(() => {
    if (previous === undefined) delete process.env.SYNC_SECRET
    else process.env.SYNC_SECRET = previous
  })
  context.mock.method(console, 'error', () => {})
  context.mock.method(globalThis, 'fetch', async () => { throw new Error('fetch should not run') })

  await assert.rejects(handler(), /SYNC_SECRET not set/)
})

test('scheduled sync fails visibly when the API rejects the request', async (context) => {
  const previous = process.env.SYNC_SECRET
  process.env.SYNC_SECRET = 'local-test-only'
  context.after(() => {
    if (previous === undefined) delete process.env.SYNC_SECRET
    else process.env.SYNC_SECRET = previous
  })
  context.mock.method(console, 'error', () => {})
  context.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 503 }))

  await assert.rejects(handler(), /HTTP 503/)
})

test('scheduled sync posts to the configured site with its bearer token', async (context) => {
  const previousSecret = process.env.SYNC_SECRET
  const previousUrl = process.env.URL
  process.env.SYNC_SECRET = 'local-test-only'
  process.env.URL = 'https://example.test'
  context.after(() => {
    if (previousSecret === undefined) delete process.env.SYNC_SECRET
    else process.env.SYNC_SECRET = previousSecret
    if (previousUrl === undefined) delete process.env.URL
    else process.env.URL = previousUrl
  })
  let requestedUrl = ''
  let authorization = ''
  context.mock.method(console, 'log', () => {})
  context.mock.method(globalThis, 'fetch', async (input: RequestInfo | URL, init?: RequestInit) => {
    requestedUrl = String(input)
    authorization = new Headers(init?.headers).get('Authorization') || ''
    return new Response(null, { status: 200 })
  })

  await handler()
  assert.equal(requestedUrl, 'https://example.test/api/sync/all')
  assert.equal(authorization, 'Bearer local-test-only')
})
