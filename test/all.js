var test = require('tape');
var models = require('../models');

require('./auth');
require('./growers');
require('./home');
require('./posts');

test('teardown', function(t) {
  models.close();
  t.end();
});
