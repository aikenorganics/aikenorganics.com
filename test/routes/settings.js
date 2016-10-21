'use strict'

const test = require('../test')

test('GET /settings is a 401 when logged out', function *(t) {
  const response = yield t.client.get('/settings').send()
  response.expect(401)
})

test('POST /settings is a 401 when logged out', function *(t) {
  const response = yield t.client.post('/settings').send()
  response.expect(401)
})

test('POST /settings/card is a 401 when logged out', function *(t) {
  const response = yield t.client.post('/settings/card').send()
  response.expect(401)
})

test('GET /settings is a 200 as an admin', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/settings').send()
  response.expect(200)
})

test('GET /settings is a 200 as a regular user', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.get('/settings').send()
  response.expect(200)
})

test('POST /settings is a 200 as a regular user', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client
    .post('/settings')
    .set('content-type', 'application/json')
    .set('accept', 'application/json')
    .send({
      first: 'First',
      last: 'Last',
      phone: '555-555-5555'
    })
  response.expect(200).expect('content-type', /json/)
})

test('GET /settings adds stripe to the csp', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.get('/settings').send()
  response
  .expect(200)
  .expect('content-security-policy', /img-src[^;]+https:\/\/q.stripe.com/)
  .expect('content-security-policy', /frame-src[^;]+https:\/\/checkout.stripe.com/)
  .expect('content-security-policy', /script-src[^;]+https:\/\/checkout.stripe.com/)
  .expect('content-security-policy', /connect-src[^;]+https:\/\/checkout.stripe.com/)
})

test('GET /settings only adds csp to HTML responses', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.get('/settings').accept('json').send()
  t.ok(!/stripe/.test(response.headers['content-security-policy']))
})
