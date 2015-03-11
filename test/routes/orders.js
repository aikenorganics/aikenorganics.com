var test = require('tape')
var request = require('./request')

test('/orders/current is a 200', function (t) {
  var agent = request().signIn('user@example.com', function () {
    agent
    .get('/orders/current')
    .expect(200)
    .end(t.end)
  })
})
