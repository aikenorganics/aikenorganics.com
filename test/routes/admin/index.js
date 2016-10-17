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
  t.signIn('user@example.com').then(() => {
    t.agent.get('/admin').expect(401).end(t.end)
  })
})

test('/admin is a 404 as an admin', function *(t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/admin').expect(404).end(t.end)
  })
})
