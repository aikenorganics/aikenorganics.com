const test = require('../../test')
const authorize = require('../../../mid/growers/authorize')

test('growers/authorize: missing user and grower', (t) => {
  const req = {}
  const res = {locals: {}}
  authorize(req, res, () => {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})

test('growers/authorize: missing user', (t) => {
  const req = {grower: {id: 1}}
  const res = {locals: {}}
  authorize(req, res, () => {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})

test('growers/authorize: missing grower', (t) => {
  const req = {currentUser: {id: 2}}
  const res = {locals: {}}
  authorize(req, res, () => {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})

test('growers/authorize: admin', (t) => {
  const req = {currentUser: {id: 5}, grower: {id: 2}, admin: 1}
  const res = {locals: {}}
  authorize(req, res, () => {
    t.ok(req.canEdit)
    t.ok(res.locals.canEdit)
    t.end()
  })
})

test('growers/authorize: regular user', (t) => {
  const req = {currentUser: {id: 2}, grower: {id: 1}}
  const res = {locals: {}}
  authorize(req, res, () => {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})

test('growers/authorize: authorized user', (t) => {
  const req = {currentUser: {id: 5}, grower: {id: 1}}
  const res = {locals: {}}
  authorize(req, res, () => {
    t.ok(req.canEdit)
    t.ok(res.locals.canEdit)
    t.end()
  })
})

test('growers/authorize: authorized user for different grower', (t) => {
  const req = {currentUser: {id: 5}, grower: {id: 2}}
  const res = {locals: {}}
  authorize(req, res, () => {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})
