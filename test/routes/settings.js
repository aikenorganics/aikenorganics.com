'use strict'

const test = require('../test')

test('GET /settings is a 401 when logged out', async (t) => {
  const response = await t.client.get('/settings').send()
  response.assert(401)
})

test('POST /settings is a 401 when logged out', async (t) => {
  const response = await t.client.post('/settings').send()
  response.assert(401)
})

test('POST /settings/card is a 401 when logged out', async (t) => {
  const response = await t.client.post('/settings/card').send()
  response.assert(401)
})

test('GET /settings is a 200 as an admin', async (t) => {
  await t.signIn('admin@example.com')
  const response = await t.client.get('/settings').send()
  response.assert(200)
})

test('GET /settings is a 200 as a regular user', async (t) => {
  await t.signIn('user@example.com')
  const response = await t.client.get('/settings').send()
  response.assert(200)
})

test('POST /settings is a 200 as a regular user', async (t) => {
  await t.signIn('user@example.com')
  const response = await t.client
    .post('/settings')
    .set('content-type', 'application/json')
    .set('accept', 'application/json')
    .send({
      first: 'First',
      last: 'Last',
      phone: '555-555-5555'
    })
  response.assert(200).assert('content-type', /json/)
})

test('GET /settings adds stripe to the csp', async (t) => {
  await t.signIn('user@example.com')
  const response = await t.client.get('/settings').send()
  response
  .assert(200)
  .assert('content-security-policy', /img-src[^;]+https:\/\/q.stripe.com/)
  .assert('content-security-policy', /frame-src[^;]+https:\/\/checkout.stripe.com/)
  .assert('content-security-policy', /script-src[^;]+https:\/\/checkout.stripe.com/)
  .assert('content-security-policy', /connect-src[^;]+https:\/\/checkout.stripe.com/)
})

test('GET /settings only adds csp to HTML responses', async (t) => {
  await t.signIn('user@example.com')
  const response = await t.client.get('/settings').accept('json').send()
  t.ok(!/stripe/.test(response.headers['content-security-policy']))
})
