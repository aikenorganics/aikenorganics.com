var test = require('../../test')

test('/admin/products/oversold is a 200', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .get('/admin/products/oversold')
    .expect(200)
    .end(t.end)
  })
})
