'use strict'

const db = require('../../db')
const test = require('../test')

test('GET /signin/forgot is a 200', (t) => {
  t.request()
  .get('/signin/forgot')
  .expect(200)
  .end(t.end)
})

test('GET /signin/reset is a 200 for missing tokens', (t) => {
  t.request()
  .get('/signin/reset/doesnotexist')
  .expect(200)
  .end(t.end)
})

test('GET /signin/reset is a 200 for valid tokens', (t) => {
  t.agent.post('/session/forgot')
  .send({email: 'admin@example.com'})
  .expect(200)
  .end((error) => {
    if (error) return t.end(error)
    db.Token.where({userId: 1}).find().then((token) => {
      t.agent.get(`/signin/reset/${token.id}`)
      .expect(200)
      .end(t.end)
    }).catch(t.end)
  })
})
