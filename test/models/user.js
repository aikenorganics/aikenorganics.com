var test = require('tape');
var models = require('../../models');

test('User#name combines first and last', function(t) {
  var user = models.User.build({
    first: 'Steven',
    last: 'Tyler'
  });
  t.equal(user.name(), 'Steven Tyler');
  t.end();
});
