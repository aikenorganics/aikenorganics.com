var test = require('tape')
var models = require('../../models')

test('User#name combines first and last', function (t) {
  var user = models.User.build({
    first: 'Steven',
    last: 'Tyler'
  })
  t.equal(user.name(), 'Steven Tyler')
  t.end()
})

test('User#name is trimmed', function (t) {
  var user = models.User.build({})
  t.equal(user.name(), '')
  t.end()
})
