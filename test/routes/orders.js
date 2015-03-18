var test = require('../test')
var request = require('./request')

test('GET /orders/current is a 200', function (t) {
  var agent = request().signIn('user@example.com', function (e) {
    if (e) return t.end(e)
    agent
    .get('/orders/current')
    .expect(200)
    .end(t.end)
  })
})

test('POST /orders/:id/cancel is a 302', function (t) {
  var agent = request().signIn('user@example.com', function (e) {
    if (e) return t.end(e)
    agent
    .post('/orders/2/cancel')
    .expect(302)
    .end(t.end)
  })
})

test('Cannot cancel someone else\'s order', function (t) {
  var agent = request().signIn('user@example.com', function (e) {
    if (e) return t.end(e)
    agent
    .post('/orders/1/cancel')
    .expect(401)
    .end(t.end)
  })
})
