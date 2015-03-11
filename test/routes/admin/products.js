var test = require('tape')
var request = require('../request')

test('/admin/products/oversold is a 200', function (t) {
  var agent = request().signIn('admin@example.com', function () {
    agent
    .get('/admin/products/oversold')
    .expect(200)
    .end(t.end)
  })
})
