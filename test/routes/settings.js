'use strict'

const test = require('../test')

test('GET /settings is a 401 when logged out', (t) => {
  t.agent.get('/settings').expect(401).end(t.end)
})

test('POST /settings is a 401 when logged out', (t) => {
  t.agent.post('/settings').expect(401).end(t.end)
})

test('POST /settings/card is a 401 when logged out', (t) => {
  t.agent.post('/settings/card').expect(401).end(t.end)
})

test('GET /settings is a 200 as an admin', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/settings')
    .expect(200)
    .end(t.end)
  })
})

test('GET /settings is a 200 as a regular user', (t) => {
  t.signIn('user@example.com').then(() => {
    t.agent.get('/settings')
    .expect(200)
    .end(t.end)
  })
})

test('POST /settings is a 200 as a regular user', (t) => {
  t.signIn('user@example.com').then(() => {
    t.agent.post('/settings')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send({
      first: 'First',
      last: 'Last',
      phone: '555-555-5555'
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .end(t.end)
  })
})
