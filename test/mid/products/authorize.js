var test = require('../../test')
var authorize = require('../../../mid/products/authorize')

test('products/authorize: missing user and product', (t) => {
  var req = {}
  var res = {locals: {}}
  authorize(req, res, () => {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})

test('products/authorize: missing user', (t) => {
  var req = {product: {growerId: 1}}
  var res = {locals: {}}
  authorize(req, res, () => {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})

test('products/authorize: missing product', (t) => {
  var req = {currentUser: {id: 2}}
  var res = {locals: {}}
  authorize(req, res, () => {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})

test('products/authorize: admin', (t) => {
  var req = {currentUser: {id: 5}, product: {growerId: 2}, admin: 1}
  var res = {locals: {}}
  authorize(req, res, () => {
    t.ok(req.canEdit)
    t.ok(res.locals.canEdit)
    t.end()
  })
})

test('products/authorize: regular user', (t) => {
  var req = {currentUser: {id: 2}, product: {growerId: 1}}
  var res = {locals: {}}
  authorize(req, res, () => {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})

test('products/authorize: authorized user', (t) => {
  var req = {currentUser: {id: 5}, product: {growerId: 1}}
  var res = {locals: {}}
  authorize(req, res, () => {
    t.ok(req.canEdit)
    t.ok(res.locals.canEdit)
    t.end()
  })
})

test('products/authorize: authorized user for different grower', (t) => {
  var req = {currentUser: {id: 5}, product: {growerId: 2}}
  var res = {locals: {}}
  authorize(req, res, () => {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})
