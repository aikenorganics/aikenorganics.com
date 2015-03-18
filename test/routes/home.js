var test = require('../test')
var app = require('../../app')

test('home page is a 200', function (t) {
  t.request(app)
  .get('/')
  .expect(200)
  .end(t.end)
})
