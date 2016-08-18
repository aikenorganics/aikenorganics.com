const test = require('../../test')
const authorize = require('../../../mid/products/authorize')

test('products/authorize: missing user and product', (t) => {
  const req = {}
  const res = {locals: {}}
  authorize(req, res, () => {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})

test('products/authorize: missing user', (t) => {
  const req = {product: {growerId: 1}}
  const res = {locals: {}}
  authorize(req, res, () => {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})

test('products/authorize: missing product', (t) => {
  const req = {currentUser: {id: 2}}
  const res = {locals: {}}
  authorize(req, res, () => {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})

test('products/authorize: admin', (t) => {
  const req = {currentUser: {id: 5}, product: {growerId: 2}, admin: 1}
  const res = {locals: {}}
  authorize(req, res, () => {
    t.ok(req.canEdit)
    t.ok(res.locals.canEdit)
    t.end()
  })
})

test('products/authorize: regular user', (t) => {
  const req = {currentUser: {id: 2}, product: {growerId: 1}}
  const res = {locals: {}}
  authorize(req, res, () => {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})

test('products/authorize: authorized user', (t) => {
  const req = {currentUser: {id: 5}, product: {growerId: 1}}
  const res = {locals: {}}
  authorize(req, res, () => {
    t.ok(req.canEdit)
    t.ok(res.locals.canEdit)
    t.end()
  })
})

test('products/authorize: authorized user for different grower', (t) => {
  const req = {currentUser: {id: 5}, product: {growerId: 2}}
  const res = {locals: {}}
  authorize(req, res, () => {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})
