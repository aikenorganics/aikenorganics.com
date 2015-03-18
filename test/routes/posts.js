var test = require('../test')

test('/posts/new is a 401 logged out', function (t) {
  t.request()
  .get('/posts/new')
  .expect(401)
  .end(t.end)
})

test('/posts/new is a 200 as an admin', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.get('/posts/new')
    .expect(200)
    .end(t.end)
  })
})

test('Fetching a missing post is a 401 logged out', function (t) {
  t.request()
  .get('/posts/123456789')
  .expect(401)
  .end(t.end)
})

test('Fetching a missing post is a 404 as an admin', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .get('/posts/123456789')
    .expect(404)
    .end(t.end)
  })
})
