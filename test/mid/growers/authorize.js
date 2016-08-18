var test = require('../../test')
var authorize = require('../../../mid/growers/authorize')

test('growers/authorize: missing user and grower', (t) => {
  var req = {}
  var res = {locals: {}}
  authorize(req, res, () => {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})

test('growers/authorize: missing user', (t) => {
  var req = {grower: {id: 1}}
  var res = {locals: {}}
  authorize(req, res, () => {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})

test('growers/authorize: missing grower', (t) => {
  var req = {currentUser: {id: 2}}
  var res = {locals: {}}
  authorize(req, res, () => {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})

test('growers/authorize: admin', (t) => {
  var req = {currentUser: {id: 5}, grower: {id: 2}, admin: 1}
  var res = {locals: {}}
  authorize(req, res, () => {
    t.ok(req.canEdit)
    t.ok(res.locals.canEdit)
    t.end()
  })
})

test('growers/authorize: regular user', (t) => {
  var req = {currentUser: {id: 2}, grower: {id: 1}}
  var res = {locals: {}}
  authorize(req, res, () => {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})

test('growers/authorize: authorized user', (t) => {
  var req = {currentUser: {id: 5}, grower: {id: 1}}
  var res = {locals: {}}
  authorize(req, res, () => {
    t.ok(req.canEdit)
    t.ok(res.locals.canEdit)
    t.end()
  })
})

test('growers/authorize: authorized user for different grower', (t) => {
  var req = {currentUser: {id: 5}, grower: {id: 2}}
  var res = {locals: {}}
  authorize(req, res, () => {
    t.ok(!req.canEdit)
    t.ok(!res.locals.canEdit)
    t.end()
  })
})
