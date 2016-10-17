'use strict'

const test = require('../test')

test('signup page is a 200', function *(t) {
  t.agent
  .get('/signup')
  .expect(200)
  .end(t.end)
})

test('POST /signup handles mixed case emails', function *(t) {
  t.agent
  .post('/signup')
  .send('email=AdMiN@eXaMpLe.CoM')
  .send('password=password')
  .expect(422)
  .expect('Content-Type', /json/)
  .end(t.end)
})

test('POST /signup handles first, last, and phone', function *(t) {
  t.agent
  .post('/signup')
  .send({
    first: 'Finn',
    last: 'Mertens',
    phone: '803.512.3421',
    email: 'finn@ooo.net',
    password: 'password'
  })
  .expect(200)
  .end(t.end)
})

test('Full signup flow', function *(t) {
  t.agent
  .post('/signup')
  .send({
    first: 'Jake',
    last: 'The Dog',
    phone: '803.123.4321',
    email: 'jake@ooo.net',
    password: 'sandwich'
  })
  .expect(200)
  .end((error) => {
    if (error) return t.end(error)

    t.agent
    .delete('/session')
    .expect(200)
    .end((error) => {
      if (error) return t.end(error)

      t.agent
      .post('/session')
      .send({
        email: 'jake@ooo.net',
        password: 'sandwiches'
      })
      .expect(422)
      .end((error) => {
        if (error) return t.end(error)

        t.agent
        .post('/session')
        .send({
          email: 'jake@oooo.net',
          password: 'sandwich'
        })
        .expect(422)
        .end((error) => {
          if (error) return t.end(error)

          t.agent
          .post('/session')
          .send({
            email: 'jake@ooo.net',
            password: 'sandwich'
          })
          .expect(200)
          .end(t.end)
        })
      })
    })
  })
})
