'use strict'

const db = require('../../db')
const test = require('../test')

test('Can sign in with password', (t) => {
  t.request()
  .post('/auth/signin')
  .send({
    email: 'admin@example.com',
    password: 'password'
  })
  .expect(200)
  .end(t.end)
})

test('GET /signin/forgot is a 200', (t) => {
  t.request()
  .get('/signin/forgot')
  .expect(200)
  .end(t.end)
})

test('POST /auth/forgot is a 422 for missing emails', (t) => {
  t.request()
  .post('/auth/forgot')
  .send({email: 'does@not.exist'})
  .expect(422)
  .expect({email: ['Sorry! We don’t recognize that email.']})
  .end(t.end)
})

test('POST /auth/forgot is a 200 for existing emails', (t) => {
  t.request()
  .post('/auth/forgot')
  .send({email: 'admin@example.com'})
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
  t.agent.post('/auth/forgot')
  .send({email: 'admin@example.com'})
  .expect(200)
  .end((e) => {
    if (e) return t.end(e)
    db.Token.where({userId: 1}).find().then((token) => {
      t.agent.get(`/signin/reset/${token.id}`)
      .expect(200)
      .end(t.end)
    }).catch(t.end)
  })
})

test('POST /auth/reset is a 302 for valid tokens', (t) => {
  t.agent.post('/auth/forgot')
  .send({email: 'admin@example.com'})
  .expect(200)
  .end((e) => {
    if (e) return t.end(e)
    db.Token.where({userId: 1}).find().then((token) => {
      t.agent.post(`/auth/reset/${token.id}`)
      .send({password: 'password'})
      .expect(200)
      .end(t.end)
    }).catch(t.end)
  })
})

test('POST /auth/reset is a 422 for missing tokens', (t) => {
  t.request()
  .post('/auth/reset/abcd1234')
  .send({password: 'password'})
  .expect(422)
  .end(t.end)
})

test('POST /auth/reset enforces password length of 8', (t) => {
  t.agent.post('/auth/forgot')
  .send({email: 'admin@example.com'})
  .expect(200)
  .end((e) => {
    if (e) return t.end(e)
    db.Token.where({userId: 1}).find().then((token) => {
      t.agent.post(`/auth/reset/${token.id}`)
      .send({password: 'secret'})
      .expect(422)
      .end(t.end)
    }).catch(t.end)
  })
})

test('POST /auth/signin handles mixed case emails', (t) => {
  t.request()
  .post('/auth/signin')
  .send({
    email: 'AdMiN@eXaMpLe.CoM',
    password: 'password'
  })
  .expect(200)
  .end(t.end)
})

test('POST /auth/signin handles leading/trailing spaces', (t) => {
  t.request()
  .post('/auth/signin')
  .send({
    email: ' AdMiN@eXaMpLe.CoM ',
    password: 'password'
  })
  .expect(200)
  .end(t.end)
})

test('POST /auth/forgot handles mixed case emails', (t) => {
  t.request()
  .post('/auth/forgot')
  .send({email: 'AdMiN@eXaMpLe.CoM'})
  .expect(200)
  .end(t.end)
})
