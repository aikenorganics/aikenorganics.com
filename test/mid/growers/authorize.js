var test = require('../../test')
var authorize = require('../../../mid/growers/authorize')

test('growers/authorize: missing user and grower', function (t) {
  var req = {}
  var res = {locals: {}}
  authorize(req, res, function () {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})

test('growers/authorize: missing user', function (t) {
  var req = {grower: {id: 1}}
  var res = {locals: {}}
  authorize(req, res, function () {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})

test('growers/authorize: missing grower', function (t) {
  var req = {currentUser: {id: 2}}
  var res = {locals: {}}
  authorize(req, res, function () {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})

test('growers/authorize: admin', function (t) {
  var req = {currentUser: {id: 5}, grower: {id: 2}, admin: 1}
  var res = {locals: {}}
  authorize(req, res, function () {
    t.ok(req.canEdit)
    t.ok(res.locals.canEdit)
    t.end()
  })
})

test('growers/authorize: regular user', function (t) {
  var req = {currentUser: {id: 2}, grower: {id: 1}}
  var res = {locals: {}}
  authorize(req, res, function () {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})

test('growers/authorize: authorized user', function (t) {
  var req = {currentUser: {id: 5}, grower: {id: 1}}
  var res = {locals: {}}
  authorize(req, res, function () {
    t.ok(req.canEdit)
    t.ok(res.locals.canEdit)
    t.end()
  })
})

test('growers/authorize: authorized user for different grower', function (t) {
  var req = {currentUser: {id: 5}, grower: {id: 2}}
  var res = {locals: {}}
  authorize(req, res, function () {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})
