var test = require('../test')
var models = require('../../models')

test('Grower#url prepends http://', function (t) {
  var grower = models.Grower.build({
    url: 'example.com'
  })
  t.equal(grower.url, 'http://example.com')
  t.end()
})
