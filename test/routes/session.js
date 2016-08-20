'use strict'

const db = require('../../db')
const test = require('../test')

test('Can sign in with password', (t) => {
  t.request()
  .post('/session')
  .send({
    email: 'admin@example.com',
    password: 'password'
  })
  .expect(200)
  .end(t.end)
})

test('POST /session/forgot is a 422 for missing emails', (t) => {
  t.request()
  .post('/session/forgot')
  .send({email: 'does@not.exist'})
  .expect(422)
  .expect({email: ['Sorry! We don’t recognize that email.']})
  .end(t.end)
})

test('POST /session/forgot is a 200 for existing emails', (t) => {
  t.request()
  .post('/session/forgot')
  .send({email: 'admin@example.com'})
  .expect(200)
  .end(t.end)
})

test('POST /session/reset is a 302 for valid tokens', (t) => {
  t.agent.post('/session/forgot')
  .send({email: 'admin@example.com'})
  .expect(200)
  .end((error) => {
    if (error) return t.end(error)
    db.Token.where({userId: 1}).find().then((token) => {
      t.agent.post(`/session/reset/${token.id}`)
      .send({password: 'password'})
      .expect(200)
      .end(t.end)
    }).catch(t.end)
  })
})

test('POST /session/reset is a 422 for missing tokens', (t) => {
  t.request()
  .post('/session/reset/abcd1234')
  .send({password: 'password'})
  .expect(422)
  .end(t.end)
})

test('POST /session/reset enforces password length of 8', (t) => {
  t.agent.post('/session/forgot')
  .send({email: 'admin@example.com'})
  .expect(200)
  .end((error) => {
    if (error) return t.end(error)
    db.Token.where({userId: 1}).find().then((token) => {
      t.agent.post(`/session/reset/${token.id}`)
      .send({password: 'secret'})
      .expect(422)
      .end(t.end)
    }).catch(t.end)
  })
})

test('POST /session handles mixed case emails', (t) => {
  t.request()
  .post('/session')
  .send({
    email: 'AdMiN@eXaMpLe.CoM',
    password: 'password'
  })
  .expect(200)
  .end(t.end)
})

test('POST /session handles leading/trailing spaces', (t) => {
  t.request()
  .post('/session')
  .send({
    email: ' AdMiN@eXaMpLe.CoM ',
    password: 'password'
  })
  .expect(200)
  .end(t.end)
})

test('POST /session/forgot handles mixed case emails', (t) => {
  t.request()
  .post('/session/forgot')
  .send({email: 'AdMiN@eXaMpLe.CoM'})
  .expect(200)
  .end(t.end)
})
