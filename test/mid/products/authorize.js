var test = require('../../test')
var authorize = require('../../../mid/products/authorize')

test('products/authorize: missing user and product', function (t) {
  var req = {}
  var res = {locals: {}}
  authorize(req, res, function () {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})

test('products/authorize: missing user', function (t) {
  var req = {product: {growerId: 1}}
  var res = {locals: {}}
  authorize(req, res, function () {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})

test('products/authorize: missing product', function (t) {
  var req = {currentUser: {id: 2}}
  var res = {locals: {}}
  authorize(req, res, function () {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})

test('products/authorize: admin', function (t) {
  var req = {currentUser: {id: 5}, product: {growerId: 2}, admin: 1}
  var res = {locals: {}}
  authorize(req, res, function () {
    t.ok(req.canEdit)
    t.ok(res.locals.canEdit)
    t.end()
  })
})

test('products/authorize: regular user', function (t) {
  var req = {currentUser: {id: 2}, product: {growerId: 1}}
  var res = {locals: {}}
  authorize(req, res, function () {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})

test('products/authorize: authorized user', function (t) {
  var req = {currentUser: {id: 5}, product: {growerId: 1}}
  var res = {locals: {}}
  authorize(req, res, function () {
    t.ok(req.canEdit)
    t.ok(res.locals.canEdit)
    t.end()
  })
})

test('products/authorize: authorized user for different grower', function (t) {
  var req = {currentUser: {id: 5}, product: {growerId: 2}}
  var res = {locals: {}}
  authorize(req, res, function () {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})
