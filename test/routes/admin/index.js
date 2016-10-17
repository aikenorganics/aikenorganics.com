require('./users')
require('./market')
require('./orders')
require('./growers')
require('./products')
require('./locations')
require('./categories')
require('./user-growers')
require('./product-orders')

const test = require('../../test')

test('/admin is a 401 signed out', function *(t) {
  t.agent.get('/admin').expect(401).end(t.end)
})

test('/admin is a 401 as a regular user', function *(t) {
  yield t.signIn('user@example.com')
  t.agent.get('/admin').expect(401).end(t.end)
})

test('/admin is a 404 as an admin', function *(t) {
  yield t.signIn('admin@example.com')
  t.agent.get('/admin').expect(404).end(t.end)
})
