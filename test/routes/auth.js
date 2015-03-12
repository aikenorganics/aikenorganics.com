var test = require('tape')
var request = require('./request')
var models = require('../../models')

test('signup page is a 200', function (t) {
  request()
  .get('/auth/signup')
  .expect(200)
  .end(t.end)
})

test('Can sign in with password', function (t) {
  request()
  .post('/auth/signin')
  .field('email', 'admin@example.com')
  .field('password', 'password')
  .expect(302)
  .end(t.end)
})

test('GET /auth/forgot is a 200', function (t) {
  request()
  .get('/auth/forgot')
  .expect(200)
  .end(t.end)
})

test('POST /auth/forgot is a 404 for missing emails', function (t) {
  request()
  .post('/auth/forgot')
  .field('email', 'does@not.exist')
  .expect(404)
  .end(t.end)
})

test('POST /auth/forgot is a 302 for existing emails', function (t) {
  request()
  .post('/auth/forgot')
  .field('email', 'admin@example.com')
  .expect(302)
  .end(t.end)
})

test('GET /auth/reset is a 404 for missing tokens', function (t) {
  request()
  .get('/auth/reset/doesnotexist')
  .expect(404)
  .end(t.end)
})

test('GET /auth/reset is a 200 for valid tokens', function (t) {
  var agent = request()
  agent.post('/auth/forgot')
  .field('email', 'admin@example.com')
  .expect(302)
  .end(function () {
    models.Token.findAll({
      order: [['expires_at', 'DESC']]
    }).then(function (tokens) {
      agent.get('/auth/reset/' + tokens[0].id)
      .expect(200)
      .end(t.end)
    })
  })
})

test('POST /auth/reset is a 302 for valid tokens', function (t) {
  var agent = request()
  agent.post('/auth/forgot')
  .field('email', 'admin@example.com')
  .expect(302)
  .end(function () {
    models.Token.findAll({
      order: [['expires_at', 'DESC']]
    }).then(function (tokens) {
      agent.post('/auth/reset/' + tokens[0].id)
      .field('password', 'password')
      .expect(302)
      .end(t.end)
    })
  })
})

test('POST /auth/reset is a 404 for missing tokens', function (t) {
  request()
  .post('/auth/reset')
  .field('token', 'does not exist')
  .field('password', 'password')
  .expect(404)
  .end(t.end)
})

test('POST /auth/reset enforces password length of 8', function (t) {
  var agent = request()
  agent.post('/auth/forgot')
  .field('email', 'admin@example.com')
  .expect(302)
  .end(function () {
    models.Token.findAll({
      order: [['expires_at', 'DESC']]
    }).then(function (tokens) {
      agent.post('/auth/reset/' + tokens[0].id)
      .field('password', 'secret')
      .expect(422)
      .end(t.end)
    })
  })
})

test('POST /auth/signin handles mixed case emails', function (t) {
  request()
  .post('/auth/signin')
  .field('email', 'AdMiN@eXaMpLe.CoM')
  .field('password', 'password')
  .expect(302)
  .end(t.end)
})

test('POST /auth/forgot handles mixed case emails', function (t) {
  request()
  .post('/auth/forgot')
  .field('email', 'AdMiN@eXaMpLe.CoM')
  .expect(302)
  .end(t.end)
})

test('POST /auth/signup handles mixed case emails', function (t) {
  request()
  .post('/auth/signup')
  .field('email', 'AdMiN@eXaMpLe.CoM')
  .field('password', 'password')
  .expect(422)
  .end(t.end)
})

test('POST /auth/signup handles first, last, and phone', function (t) {
  request()
  .post('/auth/signup')
  .field('first', 'Finn')
  .field('last', 'Mertens')
  .field('phone', '803.512.3421')
  .field('email', 'finn@ooo.net')
  .field('password', 'password')
  .expect(302)
  .end(t.end)
})

test('Full signup flow', function (t) {
  var agent = request()

  agent
  .post('/auth/signup')
  .field('first', 'Jake')
  .field('last', 'The Dog')
  .field('phone', '803.123.4321')
  .field('email', 'jake@ooo.net')
  .field('password', 'sandwich')
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
      .field('email', 'jake@ooo.net')
      .field('password', 'sandwiches')
      .expect(422)
      .end(function (e) {
        if (e) return t.end(e)

        agent
        .post('/auth/signin')
        .field('email', 'jake@oooo.net')
        .field('password', 'sandwich')
        .expect(404)
        .end(function (e) {
          if (e) return t.end(e)

          agent
          .post('/auth/signin')
          .field('email', 'jake@ooo.net')
          .field('password', 'sandwich')
          .expect(302)
          .end(t.end)
        })
      })
    })
  })
})
