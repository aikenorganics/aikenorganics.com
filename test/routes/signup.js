'use strict'

const test = require('../test')

test('signup page is a 200', function (t) {
  t.request()
  .get('/signup')
  .expect(200)
  .end(t.end)
})

test('POST /signup handles mixed case emails', function (t) {
  t.request()
  .post('/signup')
  .send('email=AdMiN@eXaMpLe.CoM')
  .send('password=password')
  .expect(422)
  .end(t.end)
})

test('POST /signup handles first, last, and phone', function (t) {
  t.request()
  .post('/signup')
  .send('first=Finn')
  .send('last=Mertens')
  .send('phone=803.512.3421')
  .send('email=finn@ooo.net')
  .send('password=password')
  .expect(302)
  .end(t.end)
})

test('Full signup flow', function (t) {
  let agent = t.request()

  agent
  .post('/signup')
  .send('first=Jake')
  .send('last=The Dog')
  .send('phone=803.123.4321')
  .send('email=jake@ooo.net')
  .send('password=sandwich')
  .expect(302)
  .end(function (e) {
    if (e) return t.end(e)

    agent
    .get('/auth/signout')
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)

      agent
      .post('/auth/signin')
      .send('email=jake@ooo.net')
      .send('password=sandwiches')
      .expect(422)
      .end(function (e) {
        if (e) return t.end(e)

        agent
        .post('/auth/signin')
        .send('email=jake@oooo.net')
        .send('password=sandwich')
        .expect(404)
        .end(function (e) {
          if (e) return t.end(e)

          agent
          .post('/auth/signin')
          .send('email=jake@ooo.net')
          .send('password=sandwich')
          .expect(302)
          .end(t.end)
        })
      })
    })
  })
})
