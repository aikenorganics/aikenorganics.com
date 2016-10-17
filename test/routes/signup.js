'use strict'

const test = require('../test')

test('signup page is a 200', function *(t) {
  const response = yield t.client.get('/signup').send()
  response.expect(200)
})

test('POST /signup handles mixed case emails', function *(t) {
  const response = yield t.client.post('/signup').send({
    email: 'AdMiN@eXaMpLe.CoM',
    password: 'password'
  })
  response.expect(422).expect('content-type', /json/)
})

test('POST /signup handles first, last, and phone', function *(t) {
  const response = yield t.client.post('/signup').send({
    first: 'Finn',
    last: 'Mertens',
    phone: '803.512.3421',
    email: 'finn@ooo.net',
    password: 'password'
  })
  response.expect(200)
})

test('Full signup flow', function *(t) {
  const signup = yield t.client.post('/signup').send({
    first: 'Jake',
    last: 'The Dog',
    phone: '803.123.4321',
    email: 'jake@ooo.net',
    password: 'sandwich'
  })
  signup.expect(200)

  const signout = yield t.client.delete('/session').send()
  signout.expect(200)

  const incorrectPassword = yield t.client.post('/session').send({
    email: 'jake@ooo.net',
    password: 'sandwiches'
  })
  incorrectPassword.expect(422)

  const incorrectEmail = yield t.client.post('/session').send({
    email: 'jake@oooo.net',
    password: 'sandwich'
  })
  incorrectEmail.expect(422)

  const correct = yield t.client.post('/session').send({
    email: 'jake@ooo.net',
    password: 'sandwich'
  })
  correct.expect(200)
})
